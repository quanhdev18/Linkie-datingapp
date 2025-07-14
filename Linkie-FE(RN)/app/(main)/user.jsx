import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Switch,
  Animated,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  getProfileById,
  uploadAvatar,
  getAvatarImage,
  deactivateAccountByEmail,
} from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import defaultAvatar from "../../assets/images/image.png";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserProfile() {
  const router = useRouter();
  const [packages, setPackages] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);
  const toggleSwitch = () => setSwitchValue((previousState) => !previousState);
  const [profile, setProfile] = useState(null);
  const [avatarUri, setAvatarUri] = useState(null);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("access_token");
      await AsyncStorage.removeItem("refresh_token");

      router.replace("/");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể đăng xuất. Vui lòng thử lại.");
    }
  };

  const handlePress = (item) => {
    Toast.show({
      type: "info",
      text1: "Coming soon",
      text2: `Gói ${item.name} sẽ sớm được ra mắt!`, // ✅ Sửa ở đây
      position: "top",
    });
  };

  const handlePickAndUploadAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const selectedImage = result.assets[0];

        // ✅ Lấy email từ AsyncStorage thay vì profile
        const email = await AsyncStorage.getItem("user_email");

        if (!email) {
          Alert.alert("Lỗi", "Không tìm thấy email người dùng.");
          return;
        }

        const response = await uploadAvatar(email, selectedImage.uri);
        const avatarUrl = getAvatarImage(response.title);
        setAvatarUri(avatarUrl);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải ảnh đại diện.");
      console.error("Upload avatar error:", error);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc muốn vô hiệu hóa tài khoản không? Bạn sẽ không thể sử dụng ứng dụng trừ khi đăng ký lại.",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Vô hiệu hóa",
          style: "destructive",
          onPress: async () => {
            try {
              const email = await AsyncStorage.getItem("user_email");
              if (!email) {
                Alert.alert("Lỗi", "Không tìm thấy email người dùng.");
                return;
              }

              await deactivateAccountByEmail(email);
              Toast.show({
                type: "success",
                text1: "Tài khoản đã bị vô hiệu hóa",
                position: "top",
              });

              await AsyncStorage.clear();
              router.replace("/");
            } catch (err) {
              Alert.alert(
                "Lỗi",
                err.message || "Không thể vô hiệu hóa tài khoản."
              );
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetch("http://10.0.2.2:8000/packages")
      .then((res) => res.json())
      .then((data) => setPackages(data))
      .catch((err) => console.error("Lỗi tải packages:", err));
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const idStr = await AsyncStorage.getItem("profile_id");
        if (!idStr) throw new Error("Chưa có profile_id trong AsyncStorage");

        const profileId = parseInt(idStr, 10);
        const data = await getProfileById(profileId);
        console.log("Dữ liệu hồ sơ:", data);
        setProfile(data);

        if (data?.avatar?.title) {
          const avatarUrl = getAvatarImage(data.avatar.title);
          setAvatarUri(avatarUrl);
        }
      } catch (err) {
        console.error("Lỗi khi tải profile:", err);
      }
    };

    fetchProfile();
  }, []);

  console.log(avatarUri);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Hồ sơ</Text>
        <TouchableOpacity onPress={() => setShowSettings(true)}>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Modal
        transparent
        visible={showSettings}
        animationType="slide"
        onRequestClose={() => setShowSettings(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setShowSettings(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.header2}>
              <Text style={styles.modalTitle}>Cài đặt</Text>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <Text style={styles.closeText}>Xong</Text>
              </TouchableOpacity>
            </View>

            <View>
              <Text style={styles.titleSetting}>Tài khoản</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: "7",
              }}
            >
              <Text
                style={{
                  marginRight: 10,
                  fontSize: 16,
                  fontFamily: "gothamrnd-medium",
                }}
              >
                Tạm dừng ghép đôi
              </Text>
              <Switch onValueChange={toggleSwitch} value={switchValue} />
            </View>
            <TouchableOpacity style={styles.dropdownButton}>
              <Text style={styles.dropdownText}>Thông báo</Text>
              <Text style={styles.arrow}>▼</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dropdownButton}>
              <Text style={styles.dropdownText}>Quyền riêng tư</Text>
              <Text style={styles.arrow}>▼</Text>
            </TouchableOpacity>

            {/* Các mục dropdown */}
            <View>
              <Text style={styles.titleSetting}>Trợ giúp</Text>
            </View>
            <TouchableOpacity style={styles.dropdownButton}>
              <Text style={styles.dropdownText}>Trung tâm trợ giúp</Text>
              <Text style={styles.arrow}>▼</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dropdownButton}>
              <Text style={styles.dropdownText}>Điều khoản và bảo mật</Text>
              <Text style={styles.arrow}>▼</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dropdownButton}>
              <Text style={styles.dropdownText}>Liên hệ</Text>
              <Text style={styles.arrow}>▼</Text>
            </TouchableOpacity>

            {/* Nút hành động */}
            <View style={styles.buttonfooter}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleLogout}
              >
                <Text style={styles.actionText}>Đăng xuất</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={handleDeleteAccount}
              >
                <Text style={[styles.actionText, styles.deleteText]}>
                  Xóa tài khoản
                </Text>
              </TouchableOpacity>
            </View>
            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerTitle}>Linkies</Text>
              <Text style={styles.footerVersion}>Phiên bản 1.0.0</Text>
              <Text style={styles.footerVersion}>Tạo bởi Linkie </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Avatar + Info */}
      <View style={styles.profileContainer}>
        {/* <Image source={defaultAvatar} style={styles.avatar} /> */}
        <View style={styles.avatarWrapper}>
          <Image
            source={avatarUri ? { uri: avatarUri } : defaultAvatar}
            style={styles.avatar}
          />

          <TouchableOpacity
            style={styles.addIcon}
            onPress={handlePickAndUploadAvatar}
          >
            <Ionicons name="add" size={16} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{profile?.username || "Đang tải..."}</Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push("/profileScreen")}
          >
            <Text style={styles.editButtonText}>Chỉnh sửa hồ sơ</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.vipTitle}>Nâng cấp ngay để trải nghiệm</Text>
      <FlatList
        data={packages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const cleanName = item.name.trim().toLowerCase().replace(/\s+/g, "");

          const isBoost = cleanName === "boost";
          const isMapMatch = cleanName === "mapmatch+";

          return (
            <TouchableOpacity
              style={[
                styles.packageBox,
                isBoost && styles.boostBox,
                isMapMatch && styles.mapMatchBox,
              ]}
              onPress={() => handlePress(item)}
            >
              <View style={styles.packageHeader}>
                <Text style={styles.packageTitle}>{item.name}</Text>
                {isBoost && <Text style={styles.badge}>🔥 Best Seller</Text>}
                {isMapMatch && <Text style={styles.badge}>🕐 Coming Soon</Text>}
              </View>
              <Text style={styles.packageDescription}>{item.description}</Text>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.packageList}
      />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "",
  },
  title: {
    fontSize: 25,
    fontFamily: "gothamrnd-bold",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 16,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 12,
  },

  avatarWrapper: {
    position: "relative",
    width: 70,
    height: 70,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  addIcon: {
    position: "absolute",
    top: 3,
    right: 1,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    zIndex: 100,
    elevation: 10,
  },

  infoContainer: {
    flex: 1,
  },

  name: {
    fontSize: 25,
    fontFamily: "gothamrnd-bold",
    marginBottom: 6,
  },

  editButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
  },

  editButtonText: {
    fontSize: 16,
    fontFamily: "gothamrnd",
  },

  vipTitle: {
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 10,
    fontFamily: "gothamrnd-medium",
  },

  packageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  boostBox: {
    backgroundColor: "#E3F2FD", // nền xanh nhạt
    borderColor: "#2196F3", // viền xanh
    borderWidth: 1.5,
    shadowColor: "#2196F3",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  mapMatchBox: {
    backgroundColor: "#FFF3E0", // nền vàng nhạt
    borderColor: "#FF9800", // viền cam
    borderWidth: 1.5,
    shadowColor: "#FF9800",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  badge: {
    backgroundColor: "#FF5722",
    color: "white",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "bold",
    overflow: "hidden",
  },

  badgeSoon: {
    backgroundColor: "#2196F3",
  },

  packageList: {
    gap: 15,
  },

  packageBox: {
    backgroundColor: "#fbefff",
    padding: 16,
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e0b3ff",
  },

  packageTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 4,
  },

  packageDescription: {
    fontSize: 14,
    color: "#000000",
  },
  modalOverlay: {
    flex: 1,
    // justifyContent: "flex-end",
    // backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 40,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  header2: {
    flexDirection: "row",
    marginBottom: 25,
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "gothamrnd-bold",
  },
  closeText: {
    fontSize: 16,
    color: "green",
    position: "absolute",
    left: 116,
    fontFamily: "gothamrnd",
  },
  titleSetting: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: "gothamrnd-bold",
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: "gothamrnd",
  },
  arrow: {
    fontSize: 14,
    alignSelf: "center",
  },

  buttonfooter: {
    alignItems: "center",
    paddingTop: "50",
  },
  actionButton: {
    width: 250,
    borderWidth: 1,
    borderRadius: 24,
    paddingVertical: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  actionText: {
    fontSize: 16,
    fontFamily: "gothamrnd",
  },
  deleteButton: {
    width: 250,
    borderColor: "red",
  },
  deleteText: {
    color: "red",
  },
  footer: {
    alignItems: "center",
    marginTop: 15,
  },
  footerTitle: {
    fontSize: 18,
    fontFamily: "gothamrnd-bold",
    marginBottom: 2,
  },
  footerVersion: {
    fontSize: 12,
    fontFamily: "gothamrnd",
  },
});
