import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { fetchMatches, getAvatarImage } from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import defaultAvatar from "../../assets/images/image.png";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { Swipeable } from "react-native-gesture-handler";

export default function Chat() {
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true); // loading chung
  const [accountId, setAccountId] = useState(null);
  const [matches, setMatches] = useState([]);
  const [conversations, setConversations] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        setLoading(true); // bắt đầu loading

        try {
          const storedId = await AsyncStorage.getItem("account_id");
          if (storedId) {
            const parsedId = parseInt(storedId, 10);
            setAccountId(parsedId);

            // ✅ chạy song song cả 2 request
            const [matchRes, convRes] = await Promise.all([
              fetchMatches(parsedId),
              axios.get(
                `http://10.0.2.2:8000/messages/conversations/${parsedId}`
              ),
            ]);

            setMatches(matchRes);
            setConversations(convRes.data);
          }
        } catch (error) {
          console.error("Lỗi khi load dữ liệu:", error);
        } finally {
          setLoading(false); // kết thúc loading sau khi cả 2 xong
        }
      };

      loadData();

      return () => {};
    }, [])
  );

  const goToChat = (toUserId, toUsername, avatarObj) => {
    if (!toUserId || !accountId) return;

    const avatarUrl = avatarObj
      ? getAvatarImage(avatarObj.title || avatarObj)
      : null;

    router.push({
      pathname: "/(tabs)/Message",
      params: {
        userId: accountId,
        toUserId,
        toUsername,
        toAvatarUrl: avatarUrl,
      },
    });
  };

  const renderRightActions = (onUnmatch, onReport) => {
    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={onUnmatch}
          style={[styles.swipeButton, { backgroundColor: "#757575" }]}
        >
          <Text style={styles.swipeButtonText}>Xóa </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onReport}
          style={[styles.swipeButton, { backgroundColor: "#d32f2f" }]}
        >
          <Text style={styles.swipeButtonText}>Báo cáo</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleReport = (reportedUserId) => {
    if (!accountId || !reportedUserId) return;

    router.push({
      pathname: "/(tabs)/ReportUser",
      params: {
        reporterId: accountId.toString(),
        reportedId: reportedUserId.toString(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>Tin nhắn</Text>
        <TouchableOpacity onPress={() => setShowSettings(true)}>
          <Ionicons
            style={styles.navbarIcon}
            name="settings-outline"
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.scrollSection}>
        <Text style={styles.sectionTitle}>Tương tác mới</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {matches
            .filter(
              (matchUser) =>
                !conversations.some((conv) => conv.partner_id === matchUser.id)
            )
            .map((user, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() =>
                  goToChat(
                    user.id,
                    user.username || "Người dùng",
                    user.avatar || null
                  )
                }
              >
                <Image
                  source={
                    user.avatar
                      ? {
                          uri: getAvatarImage(user.avatar.title || user.avatar),
                        }
                      : defaultAvatar
                  }
                  style={styles.cardImage}
                />
                <Text style={styles.cardName}>
                  {user.username || "Chưa đặt tên"}
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>

      <View style={styles.messageSection}>
        <Text style={styles.sectionTitle}>Tin nhắn</Text>

        {conversations.length === 0 ? (
          <Text style={styles.emptyMessageText}>
            Tin nhắn của bạn sẽ hiển thị tại đây sau khi bạn có cuộc trò chuyện
            đầu tiên.
          </Text>
        ) : (
          conversations.map((conv) => (
            <Swipeable
              key={conv.partner_id}
              renderRightActions={() =>
                renderRightActions(
                  () => handleUnmatch(conv.partner_id),
                  () => handleReport(conv.partner_id)
                )
              }
            >
              <TouchableOpacity
                style={styles.messageItem}
                onPress={() =>
                  goToChat(
                    conv.partner_id,
                    conv.partner_name,
                    conv.partner_avatar
                  )
                }
              >
                <Image
                  source={
                    conv.partner_avatar
                      ? {
                          uri: getAvatarImage(
                            conv.partner_avatar.title || conv.partner_avatar
                          ),
                        }
                      : defaultAvatar
                  }
                  style={styles.avatar}
                />

                <View style={styles.messageContent}>
                  <Text style={styles.messageName}>{conv.partner_name}</Text>
                  <Text style={styles.messageText} numberOfLines={1}>
                    {conv.last_message}
                  </Text>
                  <Text style={styles.messageTime}>
                    {new Date(conv.last_time).toLocaleString()}
                  </Text>
                </View>
              </TouchableOpacity>
            </Swipeable>
          ))
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
  },
  navbar: {
    paddingBottom: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navbarTitle: {
    fontSize: 25,
    fontFamily: "gothamrnd-bold",
  },
  navbarIcon: {},

  scrollSection: {
    marginTop: 10,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    fontFamily: "gothamrnd-medium",
  },

  scrollContainer: {
    flexDirection: "row",
    gap: 12,
  },

  card: {
    width: 110,
    height: 150,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },

  cardImage: {
    width: "100%",
    height: "100%",
  },

  cardName: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 6,
    fontFamily: "gothamrnd-medium",
  },

  messageSection: {
    flex: 1,
    marginTop: 10,
  },

  emptyMessageText: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    color: "gray",
    fontSize: 16,
    fontStyle: "italic",
    paddingHorizontal: 20,
  },

  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    position: "relative",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "white",
  },
  messageContent: {
    flex: 1,
    marginLeft: 15,
  },
  messageName: {
    fontSize: 18,
    fontFamily: "gothamrnd-bold",
    marginBottom: 5,
  },
  messageText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "gothamrnd",
  },
  messageTime: {
    color: "gray",
    fontSize: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "blue",
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -6 }],
  },
  swipeButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 90,
    height: "100%",
  },
  swipeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
