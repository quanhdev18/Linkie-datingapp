import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const router = useRouter();

  return (
    <SafeAreaView edges={['top']}>
      <Image
        source={require("../assets/images/login.jpg")}
        style={{
          width: "100%",
          height: 530,
        }}
      />
      <View style={styles.container}>
        <Text
          style={{
            paddingTop: 40,
            fontSize: 30,
            fontFamily: "gothamrnd-bold",
            textAlign: "center",
          }}
        >
          Linkies
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontFamily: "gothamrnd-medium",
            textAlign: "center",
            marginTop: 10,
            paddingBottom: 35,
          }}
        >
          Hẹn hò thế hệ mới - dễ như chat!
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.btnSignUp}
            onPress={() => router.push("auth/sign-in")}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#000",
                fontSize: 20,
                fontFamily: "gothamrnd-medium",
              }}
            >
              Đăng nhập
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnSignIn}
            onPress={() => router.push("auth/sign-up")}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#000",
                fontSize: 20,
                fontFamily: "gothamrnd-medium",
              }}
            >
              Đăng ký
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            textAlign: "center",
            marginTop: 20,
            fontFamily: "gothamrnd",
            fontSize: 14,
            color: "#000",
          }}
        >
          Bằng cách đăng ký, bạn đồng ý với Điều khoản của chúng tôi. Xem cách
          chúng tôi sử dụng dữ liệu của bạn trong Chính sách bảo mật.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: "100%",
    paddingHorizontal: 25,
  },
  btnSignUp: {
    padding: 10,
    backgroundColor: "#fff",
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 99,
    marginBottom: 20,
  },
  btnSignIn: {
    padding: 10,
    backgroundColor: "#fff",
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 99,
  },
    buttonContainer: {
    marginTop: 30,
  },
});
