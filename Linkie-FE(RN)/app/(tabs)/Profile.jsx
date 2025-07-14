import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Alert,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Keyboard,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useProfile } from "../../context/profileContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function Profile() {
  const router = useRouter();
  const [form, setForm] = useState({});
  const [errorBirth, setErrorBirth] = useState("");
  const [errorName, setErrorName] = useState("");

  const { fullName, birth, setFullName, setBirth } = useProfile();

  const { status } = useLocalSearchParams();

  useEffect(() => {
    if (status === "verified") {
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Tài khoản của bạn đã được xác minh!",
        position: "top",
        topOffset: 60,
      });
    }
  }, [status]);

  const validateForm = () => {
    if (!fullName || fullName.trim() === "") {
      setErrorName("Vui lòng nhập tên của bạn!");
      return false;
    }

    const raw = birth.replace(/[^\d]/g, "");
    if (raw.length !== 8) {
      setErrorBirth("Ngày sinh phải đủ 8 chữ số (DDMMYYYY)!");
      return false;
    }
    // const date_of_birth = `${raw.slice(4)}-${raw.slice(2, 4)}-${raw.slice(0, 2)}`;
    const day = parseInt(raw.slice(0, 2), 10);
    const month = parseInt(raw.slice(2, 4), 10);
    const year = parseInt(raw.slice(4, 8), 10);

    if (year < 1900 || year > new Date().getFullYear()) {
      setErrorBirth("Năm sinh không hợp lệ!");
      return false;
    }

    if (month < 1 || month > 12) {
      setErrorBirth("Tháng không hợp lệ!");
      return false;
    }

    const maxDay = new Date(year, month, 0).getDate();
    if (day < 1 || day > maxDay) {
      setErrorBirth("Ngày không hợp lệ!");
      return false;
    }

    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    const d = today.getDate() - birthDate.getDate();
    const exactAge = age - (m < 0 || (m === 0 && d < 0) ? 1 : 0);

    if (exactAge < 16) {
      setErrorBirth("Bạn phải đủ ít nhất 16 tuổi để tiếp tục!");
      return false;
    }

    const date_of_birth = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    setForm({
      full_name: fullName.trim(),
      date_of_birth: date_of_birth,
    });

    return true;
  };

  const formatBirthDate = (value) => {
    const digits = value.replace(/[^\d]/g, "").slice(0, 8); 
    const parts = [];

    if (digits.length >= 2) {
      parts.push(digits.slice(0, 2));
    } else if (digits.length > 0) {
      parts.push(digits);
    }

    if (digits.length >= 4) {
      parts.push(digits.slice(2, 4));
    } else if (digits.length > 2) {
      parts.push(digits.slice(2));
    }

    if (digits.length > 4) {
      parts.push(digits.slice(4));
    }

    return parts.join("/");
  };

  const handleBirthChange = (value) => {
    const formatted = formatBirthDate(value);
    setBirth(formatted);
    setErrorBirth("");
  };

  const handleNameChange = (text) => {
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]*$/u;

    if (!nameRegex.test(text)) {
      setErrorName("Tên chỉ được chứa chữ cái!");
    } else if (text.trim() === "") {
      setErrorName("Vui lòng nhập tên của bạn!");
    } else {
      setErrorName("");
    }

    setFullName(text);
  };

  const handleNameSubmit = () => {
    Keyboard.dismiss();
  };

  const handleClickNext = () => {
    if (validateForm()) {
      router.push("/(tabs)/About");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Hồ sơ của bạn</Text>

      <Text style={styles.subtitle}>
        Chúng tôi cần thông tin của bạn để {"\n"} tạo ra sự kết hợp hoàn hảo.
      </Text>

      <View style={styles.form}>
        <Text style={styles.formLabel}>Tên của bạn</Text>
        <View style={styles.input}>
          <TextInput
            style={[styles.inputName, errorName ? styles.inputError : null]}
            autoFocus={true}
            placeholder="Nhập tên của bạn"
            onSubmitEditing={handleNameSubmit}
            value={fullName}
            returnKeyType="done"
            onChangeText={handleNameChange}
          />
          {errorName && <Text style={styles.errorText}>{errorName}</Text>}
        </View>
        <View style={styles.form}>
          <Text style={styles.formLabel}>Ngày sinh của bạn</Text>
          <View style={styles.input}>
            <TextInput
              keyboardType="number-pad"
              maxLength={10}
              placeholder="DD/MM/YYYY"
              onChangeText={handleBirthChange}
              returnKeyType="done"
              style={[styles.inputName, errorBirth ? styles.inputError : null]}
              value={birth}
            />
            {errorBirth && <Text style={styles.errorText}>{errorBirth}</Text>}
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={handleClickNext} style={styles.btn}>
        <Text style={styles.btnText}>Tiếp theo</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#1D2A32",
    marginBottom: 6,
    marginTop: 20,
    textAlign: "center",
    fontStyle: "gothamrnd-bold",
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
  formLabel: {
    fontSize: 18,
    fontStyle: "gothamrnd",
    marginBottom: 10,
  },
  /** Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerBack: {
    padding: 8,
    paddingTop: 0,
    position: "relative",
    marginLeft: -16,
  },
  /** Input */
  birthContainer: {
    marginTop: 30,
  },
  input: {
    marginBottom: 10,
    position: "relative",
  },
  inputControl: {
    height: 50,
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    fontWeight: "500",
    color: "transparent",
    borderWidth: 1,
    borderColor: "#C9D3DB",
    borderStyle: "solid",
    zIndex: 2,
  },
  inputName: {
    height: 50,
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    fontWeight: "500",
    color: "#1D2A32",
    borderWidth: 1,
    borderColor: "#C9D3DB",
    borderStyle: "solid",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  /** Button */
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
