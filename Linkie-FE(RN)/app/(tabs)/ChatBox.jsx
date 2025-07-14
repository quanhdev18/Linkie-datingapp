import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  Clipboard,
  Alert,
  ToastAndroid,
} from "react-native";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, Feather } from "@expo/vector-icons";
import defaultAvatar from "../../assets/images/image.png";

const ChatBox = ({ userId, toUserId, toUsername, toAvatarUrl }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const scrollRef = useRef(null);
  const API_BASE_URL = "http://10.0.2.2:8000";
  const navigation = useNavigation();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/messages/history`, {
          params: {
            user1_id: userId,
            user2_id: toUserId,
          },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy lịch sử:", err);
      }
    };

    fetchHistory();
  }, [userId, toUserId]);

  useEffect(() => {
    const ws = new WebSocket(
      `${API_BASE_URL.replace("http", "ws")}/ws/chat/${userId}`
    );

    ws.onopen = () => {
      console.log("✅ WebSocket đã kết nối");
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        setMessages((prev) => [...prev, msg]);
      } catch (error) {
        console.error("Lỗi khi nhận WebSocket:", error);
      }
    };

    ws.onerror = (err) => {
      console.error("❌ WebSocket error:", err.message);
    };

    return () => ws.close();
  }, [userId]);

  const sendMessage = () => {
    if (!socket || socket.readyState !== 1 || !content.trim()) {
      console.warn("Socket chưa sẵn sàng hoặc nội dung rỗng");
      return;
    }

    const message = {
      from_user_id: userId,
      to_user_id: toUserId,
      content: content,
    };

    socket.send(JSON.stringify(message));
    setMessages((prev) => [...prev, message]);
    setContent("");
  };

  const handleLongPress = (item) => {
    // Mở popup hoặc alert cho các hành động
    Alert.alert(
      "Tin nhắn",
      "Chọn hành động",
      [
        {
          text: "Sao chép",
          onPress: () => {
            Clipboard.setString(item.content);
            ToastAndroid.show("Đã sao chép!", ToastAndroid.SHORT);
          },
        },
        {
          text: "Trả lời",
          onPress: () => {
            setContent(`@${item.content} `); // Gợi ý reply đơn giản
          },
        },
        {
          text: "Hủy",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onLongPress={() => handleLongPress(item)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.message,
          item.from_user_id === userId ? styles.myMessage : styles.theirMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.content}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <FontAwesome name="chevron-left" size={20} color="black" />
          </TouchableOpacity>

          <View style={styles.userInfo}>
            <Image
              source={
                toAvatarUrl ? { uri: toAvatarUrl } : defaultAvatar // dùng ảnh local nếu không có URL
              }
              style={styles.avatar}
            />

            <Text style={styles.username}>{toUsername || "User"}</Text>
          </View>

          <View style={styles.icons}>
            <Feather name="phone" size={24} color="black" />
            <Feather name="video" size={24} color="black" />
            <Feather
              name="more-horizontal"
              size={20}
              color="black"
              style={styles.iconSpacing}
            />
          </View>
        </View>

        <FlatList
          ref={scrollRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
          contentContainerStyle={styles.messageContainer}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={content}
            onChangeText={setContent}
            placeholder="Nhập tin nhắn..."
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Feather name="send" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingTop: 0,
  },
  messageContainer: { padding: 10 },
  message: {
    marginVertical: 4,
    padding: 10,
    borderRadius: 8,
    maxWidth: "80%",
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#4caf50",
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e0e0e0",
  },
  messageText: { color: "#000" },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginRight: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },

  backButton: {
    position: "absolute",
    left: 10,
    top: 21,
    zIndex: 10,
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 29,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 18,
    marginRight: 8,
  },

  username: {
    fontWeight: "bold",
    fontSize: 20,
  },

  icons: {
    flexDirection: "row",
    gap: 15,
  },

  icon: {
    fontSize: 18,
    marginHorizontal: 6,
  },
  iconSpacing: {
    marginRight: 5,
    alignSelf: "center",
  },
  sendButton: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatBox;
