// import { Stack } from "expo-router";
// import "./globals.css";
// import { useFonts } from "expo-font";
// import { ProfileProvider } from "../context/profileContext";
// import Toast from "react-native-toast-message";

// export default function RootLayout() {
//   useFonts({
//     gothamrnd: require("../assets/fonts/gothamrnd_book.otf"),
//     "gothamrnd-bold": require("../assets/fonts/gothamrnd_bold.otf"),
//     "gothamrnd-medium": require("../assets/fonts/gothamrnd_medium.otf"),
//   });

//   return (
//     <ProfileProvider>
//       <>
//         <Stack
//           screenOptions={{
//             headerShown: false,
//             contentStyle: {
//               paddingTop: 20,
//             },
//           }}
//         >
//           <Stack.Screen
//             name="index"
//             options={{
//               headerShown: false,
//             }}
//           />
//           <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//           <Stack.Screen name="(main)" options={{ headerShown: false }} />
//         </Stack>
//         <Toast />
//       </>
//     </ProfileProvider>
//   );
// }
import { Stack } from "expo-router";
import "./globals.css";
import { useFonts } from "expo-font";
import { ProfileProvider } from "../context/profileContext";
import Toast from "react-native-toast-message";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  useFonts({
    gothamrnd: require("../assets/fonts/gothamrnd_book.otf"),
    "gothamrnd-bold": require("../assets/fonts/gothamrnd_bold.otf"),
    "gothamrnd-medium": require("../assets/fonts/gothamrnd_medium.otf"),
  });

  return (
    <ProfileProvider>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              // bạn có thể bỏ dòng này nếu dùng SafeAreaView trong từng màn
            },
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(main)" options={{ headerShown: false }} />
        </Stack>
        <Toast />
      </SafeAreaProvider>
    </ProfileProvider>
  );
}
