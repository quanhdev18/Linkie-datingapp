import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import FilterModal from "../_filter";
import {
  getNearbyUsers,
  updateLocation,
  getAvatarImage,
} from "../../services/api";
import { darkMapStyle } from "../mapStyle";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Heart() {
  const [filterVisible, setFilterVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accountId, setAccountId] = useState(null);

  useEffect(() => {
    let subscription;

    const startWatchingLocation = async () => {
      try {
        const id = await AsyncStorage.getItem("account_id");
        if (!id) return;
        const parsedId = parseInt(id);
        setAccountId(parsedId);

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Lỗi", "Không có quyền truy cập vị trí");
          return;
        }

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 10,
          },
          async (loc) => {
            const lat = loc.coords.latitude;
            const lng = loc.coords.longitude;

            setLocation({ latitude: lat, longitude: lng });

            try {
              await updateLocation(parsedId, lat, lng);
            } catch (error) {
              console.error("Lỗi cập nhật vị trí:", error);
            }
          }
        );
      } catch (err) {
        console.error("Lỗi khởi tạo vị trí:", err);
        Alert.alert("Lỗi", "Không thể tải vị trí.");
      } finally {
        setLoading(false);
      }
    };

    startWatchingLocation();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  // Mỗi khi có location, thì fetch nearby users
  useEffect(() => {
    if (!location || !accountId) return;

    const fetchNearbyUsers = async () => {
      try {
        const users = await getNearbyUsers(accountId, 10);
        setNearbyUsers(users);
      } catch (error) {
        console.error("Lỗi khi lấy người gần:", error);
      }
    };

    fetchNearbyUsers();
  }, [location, accountId]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Thích bạn</Text>
        <TouchableOpacity onPress={() => setFilterVisible(true)}>
          <Ionicons name="filter-sharp" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Modal Lọc */}
      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={(data) => {
          console.log("Lọc với:", data);
          setFilterVisible(false);
        }}
      />

      {/* Thông báo Premium */}
      <Text style={styles.vipTitle}>
        Nâng cấp lên MapMatch + để xem ai đã thích bạn trên bản đồ
      </Text>

      {/* Bản đồ */}
      <View style={styles.mapWrapper}>
        {loading || !location ? (
          <ActivityIndicator size="large" />
        ) : (
          <MapView
            style={styles.map}
            customMapStyle={darkMapStyle}
            showsCompass={false}
            showsMyLocationButton={false}
            toolbarEnabled={false}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            showsUserLocation={true}
            followsUserLocation={true}
            zoomEnabled={true}
            scrollEnabled={true}
            pitchEnabled={true}
            rotateEnabled={true}
            zoomTapEnabled={true}
            zoomControlEnabled={true}
          >
            <Circle
              center={location}
              radius={1000}
              strokeColor="rgba(255, 0, 102, 0.3)"
              fillColor="rgba(255, 0, 102, 0.1)"
            />

            {nearbyUsers.map((account) => {
              const avatarUrl = account.avatar?.title
                ? getAvatarImage(account.avatar.title)
                : require("../../assets/images/image.png");

              return (
                <Marker
                  key={account.id}
                  coordinate={{
                    latitude: account.latitude,
                    longitude: account.longitude,
                  }}
                  title={account.email}
                  description={`ID: ${account.id}`}
                >
                  <Image
                    source={
                      typeof avatarUrl === "string"
                        ? { uri: avatarUrl }
                        : avatarUrl
                    }
                    style={{ width: 35, height: 35, borderRadius: 20 }}
                  />
                </Marker>
              );
            })}
          </MapView>
        )}
      </View>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 25,
    fontFamily: "gothamrnd-bold",
  },
  vipTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
    fontFamily: "gothamrnd-medium",
  },
  mapWrapper: {
    width: width - 30,
    height: height * 0.73,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    overflow: "hidden",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   Image,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import MapView, { Marker, Circle } from "react-native-maps";
// import * as Location from "expo-location";
// import FilterModal from "../_filter";
// import {
//   getNearbyUsers,
//   updateLocation,
//   getAvatarImage,
// } from "../../services/api";
// import { darkMapStyle } from "../mapStyle";
// import { SafeAreaView } from "react-native-safe-area-context"; // ✅ thêm dòng này

// const accountId = 23;

// export default function heart() {
//   const [filterVisible, setFilterVisible] = useState(false);
//   const [location, setLocation] = useState(null);
//   const [nearbyUsers, setNearbyUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let subscription;

//     (async () => {
//       try {
//         let { status } = await Location.requestForegroundPermissionsAsync();
//         if (status !== "granted") {
//           Alert.alert("Lỗi", "Không có quyền truy cập vị trí");
//           return;
//         }

//         subscription = await Location.watchPositionAsync(
//           {
//             accuracy: Location.Accuracy.High,
//             timeInterval: 5000,
//             distanceInterval: 10,
//           },
//           async (loc) => {
//             const lat = loc.coords.latitude;
//             const lng = loc.coords.longitude;
//             setLocation({ latitude: lat, longitude: lng });

//             try {
//               await updateLocation(accountId, lat, lng);
//               const users = await getNearbyUsers(accountId, 10);
//               setNearbyUsers(users);
//             } catch (error) {
//               console.error("Lỗi cập nhật người dùng gần:", error);
//             }
//           }
//         );
//       } catch (err) {
//         console.error("Lỗi bản đồ:", err);
//         Alert.alert("Lỗi", "Không thể tải vị trí.");
//       } finally {
//         setLoading(false);
//       }
//     })();

//     return () => {
//       if (subscription) {
//         subscription.remove();
//       }
//     };
//   }, []);

//   return (
//     <SafeAreaView style={styles.container} edges={["top"]}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.title}>Thích bạn</Text>
//         <TouchableOpacity onPress={() => setFilterVisible(true)}>
//           <Ionicons name="filter-sharp" size={24} color="black" />
//         </TouchableOpacity>
//       </View>

//       {/* Modal Lọc */}
//       <FilterModal
//         visible={filterVisible}
//         onClose={() => setFilterVisible(false)}
//         onApply={(data) => {
//           console.log("Lọc với:", data);
//           setFilterVisible(false);
//         }}
//       />

//       {/* Thông báo Premium */}
//       <Text style={styles.vipTitle}>
//         Nâng cấp lên MapMatch + để xem ai đã thích bạn trên bản đồ
//       </Text>

//       {/* Bản đồ */}
//       <View style={styles.mapWrapper}>
//         {loading || !location ? (
//           <ActivityIndicator size="large" />
//         ) : (
//           <MapView
//             style={styles.map}
//             customMapStyle={darkMapStyle}
//             showsCompass={false}
//             showsMyLocationButton={false}
//             toolbarEnabled={false}
//             initialRegion={{
//               latitude: location.latitude,
//               longitude: location.longitude,
//               latitudeDelta: 0.05,
//               longitudeDelta: 0.05,
//             }}
//             showsUserLocation={true}
//             followsUserLocation={true}
//             zoomEnabled={true}
//             scrollEnabled={true}
//             pitchEnabled={true}
//             rotateEnabled={true}
//             zoomTapEnabled={true}
//             zoomControlEnabled={true}
//           >
//             <Circle
//               center={location}
//               radius={1000}
//               strokeColor="rgba(255, 0, 102, 0.3)"
//               fillColor="rgba(255, 0, 102, 0.1)"
//             />
//             {nearbyUsers.map((account) => {
//               const avatarUrl = account.avatar?.title
//                 ? getAvatarImage(account.avatar.title)
//                 : require("../../assets/images/image.png");
//               return (
//                 <Marker
//                   key={account.id}
//                   coordinate={{
//                     latitude: account.latitude,
//                     longitude: account.longitude,
//                   }}
//                   title={account.email}
//                   description={`ID: ${account.id}`}
//                 >
//                   <Image
//                     source={
//                       typeof avatarUrl === "string"
//                         ? { uri: avatarUrl }
//                         : avatarUrl
//                     }
//                     style={{ width: 35, height: 35, borderRadius: 20 }}
//                   />
//                 </Marker>
//               );
//             })}
//           </MapView>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }

// const { width, height } = Dimensions.get("window");
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//     paddingHorizontal: 15,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 25,
//     fontFamily: "gothamrnd-bold",
//   },
//   vipTitle: {
//     fontSize: 16,
//     fontWeight: "500",
//     marginBottom: 10,
//     fontFamily: "gothamrnd-medium",
//   },
//   mapWrapper: {
//     // flex: 1,
//     width: width - 30,
//     height: height * 0.73,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 15,
//     overflow: "hidden",
//     borderColor: "#ccc",
//     borderWidth: 1,
//   },
//   map: {
//     width: "100%",
//     height: "100%",
//   },
// });
