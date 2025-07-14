// app/(tabs)/ReportUser.jsx





// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ScrollView,
// } from "react-native";
// import React, { useState } from "react";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import axios from "axios";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Toast from "react-native-toast-message";

// const reasons = {
//   "Giả mạo tài khoản": [
//     "Tài khoản giả mạo tôi",
//     "Tài khoản giả mạo bạn của tôi",
//     "Tài khoản giả mạo người nổi tiếng",
//   ],
//   "Quấy rối": [
//     "Ngôn từ thù ghét",
//     "Tin nhắn không mong muốn",
//     "Quấy rối ngoài đời thực",
//   ],
//   "Lừa đảo": ["Lừa đảo tình cảm", "Yêu cầu gửi tiền"],
// };

// export default function ReportUser() {
//   const router = useRouter();
//   const { reporterId, reportedId } = useLocalSearchParams();
//   const [selectedReason, setSelectedReason] = useState("");
//   const [selectedDescription, setSelectedDescription] = useState("");

//   const showToast = (type, text1, text2 = "") => {
//     Toast.show({
//       type,
//       text1,
//       text2,
//       position: "top",
//       visibilityTime: 3000,
//     });
//   };

//   const handleSubmit = async () => {
//     if (!selectedReason || !selectedDescription) {
//       showToast("error", "Thiếu thông tin", "Hãy chọn đầy đủ lý do và tình huống.");
//       return;
//     }

//     try {
//       await axios.post("http://10.0.2.2:8000/reports/account", {
//         reporter_id: parseInt(reporterId),
//         reported_id: parseInt(reportedId),
//         reason: selectedReason,
//         description: selectedDescription,
//       });

//       showToast("success", "Thành công", "Đã gửi báo cáo.");
//       router.back();
//     } catch (error) {
//       console.error(error);
//       showToast("error", "Lỗi", "Gửi báo cáo thất bại.");
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container} edges={["top"]}>
//       <ScrollView contentContainerStyle={styles.container}>
//         <Text style={styles.title}>Báo cáo người dùng</Text>

//         <Text style={styles.subtitle}>Chọn lý do:</Text>
//         {Object.keys(reasons).map((reason) => (
//           <TouchableOpacity
//             key={reason}
//             style={[
//               styles.option,
//               selectedReason === reason && styles.selectedOption,
//             ]}
//             onPress={() => {
//               setSelectedReason(reason);
//               setSelectedDescription(""); // reset
//             }}
//           >
//             <Text>{reason}</Text>
//           </TouchableOpacity>
//         ))}

//         {selectedReason && (
//           <>
//             <Text style={styles.subtitle}>Chọn tình huống:</Text>
//             {reasons[selectedReason].map((desc) => (
//               <TouchableOpacity
//                 key={desc}
//                 style={[
//                   styles.option,
//                   selectedDescription === desc && styles.selectedOption,
//                 ]}
//                 onPress={() => setSelectedDescription(desc)}
//               >
//                 <Text>{desc}</Text>
//               </TouchableOpacity>
//             ))}
//           </>
//         )}

//         <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//           <Text style={styles.submitText}>Gửi báo cáo</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingHorizontal: 15,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontWeight: "600",
//     marginTop: 12,
//   },
//   option: {
//     padding: 12,
//     backgroundColor: "#eee",
//     borderRadius: 8,
//     marginTop: 6,
//   },
//   selectedOption: {
//     backgroundColor: "#c8e6c9",
//   },
//   submitButton: {
//     backgroundColor: "#d32f2f",
//     padding: 14,
//     borderRadius: 8,
//     marginTop: 24,
//   },
//   submitText: {
//     color: "#fff",
//     textAlign: "center",
//     fontWeight: "bold",
//   },
// });
// app/(tabs)/ReportUser.jsx
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const reasons = {
  fake_account: [
    "Tài khoản giả mạo tôi",
    "Tài khoản giả mạo bạn của tôi",
    "Tài khoản giả mạo người nổi tiếng",
  ],
  harassment: [
    "Ngôn từ thù ghét",
    "Tin nhắn không mong muốn",
    "Quấy rối ngoài đời thực",
  ],
  scam: ["Lừa đảo tình cảm", "Yêu cầu gửi tiền"],
};

const reasonLabels = {
  fake_account: "Giả mạo tài khoản",
  harassment: "Quấy rối",
  scam: "Lừa đảo",
};

export default function ReportUser() {
  const router = useRouter();
  const { reporterId, reportedId } = useLocalSearchParams();
  const [selectedReason, setSelectedReason] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [detailDescription, setDetailDescription] = useState("");

  const showToast = (type, text1, text2 = "") => {
    Toast.show({
      type,
      text1,
      text2,
      position: "top",
      visibilityTime: 3000,
    });
  };

  const handleSubmit = async () => {
    if (!selectedReason || !selectedDescription) {
      showToast("error", "Thiếu thông tin", "Hãy chọn đầy đủ lý do và tình huống.");
      return;
    }

    try {
      await axios.post("http://10.0.2.2:8000/reports/account", {
        reporter_id: parseInt(reporterId),
        reported_id: parseInt(reportedId),
        reason: reasonLabels[selectedReason],
        description: selectedDescription,
        detail_description: detailDescription || null,
      });

      showToast("success", "Thành công", "Đã gửi báo cáo.");
      router.back();
    } catch (error) {
      console.error("Lỗi gửi báo cáo:", error.response?.data || error.message);
      showToast("error", "Lỗi", "Gửi báo cáo thất bại.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Báo cáo người dùng</Text>

        <Text style={styles.subtitle}>Chọn lý do:</Text>
        {Object.keys(reasons).map((reason) => (
          <TouchableOpacity
            key={reason}
            style={[
              styles.option,
              selectedReason === reason && styles.selectedOption,
            ]}
            onPress={() => {
              setSelectedReason(reason);
              setSelectedDescription(""); // reset tình huống nếu đổi lý do
            }}
          >
            <Text>{reasonLabels[reason]}</Text>
          </TouchableOpacity>
        ))}

        {selectedReason !== "" && (
          <>
            <Text style={styles.subtitle}>Chọn tình huống:</Text>
            {reasons[selectedReason].map((desc) => (
              <TouchableOpacity
                key={desc}
                style={[
                  styles.option,
                  selectedDescription === desc && styles.selectedOption,
                ]}
                onPress={() => setSelectedDescription(desc)}
              >
                <Text>{desc}</Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.subtitle}>Mô tả chi tiết (tùy chọn):</Text>
            <TextInput
              style={styles.textInput}
              multiline
              placeholder="Bạn có thể nhập thêm chi tiết về vấn đề..."
              value={detailDescription}
              onChangeText={setDetailDescription}
            />
          </>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Gửi báo cáo</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 15,
  },
  subtitle: {
    fontWeight: "600",
    marginTop: 12,
  },
  option: {
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginTop: 6,
  },
  selectedOption: {
    backgroundColor: "#c8e6c9",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#d32f2f",
    padding: 14,
    borderRadius: 8,
    marginTop: 24,
  },
  submitText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

