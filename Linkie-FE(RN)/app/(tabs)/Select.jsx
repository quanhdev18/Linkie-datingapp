import { useRouter, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useProfile } from "../../context/profileContext";
import { createProfile } from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const Select = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { fullName, birth, gender, target, hobby, bio, setHobby } =
    useProfile();

  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const interests = [
    "listening_to_music",
    "singing",
    "running",
    "cooking",
    "blogging",
    "reading",
    "photography",
    "traveling",
    "fashion",
  ];

  const toggleInterest = (interest) => {
    let updatedInterests;
    if (selectedInterests.includes(interest)) {
      updatedInterests = selectedInterests.filter((item) => item !== interest);
    } else {
      if (selectedInterests.length < 5) {
        updatedInterests = [...selectedInterests, interest];
      } else {
        return;
      }
    }

    setSelectedInterests(updatedInterests);
    setHobby(updatedInterests);
    console.log("Sở thích đã chọn:", updatedInterests);
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  // const handleSubmit = async () => {
  //   if (isSubmitting) return; // Chặn nếu đang submit
  //   setIsSubmitting(true);

  //   try {
  //     setHobby(selectedInterests);
  //     const raw = birth.replace(/[^\d]/g, ""); // bỏ dấu "/"
  //     const formattedBirth =
  //       raw.length === 8
  //         ? `${raw.substring(4, 8)}-${raw.substring(2, 4)}-${raw.substring(
  //             0,
  //             2
  //           )}`
  //         : "";

  //     const token = await AsyncStorage.getItem("access_token"); // 👈 lấy token từ AsyncStorage

  //     if (!token) {
  //       throw new Error("Không tìm thấy token đăng nhập.");
  //     }
  //     const profileData = {
  //       username: fullName || "", // ✅ đổi full_name thành username
  //       gender: gender === "1" ? "male" : "female", // ✅ đổi số thành chuỗi
  //       date_of_birth: formattedBirth || "", // ✅ đã đúng định dạng yyyy-mm-dd
  //       bio: bio || "",
  //       target_type: target?.value || "", // ✅ gửi chuỗi đơn giản
  //       hobby: selectedInterests || [],
  //     };
  //     console.log("Dữ liệu gửi đi:", profileData);

  //     const response = await createProfile(profileData, token);

  //     const profileId = response?.data?.profile_id;
  //     if (!profileId) {
  //       throw new Error("Không lấy được profile_id từ phản hồi.");
  //     }

  //     // ✅ Lưu profile_id vào AsyncStorage
  //     await AsyncStorage.setItem("profile_id", profileId.toString());
  //     console.log("Đã lưu profile_id:", profileId);

  //     router.push("/(tabs)/Upload");
  //   } catch (error) {
  //     Alert.alert(error);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      setHobby(selectedInterests);

      const raw = birth.replace(/[^\d]/g, "");
      const formattedBirth =
        raw.length === 8
          ? `${raw.substring(4, 8)}-${raw.substring(2, 4)}-${raw.substring(
              0,
              2
            )}`
          : "";

      const token = await AsyncStorage.getItem("access_token");
      if (!token) throw new Error("Không tìm thấy token đăng nhập.");

      const profileData = {
        username: fullName || "",
        gender: gender === "1" ? "male" : "female",
        date_of_birth: formattedBirth || "",
        bio: bio || "",
        target_type: target?.value || "",
        hobby: selectedInterests || [],
      };

      console.log("Dữ liệu gửi đi:", profileData);

      const response = await createProfile(profileData, token);
      console.log("Phản hồi API:", response);

      const profileId = response?.data?.id;

      if (!profileId) {
        throw new Error("Không lấy được profile_id từ phản hồi.");
      }

      await AsyncStorage.setItem("profile_id", profileId.toString());
      console.log("Đã lưu profile_id:", profileId);
      //     router.push("/(tabs)/Upload");
      router.push("/(tabs)/Upload");
    } catch (error) {
      Alert.alert("Lỗi", error.message || "Đã xảy ra lỗi khi tạo hồ sơ.");
      console.error("Lỗi tạo hồ sơ:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.form}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome name="chevron-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Bạn thích điều gì?</Text>

          <Text style={styles.description}>
            Bạn có những sở thích của mình. Giờ hãy cho mọi người cùng biết nhé.
          </Text>

          <View style={styles.interestsContainer}>
            {interests.map((interest, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.interestButton,
                  selectedInterests.includes(interest) &&
                    styles.selectedInterest,
                ]}
                onPress={() => toggleInterest(interest)}
              >
                <Text style={styles.interestText}>{interest}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <TouchableOpacity
          style={[
            styles.btn,
            selectedInterests.length === 5 && styles.activeNextButton,
            {
              backgroundColor: selectedInterests.length === 5 ? "#000" : "#ccc",
            },
          ]}
          disabled={selectedInterests.length !== 5}
          onPress={handleSubmit}
        >
          <Text style={styles.btnText}>Tiếp theo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  form: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  title: {
    fontSize: 30,
    marginTop: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "500",
    color: "#929292",
    textAlign: "center",
  },
  description: {
    fontSize: 18,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  interestButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
  },
  selectedInterest: {
    backgroundColor: "#fff",
    borderColor: "#000",
  },
  interestText: {
    fontSize: 16,
    color: "#333",
  },
  btn: {
    width: "100%",
    height: 50,
    borderRadius: 50,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});

export default Select;
