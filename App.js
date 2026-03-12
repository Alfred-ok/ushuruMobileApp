
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";


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
