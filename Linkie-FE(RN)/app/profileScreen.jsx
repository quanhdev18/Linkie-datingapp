// screens/ProfileScreen.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import EditProfile from "./edit-profile";
import PreviewProfile from "./preview-profile";
import { Ionicons } from "@expo/vector-icons"; // hoặc 'react-native-vector-icons/Ionicons'
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState("edit");
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      {/* Tab tiêu đề */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          {/* <Ionicons name="chevron-back" size={24} color="black" /> */}
          <FontAwesome name="chevron-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Hồ sơ hẹn hò</Text>
        <View style={styles.tabs}>
          <TouchableOpacity onPress={() => setActiveTab("edit")}>
            <Text
              style={[styles.tab, activeTab === "edit" && styles.activeTab]}
            >
              Chỉnh sửa
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("preview")}>
            <Text
              style={[styles.tab, activeTab === "preview" && styles.activeTab]}
            >
              Xem trước
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Nội dung từng tab */}
      {activeTab === "edit" ? <EditProfile /> : <PreviewProfile />}
    </SafeAreaView>

  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
  },
  header: {
    alignItems: "center",
    paddingVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  tab: {
    fontSize: 16,
    color: "#999",
    paddingBottom: 8,
    marginHorizontal: 30,
  },
  activeTab: {
    color: "red",
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: "red",
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: 16,
    zIndex: 10,

  },
});
