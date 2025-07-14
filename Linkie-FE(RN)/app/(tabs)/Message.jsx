import { SafeAreaView, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import ChatBox from "./ChatBox";

export default function ChatScreen() {
  const { userId, toUserId, toUsername, toAvatarUrl } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      <ChatBox
        userId={parseInt(userId)}
        toUserId={parseInt(toUserId)}
        toUsername={toUsername || "Người dùng"}
        toAvatarUrl={toAvatarUrl } // mặc định nếu thiếu
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
