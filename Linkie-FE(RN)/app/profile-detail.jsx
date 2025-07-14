// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import {
//   Feather,
//   MaterialIcons,
//   AntDesign,
//   Ionicons,
// } from "@expo/vector-icons";
// import { getProfileById, getProfileImage } from "../services/api";
// import FilterModal from "./_filter";

// const GENDER_OPTIONS = {
//   male: "Nam",
//   female: "Nữ",
// };

// const HOBBY_OPTIONS = {
//   listening_to_music: "Nghe nhạc",
//   singing: "Hát",
//   playing_guitar: "Chơi guitar",
//   running: "Chạy bộ",
//   yoga: "Yoga",
//   reading: "Đọc sách",
//   cooking: "Nấu ăn",
//   photography: "Chụp ảnh",
//   traveling: "Du lịch",
//   video_games: "Chơi game",
//   dog_lover: "Yêu chó",
//   meditation: "Thiền",
//   fashion: "Thời trang",
//   blogging: "Viết blog",
// };

// export default function ProfileDetail() {
//   const { id, name, age, location } = useLocalSearchParams();
//   const router = useRouter();
//   const [filterVisible, setFilterVisible] = useState(false);
//   const [profile, setProfile] = useState(null);
//   const [avatar, setAvatar] = useState(null);
//   const [otherImages, setOtherImages] = useState([]);

//   const swipeAndNext = (direction: "left" | "right") => {
//     console.log("Swiped", direction);
//   };

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = await AsyncStorage.getItem("access_token");
//         const data = await getProfileById(id, token);
//         setProfile(data);

//         if (data.images && data.images.length > 0) {
//           const urls = [];

//           for (let i = 0; i < data.images.length; i++) {
//             try {
//               const url = await getProfileImage(data.images[i].title);
//               urls.push(url);
//             } catch (err) {
//               console.error("Không tải được ảnh:", data.images[i].title);
//             }
//           }

//           setAvatar(urls[0]);
//           setOtherImages(urls.slice(1));
//         }
//       } catch (err) {
//         console.error("Lỗi lấy profile:", err);
//       }
//     };

//     fetchProfile();
//   }, []);

//   if (!profile) {
//     return <Text style={{ padding: 16 }}>Đang tải thông tin...</Text>;
//   }

//   const hobbyTextList = (profile.hobby || []).map((h) => HOBBY_OPTIONS[h] || h);

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()}>
//           <Feather name="chevron-left" size={28} color="black" />
//         </TouchableOpacity>

//         <View style={styles.topRightIcons}>
//           <TouchableOpacity onPress={() => setFilterVisible(true)}>
//             <Ionicons name="filter-sharp" size={20} color="black" />
//           </TouchableOpacity>
//           <Feather
//             name="more-horizontal"
//             size={20}
//             color="black"
//             style={styles.iconSpacing}
//           />
//         </View>
//         <FilterModal
//           visible={filterVisible}
//           onClose={() => setFilterVisible(false)}
//           onApply={(data) => {
//             console.log("Lọc với:", data);
//             setFilterVisible(false);
//           }}
//         />
//       </View>

//       <ScrollView>
//         {avatar && (
//           <View style={styles.imageBoxavatar}>
//             <Image
//               source={{ uri: avatar }}
//               style={{ width: "100%", height: "100%", borderRadius: 10 }}
//             />
//           </View>
//         )}

//         <View style={styles.info}>
//           <Text style={styles.name}>
//             {profile.username}, {age}
//           </Text>
//           <View style={styles.matchContainer}>
//             <Text style={styles.matchBox}>Lựa chọn khớp hoàn toàn</Text>
//             <Text style={styles.subMatch}>
//               Người này đáp ứng tất cả preferences của bạn
//             </Text>
//           </View>
//           <Text style={styles.location}>📍 {location}</Text>
//           <Text style={styles.description}>
//             {profile.bio || "Chưa có mô tả"}
//           </Text>
//         </View>

//         <Text style={styles.sectionTitle}>Sở thích</Text>
//         <View style={styles.tagContainer}>
//           {hobbyTextList.map((tag, i) => (
//             <View key={i} style={styles.tag}>
//               <Text style={styles.tagText}>{tag}</Text>
//             </View>
//           ))}
//         </View>

//         {otherImages.map((url, i) => (
//           <View key={i} style={styles.imageBox}>
//             <Image
//               source={{ uri: url }}
//               style={{ width: "100%", height: "100%", borderRadius: 10 }}
//             />
//           </View>
//         ))}
//       </ScrollView>

//       <View style={styles.iconsContainer}>
//         <TouchableOpacity
//           style={styles.iconX}
//           onPress={() => swipeAndNext("left")}
//         >
//           <MaterialIcons name="close" size={30} color="#FF385C" />
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.iconHeart}
//           onPress={() => swipeAndNext("right")}
//         >
//           <AntDesign name="heart" size={26} color="#FF385C" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Feather,
  MaterialIcons,
  AntDesign,
  Ionicons,
  FontAwesome
} from "@expo/vector-icons";
import { getProfileById, getProfileImage, likeUser } from "../services/api";
import FilterModal from "./_filter";
import MatchPopup from "./matchPopup";
import { SafeAreaView } from "react-native-safe-area-context";

const GENDER_OPTIONS = { male: "Nam", female: "Nữ" };
const HOBBY_OPTIONS = {
  listening_to_music: "Nghe nhạc",
  singing: "Hát",
  playing_guitar: "Chơi guitar",
  running: "Chạy bộ",
  yoga: "Yoga",
  reading: "Đọc sách",
  cooking: "Nấu ăn",
  photography: "Chụp ảnh",
  traveling: "Du lịch",
  video_games: "Chơi game",
  dog_lover: "Yêu chó",
  meditation: "Thiền",
  fashion: "Thời trang",
  blogging: "Viết blog",
};

export default function ProfileDetail() {
  const { id, name, age, location } = useLocalSearchParams();
  const router = useRouter();
  const [filterVisible, setFilterVisible] = useState(false);
  const [profile, setProfile] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [otherImages, setOtherImages] = useState([]);
  const [showMatchPopup, setShowMatchPopup] = useState(false);
  const [matchedUsernames, setMatchedUsernames] = useState(null);
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        const data = await getProfileById(id, token);
        setProfile(data);

        if (data.images && data.images.length > 0) {
          const urls = [];
          for (let i = 0; i < data.images.length; i++) {
            try {
              const url = await getProfileImage(data.images[i].title);
              urls.push(url);
            } catch (err) {
              console.error("Không tải được ảnh:", data.images[i].title);
            }
          }
          setAvatar(urls[0]);
          setOtherImages(urls.slice(1));
        }
      } catch (err) {
        console.error("Lỗi lấy profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const swipeAndNext = (direction) => {
    Animated.timing(translateX, {
      toValue: direction === "left" ? -500 : 500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      translateX.setValue(0);
      if (direction === "right") handleLike();
    });
  };

  const handleLike = async () => {
    try {
      const likerId = await AsyncStorage.getItem("account_id");
      const likedId = profile?.id;
      if (!likedId || !likerId) return;

      const res = await likeUser(likerId, likedId);
      if (res?.match) {
        setMatchedUsernames({
          user1: res.user1.username,
          user2: res.user2.username,
        });
        setShowMatchPopup(true);
      }
    } catch (error) {
      console.error("Lỗi khi like:", error.response?.data || error.message);
    }
  };

  if (!profile) {
    return <Text style={{ padding: 16 }}>Đang tải thông tin...</Text>;
  }

  const hobbyTextList = (profile.hobby || []).map((h) => HOBBY_OPTIONS[h] || h);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name="chevron-left" size={20} color="black" />
        </TouchableOpacity>
        <View style={styles.topRightIcons}>
          <TouchableOpacity onPress={() => setFilterVisible(true)}>
            <Ionicons name="filter-sharp" size={20} color="black" />
          </TouchableOpacity>
          <Feather name="more-horizontal" size={20} color="black" style={styles.iconSpacing} />
        </View>
        <FilterModal
          visible={filterVisible}
          onClose={() => setFilterVisible(false)}
          onApply={(data) => {
            console.log("Lọc với:", data);
            setFilterVisible(false);
          }}
        />
      </View>

      <Animated.ScrollView
        style={{
          transform: [{ translateX }],
          opacity: translateX.interpolate({
            inputRange: [-500, 0, 500],
            outputRange: [0, 1, 0],
          }),
        }}
      >
        {avatar && (
          <View style={styles.imageBoxavatar}>
            <Image source={{ uri: avatar }} style={{ width: "100%", height: "100%", borderRadius: 10 }} />
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.name}>{profile.username}, {age}</Text>
          <View style={styles.matchContainer}>
            <Text style={styles.matchBox}>Lựa chọn khớp hoàn toàn</Text>
            <Text style={styles.subMatch}>Người này đáp ứng tất cả preferences của bạn</Text>
          </View>
          <Text style={styles.location}>📍 {location}</Text>
          <Text style={styles.description}>{profile.bio || "Chưa có mô tả"}</Text>
        </View>

        <Text style={styles.sectionTitle}>Sở thích</Text>
        <View style={styles.tagContainer}>
          {hobbyTextList.map((tag, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {otherImages.map((url, i) => (
          <View key={i} style={styles.imageBox}>
            <Image source={{ uri: url }} style={{ width: "100%", height: "100%", borderRadius: 10 }} />
          </View>
        ))}
      </Animated.ScrollView>

      <View style={styles.iconsContainer}>
        <TouchableOpacity style={styles.iconX} onPress={() => swipeAndNext("left")}>
          <MaterialIcons name="close" size={30} color="#FF385C" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconHeart} onPress={() => swipeAndNext("right")}>
          <AntDesign name="heart" size={26} color="#FF385C" />
        </TouchableOpacity>
      </View>

      {showMatchPopup && matchedUsernames && (
        <MatchPopup
          userName={`${matchedUsernames.user1} & ${matchedUsernames.user2}`}
          onClose={() => setShowMatchPopup(false)}
          onSend={(message) => {
            console.log("Tin nhắn:", message);
            setShowMatchPopup(false);
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
  },
  header: {
    // paddingTop: 16,
    // paddingHorizontal: 16,
    // paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topRightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconSpacing: { marginRight: 5 },
  imageBoxavatar: {
    width: "90%",
    height: 400,
    alignSelf: "center",
    marginTop: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 12,
    paddingHorizontal: 20,
  },

  matchContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDD",
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,

    alignSelf: "center",
    maxWidth: "80%",
  },

  matchBox: {
    paddingHorizontal: 20,
    color: "#FF385C",
    fontWeight: "bold",
    marginTop: 4,
  },
  subMatch: {
    paddingHorizontal: 20,
    fontSize: 12,
    color: "gray",
    marginBottom: 4,
  },
  location: {
    paddingHorizontal: 20,
    fontSize: 14,
    color: "#888",
  },
  description: {
    fontSize: 16,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 24,
    paddingHorizontal: 20,
  },
  tagContainer: {
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 8,
    paddingHorizontal: 20,
  },
  
  tag: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    margin: 5,
  },
  tagText: {
    color: "black",
  },
  imageBox: {
    width: "90%",
    height: 300,
    alignSelf: "center",
    marginVertical: 10,
    borderRadius: 12,
    overflow: "hidden",
  },

  iconsContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 50,
    zIndex: 10,
  },
  iconX: {
    width: 60,
    height: 60,
    backgroundColor: "white",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    elevation: 5, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  iconHeart: {
    width: 60,
    height: 60,
    backgroundColor: "white",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    // position: "absolute",
    // left: 10,
    // top: 16,
    // zIndex: 10,

  },
});
