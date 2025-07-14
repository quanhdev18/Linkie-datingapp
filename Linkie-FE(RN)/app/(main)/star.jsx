import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  Feather,
  AntDesign,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";
import FilterModal from "../_filter";
import { useRouter } from "expo-router";
import {
  getProfiles,
  likeUser,
  getLikedUsers,
  getLocationByAccountId,
  getLocationName,
} from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MatchPopup from "../matchPopup";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Star() {
  const router = useRouter();
  const [profiles, setProfiles] = useState([]);
  const [accountId, setAccountId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const user = profiles[currentIndex];
  const [showMatchPopup, setShowMatchPopup] = useState(false);
  const [matchedUsernames, setMatchedUsernames] = useState(null);
  const [locationNames, setLocationNames] = useState({});

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        const id = await AsyncStorage.getItem("account_id");

        if (id) {
          const parsedId = parseInt(id);
          setAccountId(parsedId);

          // ✅ lấy danh sách đã like đúng cách
          const [allProfiles, likedUsers] = await Promise.all([
            getProfiles(token),
            getLikedUsers(parsedId),
          ]);

          const likedIds = likedUsers.map((item) => item.liked_id);

          // ✅ loại bản thân và những người đã like
          const dataFiltered = allProfiles.filter(
            (user) =>
              user.account_id !== parsedId &&
              !likedIds.includes(user.account_id)
          );

          if (!filterData) {
            setProfiles(dataFiltered);
          } else {
            console.log("Filter Data:", filterData);

            const filtered = dataFiltered.filter((user) => {
              const age =
                new Date().getFullYear() -
                new Date(user.date_of_birth).getFullYear();

              const ageMatch =
                age >= filterData.minAge && age <= filterData.maxAge;

              const genderMatch =
                !filterData.gender ||
                filterData.gender.length === 0 ||
                filterData.gender.includes(user.gender);

              const orientationMatch =
                !filterData.orientation ||
                filterData.orientation.length === 0 ||
                filterData.orientation.includes(user.orientation);

              const relationshipMatch =
                !filterData.relationship ||
                filterData.relationship.length === 0 ||
                filterData.relationship.includes(user.relationship);

              return (
                ageMatch && genderMatch && orientationMatch && relationshipMatch
              );
            });

            setProfiles(filtered);
          }
        }
      } catch (error) {
        console.log("Lỗi:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [filterData]);

  const fetchLocationName = async (accountId) => {
    try {
      // Nếu đã có thì không gọi lại
      if (locationNames[accountId]) return;

      const location = await getLocationByAccountId(accountId);
      if (location?.latitude && location?.longitude) {
        const name = await getLocationName(
          location.latitude,
          location.longitude
        );
        setLocationNames((prev) => ({ ...prev, [accountId]: name }));
      } else {
        setLocationNames((prev) => ({
          ...prev,
          [accountId]: "Không rõ vị trí",
        }));
      }
    } catch (err) {
      console.error("Lỗi khi lấy vị trí:", err);
      setLocationNames((prev) => ({ ...prev, [accountId]: "Không rõ vị trí" }));
    }
  };

  useEffect(() => {
    if (user?.account_id) {
      fetchLocationName(user.account_id);
    }
  }, [user]);

  const handleNextUser = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === profiles.length - 1 ? 0 : prevIndex + 1
    );
  };

  const swipeAndNext = (direction) => {
    Animated.timing(translateX, {
      toValue: direction === "left" ? -500 : 500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      translateX.setValue(0);
      handleNextUser();
    });
  };

  const handleLike = async (likedUser) => {
    try {
      const likerId = await AsyncStorage.getItem("account_id");
      // const likedId = likedUser?.id;
      const likedId = likedUser.account_id;

      if (!likerId || !likedId) return;

      const result = await likeUser(likedId, likerId);

      if (result.match) {
        setMatchedUsernames({
          user1: "Bạn",
          user2: likedUser.username,
        });
        setShowMatchPopup(true);
      }

      setProfiles((prev) => prev.filter((u) => u.account_id !== likedId));
      setCurrentIndex((prevIndex) =>
        prevIndex >= profiles.length - 1 ? 0 : prevIndex
      );

      swipeAndNext("right");
    } catch (error) {
      console.error("Lỗi khi like:", error.message);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF385C" />
      </SafeAreaView>
    );
  }

  if (profiles.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <TouchableOpacity
          onPress={() => {
            setLoading(true);
            setFilterData(null);
          }}
        >
          <View style={styles.retryContainer}>
            <Ionicons name="refresh" size={32} color="#FF385C" />
            <Text style={styles.retryText}>
              Không có hồ sơ, nhấn để tải lại
            </Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Linkies</Text>
        <TouchableOpacity onPress={() => setFilterVisible(true)}>
          <Ionicons name="filter-sharp" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={(data) => {
          setFilterData(data);
          setFilterVisible(false);
        }}
      />

      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/profile-detail",
            params: {
              id: user.id,
              name: user.username,
              age:
                new Date().getFullYear() -
                new Date(user.date_of_birth).getFullYear(),
              location: "Chưa có",
              image: user.images[0]?.url || "",
            },
          })
        }
      >
        <Animated.View
          style={[
            styles.imagePlaceholder,
            {
              transform: [{ translateX }],
              opacity: translateX.interpolate({
                inputRange: [-500, 0, 500],
                outputRange: [0, 1, 0],
              }),
            },
          ]}
        >
          {user.images.length > 0 ? (
            <Image
              source={{ uri: user.images[0].url }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholderInner}>
              <Text>Không có ảnh</Text>
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <View style={styles.textContent}>
          <Text style={styles.dateText}>
            {user.username},{" "}
            {new Date().getFullYear() -
              new Date(user.date_of_birth).getFullYear()}
          </Text>
          <View style={styles.locationContainer}>
            <Feather name="map-pin" size={20} color="white" />
            {/* <Text style={styles.locationText}>Chưa cập nhật</Text> */}
            <Text style={styles.locationText}>
              {locationNames[user.account_id] || "Đang tải vị trí..."}
            </Text>
          </View>
        </View>
        <View style={styles.iconsContainer}>
          <TouchableOpacity
            style={styles.iconX}
            onPress={() => swipeAndNext("left")}
          >
            <MaterialIcons name="close" size={30} color="#FF385C" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconHeart}
            onPress={() => handleLike(user)}
          >
            <AntDesign name="heart" size={26} color="#FF385C" />
          </TouchableOpacity>
        </View>
      </View>
      {showMatchPopup && matchedUsernames && (
        <>
          {console.log("Render MatchPopup với:", matchedUsernames)}
          <MatchPopup
            userName={`${matchedUsernames.user1} & ${matchedUsernames.user2}`}
            onClose={() => setShowMatchPopup(false)}
            onSend={(message) => {
              console.log("Tin nhắn gửi:", message);
              setShowMatchPopup(false);
            }}
          />
        </>
      )}
    </SafeAreaView>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    // paddingRight: 15,
    // paddingLeft: 15,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    fontFamily: "gothamrnd-bold",
    fontSize: 25,
  },
  imagePlaceholder: {
    height: "93%",
    alignItems: "center",
    marginTop: 24,
    alignSelf: "center",
    width: "100%",
    aspectRatio: 2 / 3.75,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 40,
    left: 30,
    right: 30,
  },
  textContent: {
    flex: 1,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  iconsContainer: {
    flexDirection: "column-reverse",
    alignItems: "center",
    gap: 15,
    marginBottom: 10,
  },
  iconX: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  iconHeart: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dateText: {
    color: "#fff",
    fontSize: 30,
    marginBottom: 5,
    fontFamily: "gothamrnd-bold",
  },
  locationText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "gothamrnd",
  },
  retryContainer: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderColor: "#FF385C",
    backgroundColor: "#FFF5F7",
  },
  retryText: {
    marginTop: 10,
    color: "#FF385C",
    fontSize: 16,
    fontWeight: "500",
  },
});
