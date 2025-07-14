import { useRouter, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useProfile } from "../../context/profileContext";
import { SafeAreaView } from "react-native-safe-area-context";

const About = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const { gender, setGender } = useProfile();

  const [selectedGender, setSelectedGender] = useState(null);
  const [showOnProfile, setShowOnProfile] = useState(false);

  const [switchValue, setSwitchValue] = useState(false);
  const toggleSwitch = () => setSwitchValue((previousState) => !previousState);

  const genders = [
    { id: "1", label: "Nam", value: "male" },
    { id: "2", label: "Nữ", value: "female" },
    { id: "3", label: "Khác", value: "other" },
  ];

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const handleGenderSelect = (id, value) => {
    setSelectedGender(id);
    setGender(value);
  };

  const handleNext = () => {
    if (selectedGender) {
      setGender(selectedGender);
      router.push("/(tabs)/Gender");
    }
    if (showOnProfile) {
      setShowOnProfile(true);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Giới tính của bạn?</Text>
        <View style={styles.subtitle}>
          <Text style={{ fontSize: 16, textAlign: "center" }}>
            Chọn tất cả lựa chọn mô tả đúng với bạn để chúng tôi hiển thị hồ sơ
            của bạn với người phù hợp. Bạn có thể thêm thông tin nếu muốn.
          </Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.question}>Giới tính nào mô tả bạn tốt nhất?</Text>

          {genders.map((gender) => (
            <TouchableOpacity
              key={gender.id}
              style={styles.radioOption}
              onPress={() => handleGenderSelect(gender.id, gender.value)}
            >
              <Text style={styles.radioLabel}>{gender.label}</Text>
              <View style={styles.radioCircle}>
                {selectedGender === gender.id && (
                  <View style={styles.radioSelected} />
                )}
              </View>
            </TouchableOpacity>
          ))}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ marginRight: 10, fontSize: 16 }}>
              Hiển thị giới tính
            </Text>
            <Switch onValueChange={toggleSwitch} value={switchValue} />
          </View>

          <Text style={styles.note}>Bạn luôn có thể cập nhật điều này sau</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.btn,
            { backgroundColor: selectedGender ? "#000" : "#ccc" },
          ]}
          onPress={handleNext}
          disabled={!selectedGender}
        >
          <Text style={styles.btnText}>Tiếp theo</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 30,
    marginTop: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "500",
    color: "#929292",
    textAlign: "center",
  },
  question: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,

    padding: 12,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#000",
  },
  radioLabel: {
    fontSize: 16,
  },
  note: {
    fontSize: 16,
    color: "#999",
    marginTop: 20,
    marginBottom: 30,
    textAlign: "center",
  },
  form: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    marginTop: 24,
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

export default About;
