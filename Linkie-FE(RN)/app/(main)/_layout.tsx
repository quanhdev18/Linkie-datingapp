// import { Tabs } from "expo-router";
// import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";

// export default function TabLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         tabBarShowLabel: false,
//         tabBarActiveTintColor: "#FF385C",
//         tabBarInactiveTintColor: "#8E8E93",
//         headerShown: false,
//       }}
//     >
//       <Tabs.Screen
//         name="heart"
//         options={{
//           tabBarIcon: ({ color }) => (
//             <Ionicons name="heart" size={30} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="star"
//         options={{
//           tabBarIcon: ({ color }) => (
//             <Ionicons name="star" size={30} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="chat"
//         options={{
//           tabBarIcon: ({ color }) => (
//             <Ionicons name="chatbubble-ellipses" size={30} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="user"
//         options={{
//           tabBarIcon: ({ color }) => (
//             <FontAwesome name="user" size={30} color={color} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Tabs } from "expo-router";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#FF385C",
          tabBarInactiveTintColor: "#8E8E93",
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="heart"
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="heart" size={30} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="star"
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="star" size={30} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons
                name="chatbubble-ellipses"
                size={30}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="user"
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome name="user" size={30} color={color} />
            ),
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}
