import { useRouter, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useProfile } from "../../context/profileContext";
import { SafeAreaView } from "react-native-safe-area-context";

const Hoping = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const { target, setTarget } = useProfile();

  const [selectedOption, setSelectedOption] = useState(null);
  const [showOnProfile, setShowOnProfile] = useState(false);

  const [switchValue, setSwitchValue] = useState(false);
  const toggleSwitch = () => setSwitchValue((previousState) => !previousState);

  const genders = [
    { id: "1", label: "Người yêu" },
    { id: "2", label: "Một người bạn đời" },
    { id: "3", label: "Những người bạn mới" },
    { id: "4", label: "Quan hệ không ràng buộc" },
    { id: "5", label: "Mình cũng chưa rõ lắm" },
  ];
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const handleSelectOption = (option) => {
    if (selectedOption !== option.id) {
      setSelectedOption(option.id);
      setTarget({
        id: option.id,
        label: option.label,
      });
    }
  };

  const handleNext = () => {
    if (selectedOption) {
      router.push("/(tabs)/Select");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <TouchableOpacity onPress={() => router.back()}>
        <FontAwesome name="chevron-left" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Bạn đang tìm kiếm {"\n"} điều gì?</Text>
      <View style={styles.subtitle}>
        <Text style={{ fontSize: 16, textAlign: "center" }}>
          Nếu bạn thay đổi suy nghĩ thì cũng không sao. Sẽ luôn có ai đó phù hợp
          với mục đích của bạn
        </Text>
      </View>
      <View style={styles.form}>
        {genders.map((gender) => (
          <TouchableOpacity
            key={gender.id}
            style={styles.radioOption}
            onPress={() => handleSelectOption(gender)}
          >
            <Text style={styles.radioLabel}>{gender.label}</Text>
            <View style={styles.radioCircle}>
              {selectedOption === gender.id && (
                <View style={styles.radioSelected} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.btn,
          { backgroundColor: selectedOption ? "#000" : "#ccc" },
        ]}
        onPress={handleNext}
        disabled={!selectedOption}
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
    fontWeight: "bold",
    marginTop: 20,
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
  form: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    marginTop: 24,
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

export default Hoping;
