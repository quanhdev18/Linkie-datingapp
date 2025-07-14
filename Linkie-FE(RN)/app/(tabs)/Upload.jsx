// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
  
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { FontAwesome } from "@expo/vector-icons";
// import { useRouter, useNavigation } from "expo-router";
// import { uploadProfileImage } from "../../services/api";
// import { SafeAreaView } from "react-native-safe-area-context";

// const Upload = () => {
//   const router = useRouter();
//   const navigation = useNavigation();
//   const [photos, setPhotos] = useState(Array(6).fill(null));

//   // const pickImage = async () => {
//   //   let result = await ImagePicker.launchImageLibraryAsync({
//   //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
//   //     allowsEditing: true,
//   //     aspect: [1, 1],
//   //     quality: 1,
//   //   });

//   //   if (!result.canceled) {
//   //     const newPhotos = [...photos];
//   //     const firstEmptyIndex = newPhotos.findIndex((p) => p === null);
//   //     if (firstEmptyIndex !== -1) {
//   //       newPhotos[firstEmptyIndex] = result.assets[0].uri;
//   //       setPhotos(newPhotos);
//   //     }
//   //   }
//   // };
//   const profileId = 1;
//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsMultipleSelection: true,
//       selectionLimit: 6,
//       allowsEditing: false,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       const selectedUris = result.assets.map((a) => a.uri);
//       const newPhotos = [...photos];
//       let insertIndex = 0;
//       for (
//         let i = 0;
//         i < newPhotos.length && insertIndex < selectedUris.length;
//         i++
//       ) {
//         if (newPhotos[i] === null) {
//           newPhotos[i] = selectedUris[insertIndex++];
//         }
//       }
//       setPhotos(newPhotos);

//       try {
//         await uploadProfileImage(profileId, selectedUris);
//         console.log("Uploaded multiple profile images thành công");
//       } catch (error) {
//         console.error("Lỗi upload ảnh:", error.message);
//       }
//     }
//   };

//   const removePhoto = (index) => {
//     const newPhotos = [...photos];
//     newPhotos[index] = null;

//     const filteredPhotos = newPhotos.filter((p) => p !== null);
//     while (filteredPhotos.length < 6) {
//       filteredPhotos.push(null);
//     }

//     setPhotos(filteredPhotos);
//   };

//   useEffect(() => {
//     navigation.setOptions({
//       headerShown: false,
//     });
//   });

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>

//         <TouchableOpacity onPress={() => router.back()}>
//           <FontAwesome name="chevron-left" size={24} color="black" />
//         </TouchableOpacity>
//         <Text style={styles.title}>Thêm ảnh gần đây của bạn</Text>
//         <Text style={styles.subtitle}>
//           Xinh chào! Hãy thêm 2 bức ảnh để bắt đầu.
//         </Text>

//         <View style={styles.form}>
//           <View style={styles.photosContainer}>
//             {photos.map((photo, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={styles.photoBox}
//                 onPress={() => {
//                   if (!photo) pickImage();
//                 }}
//               >
//                 {photo ? (
//                   <>
//                     <Image source={{ uri: photo }} style={styles.photo} />
//                     <TouchableOpacity
//                       style={styles.removeButton}
//                       onPress={() => removePhoto(index)}
//                     >
//                       <Text style={styles.removeText}>×</Text>
//                     </TouchableOpacity>
//                   </>
//                 ) : (
//                   <Text style={styles.plusSign}>+</Text>
//                 )}
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         <TouchableOpacity
//           style={[
//             styles.btn,
//             photos.some((photo) => photo !== null) && styles.activeNextButton,
//             // {
//             //   backgroundColor: photos.some((photo) => photo !== null)
//             //     ? "#000"
//             //     : "#ccc",
//             // },
//           ]}
//           // disabled={!photos.some((photo) => photo !== null)}
//           onPress={() => router.replace("/(tabs)/Map")}
//         >
//           <Text style={styles.btnText}>Tiếp theo</Text>
//         </TouchableOpacity>
    
//     </SafeAreaView>
//   );
// };
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { uploadProfileImage } from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const Upload = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [photos, setPhotos] = useState(Array(6).fill(null));

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 6,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedUris = result.assets.map((a) => a.uri);
      const newPhotos = [...photos];
      let insertIndex = 0;
      for (
        let i = 0;
        i < newPhotos.length && insertIndex < selectedUris.length;
        i++
      ) {
        if (newPhotos[i] === null) {
          newPhotos[i] = selectedUris[insertIndex++];
        }
      }
      setPhotos(newPhotos);

      try {
        const profileIdStr = await AsyncStorage.getItem("profile_id");
        const profileId = parseInt(profileIdStr, 10);
        if (!profileId) throw new Error("Không tìm thấy profile_id");

        await uploadProfileImage(profileId, selectedUris);
        console.log("Upload ảnh profile thành công!");
      } catch (error) {
        console.error("Lỗi upload ảnh:", error.message);
        Alert.alert("Lỗi", "Không thể upload ảnh. Vui lòng thử lại.");
      }
    }
  };

  const removePhoto = (index) => {
    const newPhotos = [...photos];
    newPhotos[index] = null;

    const filteredPhotos = newPhotos.filter((p) => p !== null);
    while (filteredPhotos.length < 6) {
      filteredPhotos.push(null);
    }

    setPhotos(filteredPhotos);
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <TouchableOpacity onPress={() => router.back()}>
        <FontAwesome name="chevron-left" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Thêm ảnh gần đây của bạn</Text>
      <Text style={styles.subtitle}>
        Xinh chào! Hãy thêm 2 bức ảnh để bắt đầu.
      </Text>

      <View style={styles.form}>
        <View style={styles.photosContainer}>
          {photos.map((photo, index) => (
            <TouchableOpacity
              key={index}
              style={styles.photoBox}
              onPress={() => {
                if (!photo) pickImage();
              }}
            >
              {photo ? (
                <>
                  <Image source={{ uri: photo }} style={styles.photo} />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removePhoto(index)}
                  >
                    <Text style={styles.removeText}>×</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={styles.plusSign}>+</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.btn,
          photos.some((photo) => photo !== null) && styles.activeNextButton,
        ]}
        onPress={() => router.push("/(tabs)/Map")}
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
  content: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    marginTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
  },
  form: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    marginTop: 24,
  },
  photosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  photoBox: {
    width: "30%",
    height: 40,
    aspectRatio: 1,
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative", // ➤ thêm dòng này
    overflow: "hidden",
  },
  plusSign: {
    fontSize: 40,
    color: "#999",
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 9,
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

  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 10,
    width: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  removeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 20,
  },
});

export default Upload;
