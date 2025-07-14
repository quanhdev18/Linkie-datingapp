import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import {
  login,
  sendOtp,
  verifyEmail,
  updateLocation,
} from "../../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";

const VerifyOtp = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { email, mode } = useLocalSearchParams();
  const textInput = useRef(null);
  const lengthInput = 6;

  const [internalVal, setInternalVal] = useState("");
  const [otpDigits, setOtpDigits] = useState(Array(lengthInput).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(120);

  const onChangeText = async (val) => {
    const numericVal = val.replace(/[^0-9]/g, "");
    setInternalVal(numericVal);

    const newOtpDigits = Array(lengthInput).fill("");
    for (let i = 0; i < numericVal.length; i++) {
      newOtpDigits[i] = numericVal[i];
    }
    setOtpDigits(newOtpDigits);

    if (numericVal.length === lengthInput) {
      try {
        setIsSubmitting(true);
        let response;
        if (mode === "register") {
          response = await verifyEmail({ email, otp: numericVal });
        } else {
          response = await login({ email, otp: numericVal });
        }

        if (response?.data?.access_token) {
          const { access_token, account_id, profile_id } = response.data;

          // await AsyncStorage.setItem("access_token", access_token);
          await AsyncStorage.setItem(
            "access_token",
            response.data.access_token
          );
          await AsyncStorage.setItem("user_email", email); // ✅ Lưu email tại đây

          if (account_id != null) {
            await AsyncStorage.setItem("account_id", account_id.toString());
            try {
              const { status } =
                await Location.requestForegroundPermissionsAsync();
              if (status === "granted") {
                const location = await Location.getCurrentPositionAsync({});
                const { latitude, longitude } = location.coords;
                await updateLocation(account_id, latitude, longitude);
              } else {
                console.warn("Không được cấp quyền vị trí");
              }
            } catch (error) {
              console.warn("Không thể lấy hoặc cập nhật vị trí:", error);
            }
          }

          if (profile_id != null) {
            await AsyncStorage.setItem("profile_id", profile_id.toString());
          }

          const nextPage =
            mode === "register" ? "/(tabs)/Profile" : "/(main)/star";
          router.push({
            pathname: nextPage,
            params: { status: "verified" },
          });
        } else {
          Alert.alert("Lỗi", "Mã OTP không đúng hoặc đã hết hạn");
        }
      } catch (error) {
        console.error("OTP Error:", error);
        Alert.alert("Lỗi", "Xác minh OTP thất bại");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      setResending(true);
      await sendOtp({ email });

      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Mã OTP đã được gửi lại!",
        position: "top",
      });

      setCountdown(120);
    } catch (error) {
      console.error("Resend OTP Error:", error);

      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Gửi lại mã OTP thất bại!",
        position: "top",
      });
    } finally {
      setResending(false);
    }
  };

  const focusTextInput = () => {
    textInput.current?.focus();
  };

  useEffect(() => {
    focusTextInput();
    navigation.setOptions({ headerShown: false });
  }, []);

  useEffect(() => {
    if (countdown === 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const formatCountdown = () => {
    const minutes = String(Math.floor(countdown / 60)).padStart(2, "0");
    const seconds = String(countdown % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="chevron-left" size={24} color="black" />
        </TouchableOpacity>

        <KeyboardAvoidingView
          keyboardVerticalOffset={50}
          behavior="padding"
          style={styles.containerAvoidingView}
        >
          <Text style={styles.title}>Nhập mã của bạn</Text>

          <TextInput
            ref={textInput}
            onChangeText={onChangeText}
            style={styles.hiddenInput}
            value={internalVal}
            maxLength={lengthInput}
            keyboardType="number-pad"
            autoFocus
          />

          <TouchableOpacity activeOpacity={1} onPress={focusTextInput}>
            <View style={styles.containerInput}>
              {otpDigits.map((digit, index) => (
                <View key={index} style={styles.cellView}>
                  <Text style={styles.cellText}>{digit}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleResendOtp}
            disabled={resending || countdown > 0}
            style={[styles.resendBtn, countdown > 0 && styles.disabledBtn]}
          >
            <Text
              style={[styles.resendText, countdown > 0 && styles.disabledText]}
            >
              {countdown > 0 ? `Gửi lại sau ${countdown}s` : "Gửi lại"}
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default VerifyOtp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 16,
    // paddingTop: 20,
  },
  containerAvoidingView: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
  title: {
    fontSize: 31,
    marginTop: 20,
    fontWeight: "700",
    color: "#1D2A32",
    marginBottom: 6,
    textAlign: "center",
  },
  containerInput: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  cellView: {
    paddingVertical: 11,
    width: 40,
    height: 40,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1.5,
    borderColor: "#000",
  },
  cellText: {
    textAlign: "center",
    fontSize: 16,
  },
  hiddenInput: {
    width: 0,
    height: 0,
    opacity: 0,
    position: "absolute",
  },
  resendBtn: {
    marginTop: 20,
  },
  resendText: {
    color: "#007BFF",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  disabledBtn: {
    opacity: 0.5,
  },
  disabledText: {
    color: "#999",
    textDecorationLine: "none",
  },
});
