import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getProfileById,
  getProfileImage,
  getLocationName,
  getLocationByAccountId,
} from "../services/api";

const GENDER_OPTIONS = {
  male: "Nam",
  female: "Nữ",
};

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

const PreviewProfile = () => {
  const [profile, setProfile] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [otherImages, setOtherImages] = useState([]);
  const [showOrientation, setShowOrientation] = useState(false);
  const [locationText, setLocationText] = useState("Chưa rõ vị trí");

  const getAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const ageDiff = Date.now() - birthDate.getTime();
    return Math.floor(ageDiff / (1000 * 3600 * 24 * 365.25));
  };

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const profileId = await AsyncStorage.getItem("profile_id");
  //       if (!profileId) return;

  //       const data = await getProfileById(profileId);
  //       setProfile(data);

  //       if (data.images && data.images.length > 0) {
  //         const urls = [];

  //         for (let i = 0; i < data.images.length; i++) {
  //           try {
  //             console.log("Đang tải ảnh với tên:", data.images[i].title);
  //             const url = await getProfileImage(data.images[i].title); // ✅ dùng title
  //             urls.push(url);
  //           } catch (err) {
  //             console.error("Không tải được ảnh:", data.images[i].title, err);
  //           }
  //         }

  //         setAvatar(urls[0]);
  //         setOtherImages(urls.slice(1)); // ảnh còn lại
  //       }
  //     } catch (err) {
  //       console.error("Lỗi lấy profile:", err);
  //     }
  //   };

  //   fetchProfile();
  // }, []);
  const fetchProfile = async () => {
    try {
      const profileId = await AsyncStorage.getItem("profile_id");
      const accountId = await AsyncStorage.getItem("account_id");
      if (!profileId || !accountId) return;

      // Lấy thông tin hồ sơ
      const data = await getProfileById(profileId);
      setProfile(data);

      // Lấy vị trí từ account_id → gọi API location
      const location = await getLocationByAccountId(accountId);
      if (location?.latitude && location?.longitude) {
        const locationName = await getLocationName(
          location.latitude,
          location.longitude
        );
        setLocationText(locationName);
      } else {
        setLocationText("Chưa rõ vị trí");
      }

      // Load ảnh hồ sơ
      if (data.images && data.images.length > 0) {
        const urls = [];
        for (let i = 0; i < data.images.length; i++) {
          try {
            const url = await getProfileImage(data.images[i].title);
            urls.push(url);
          } catch (err) {
            console.error("Không tải được ảnh:", data.images[i].title, err);
          }
        }

        setAvatar(urls[0]);
        setOtherImages(urls.slice(1));
      }
    } catch (err) {
      console.error("Lỗi lấy profile:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) {
    return <Text style={{ padding: 16 }}>Đang tải thông tin...</Text>;
  }

  const age = getAge(profile.date_of_birth);
  const hobbyTextList = (profile.hobby || []).map((h) => HOBBY_OPTIONS[h] || h);
  // console.log(profile);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Ảnh đại diện */}
      <View style={styles.imageBoxavatar}>
        {avatar && (
          <Image
            source={{ uri: avatar }}
            style={{ width: "100%", height: "100%", borderRadius: 10 }}
          />
        )}
      </View>

      {/* Tên, tuổi, mô tả */}
      <Text style={styles.name}>
        {profile.username}, {age}
      </Text>
      <Text style={styles.description}>{profile.bio || "Chưa có mô tả."}</Text>

      {/* Thông tin */}
      <View style={styles.infoRow}>
        <Text style={styles.icon}>💘</Text>
        <Text style={styles.infoText}>
          {profile.target_type ? profile.target_type : "Chưa có mục tiêu"}
        </Text>
      </View>

      {/* <View style={styles.infoRow}>
        <Text style={styles.icon}>📍</Text>
        <Text style={styles.infoText}>
          {profile.location || "Chưa rõ vị trí"}
        </Text>
      </View> */}
      <View style={styles.infoRow}>
        <Text style={styles.icon}>📍</Text>
        <Text style={styles.infoText}>{locationText}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.icon}>📏</Text>
        <Text style={styles.infoText}>
          {profile.height ? `${profile.height} cm` : "Chưa rõ chiều cao"}
        </Text>
      </View>

      {showOrientation && (
        <View style={styles.infoRow}>
          <Text style={styles.icon}>🌈</Text>
          <Text style={styles.infoText}>
            {profile.orientation || "Chưa rõ xu hướng"}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.infoRow}
        onPress={() => setShowOrientation(!showOrientation)}
      >
        <Text style={styles.dotIcon}>⋯</Text>
        <Text style={styles.infoText}>
          {showOrientation
            ? "Ẩn bớt"
            : `Xem thêm về ${profile.username || "người dùng"}`}
        </Text>
      </TouchableOpacity>

      {/* Sở thích */}
      <Text style={styles.sectionTitle}>Sở thích</Text>
      <View style={styles.tagContainer}>
        {hobbyTextList.map((tag, i) => (
          <View key={i} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      {/* Ảnh khác */}
      {otherImages.map((url, i) => (
        <View key={i} style={styles.imageBox}>
          <Image
            source={{ uri: url }}
            style={{ width: "100%", height: "100%", borderRadius: 10 }}
          />
        </View>
      ))}
    </ScrollView>
  );
};

export default PreviewProfile;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  imageBoxavatar: {
    width: "100%",
    aspectRatio: 1 / 1,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 10,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  imageBox: {
    width: "100%",
    aspectRatio: 1 / 1,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 10,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  description: {
    marginBottom: 8,
    fontSize: 16,
  },
  sectionTitle: {
    marginTop: 12,
    fontWeight: "600",
    fontSize: 18,
  },
  infoText: {
    marginVertical: 2,
  },
  tagContainer: {
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    margin: 6,
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
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },

  icon: {
    marginRight: 8,
    fontSize: 16,
  },

  infoText: {
    fontSize: 15,
    color: "#333",
  },
  dotIcon: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#333",
    marginRight: 8,
    lineHeight: 24,
  },
});
