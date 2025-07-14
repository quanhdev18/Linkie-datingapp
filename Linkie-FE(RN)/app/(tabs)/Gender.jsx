import { useRouter, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useProfile } from "../../context/profileContext";
import { SafeAreaView } from "react-native-safe-area-context";

const Gender = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const { bio, setBio } = useProfile();

  const [selectedGender, setSelectedGender] = useState(null);
  const [bioText, setBioText] = useState(bio || ""); // State local cho bio

  const [switchValue, setSwitchValue] = useState(false);
  const toggleSwitch = () => setSwitchValue((previousState) => !previousState);

  const genders = [
    { id: "1", label: "Nam", value: "male" },
    { id: "2", label: "Nữ", value: "female" },
    { id: "3", label: "Mọi người", value: "all" },
  ];

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const handleNext = () => {
    setBio(bioText);

    if (selectedGender) {
      const selected = genders.find((g) => g.id === selectedGender);
      setBioText({
        value: selected.value,
      });
      router.push("/(tabs)/Hoping");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <TouchableOpacity onPress={() => router.back()}>
        <FontAwesome name="chevron-left" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Bạn muốn gặp ai?</Text>
      <View style={styles.subtitle}>
        <Text style={{ fontSize: 18 }}>
          Chọn tất cả lựa chọn đúng với bạn để giúp chúng tôi đề xuất cho bạn
          người phù hợp.
        </Text>
      </View>
      <View style={styles.form}>
        {genders.map((gender) => (
          <TouchableOpacity
            key={gender.id}
            style={styles.radioOption}
            onPress={() => setSelectedGender(gender.id)}
          >
            <Text style={styles.radioLabel}>{gender.label}</Text>
            <View style={styles.radioCircle}>
              {selectedGender === gender.id && (
                <View style={styles.radioSelected} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.nextButton,
          { backgroundColor: selectedGender ? "#000" : "#ccc" },
        ]}
        onPress={handleNext}
        disabled={!selectedGender}
      >
        <Text style={styles.nextButtonText}>Tiếp theo</Text>
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
  form: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    marginTop: 24,
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
  nextButton: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 40,
    alignItems: "center",
    marginTop: 20,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Gender;
