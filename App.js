import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, StatusBar, View, ActivityIndicator, Text, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Font from "expo-font";

// Remove Android's extra font padding (makes custom fonts like Google Sans look less padded)
if (Platform.OS === "android") {
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.includeFontPadding = false;
}


// Screens
import Login from "./Screens/Auth/Login";
import OTP from "./Screens/Auth/otp";
import EntranceAnimation from "./Screens/EntranceAnimation";
import Payments from "./Screens/Payments/Payments";
import Profile from "./Screens/Profile";
import AboutUs from "./Screens/AboutUs";

import BottomBar from "./navigation/BottomBar";
import { HomeStackScreen } from "./Screens/Homestack";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomBar {...props} />}
    >
      <Tab.Screen name="HomeTab" component={HomeStackScreen} />
      <Tab.Screen name="Payments" component={Payments} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="AboutUs" component={AboutUs} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [showAnimation, setShowAnimation] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await Font.loadAsync({
          "GoogleSans-Regular": require("./static/GoogleSans-Regular.ttf"),
          "GoogleSans-Medium": require("./static/GoogleSans-Medium.ttf"),
          "GoogleSans-Bold": require("./static/GoogleSans-Bold.ttf"),
          "GoogleSans-SemiBold": require("./static/GoogleSans-SemiBold.ttf"),
        });
      } catch (e) {
        console.warn("Font load error:", e);
      }
      setFontsLoaded(true);
    })();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#800000" />
      </View>
    );
  }

  return (
    <>
      <StatusBar hidden={true} />
      <SafeAreaProvider>


        {showAnimation ? (
          <EntranceAnimation onFinish={() => setShowAnimation(false)} />
        ) : (
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {/* Auth Screens */}
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Otp" component={OTP} />

              {/* Main App */}
              <Stack.Screen name="MainTabs" component={MainTabs} />
            </Stack.Navigator>
          </NavigationContainer>
        )}

      </SafeAreaProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 0
  },
});
