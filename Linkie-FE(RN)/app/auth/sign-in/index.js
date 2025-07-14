import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { login, sendOtp, verifyEmail } from "../../../services/api";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignIn() {
  const router = useRouter();
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [errEmail, setErrEmail] = useState("");

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const handleNameSubmit = () => {
    Keyboard.dismiss();
  };

  const isValidEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleContinue = async () => {
    const trimmedEmail = email.trim();
    setEmail(trimmedEmail);

    if (trimmedEmail === "") {
      setErrEmail("Vui lòng nhập email của bạn!");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setErrEmail("Email không hợp lệ!");
      return;
    }

    setErrEmail("");

    try {
      await sendOtp({ email: trimmedEmail });

      router.push({
        pathname: "/auth/verify-otp",
        params: { email: trimmedEmail, mode: "login" },
      });
    } catch (error) {
      console.error("Send OTP error:", error);
      Toast.show({
        type: "error",
        text1: "Email chưa được đăng ký",
        position: "top",
      });
    }
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    if (value === "") {
      setErrEmail("Vui lòng nhập email của bạn!");
    } else {
      setErrEmail("");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <TouchableOpacity onPress={() => router.back()}>
        <FontAwesome name="chevron-left" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Nhập lại email để đăng nhập!!</Text>

      <View style={styles.form}>
        <View style={styles.input}>
          <TextInput
            style={styles.inputControl}
            placeholder="Nhập email của bạn"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={true}
            returnKeyType="done"
            value={email}
            onChangeText={handleEmailChange}
            onSubmitEditing={handleNameSubmit}
          />
          {errEmail && <Text style={styles.errMessage}>{errEmail}</Text>}
        </View>
        <Text style={styles.subtitle}>
          Chúng tôi sẽ gửi mã xác thực qua email để đảm bảo đây là bạn. Vui lòng
          kiểm tra hộp thư của bạn.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Tiếp theo</Text>
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
    marginTop: 20,
    lineHeight: 50,
    fontWeight: "700",
    color: "#1D2A32",
    marginBottom: 6,
    paddingHorizontal: 20,
    fontStyle: "gothamrnd-bold",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#929292",
    fontStyle: "gothamrnd",
  },
  form: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    marginTop: 24,
    paddingHorizontal: 20,
  },
  input: {
    marginBottom: 16,
  },
  inputControl: {
    width: "100%",
    paddingLeft: 20,
    height: 50,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  errMessage: {
    color: "red",
    fontSize: 14,
    marginTop: 4,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: "#000",
    borderColor: "#000",
  },
  buttonText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    color: "#fff",
  },
});
