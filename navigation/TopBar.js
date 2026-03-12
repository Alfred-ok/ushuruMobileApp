import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from "react-native";
import { FONTS } from "../constants/fonts";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TopBar = ({ title }) => {
    const navigation = useNavigation();

    const handleSignOut = () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Sign Out",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem("memberNo");
                            const rootNav = navigation.getParent()?.getParent();
                            if (rootNav) {
                                rootNav.reset({
                                    index: 0,
                                    routes: [{ name: "Login" }],
                                });
                            } else {
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: "Login" }],
                                });
                            }
                        } catch (err) {
                            console.log("Sign out error:", err);
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={26} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.title}>{title}</Text>

            <TouchableOpacity onPress={handleSignOut} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="log-out-outline" size={28} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

export default TopBar;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        minHeight: 60,
        paddingTop: Platform.OS === "android" ? 38 : 48,
        paddingBottom: 10,
        backgroundColor: "#800000",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        justifyContent: "space-between",
        elevation: 0,
    },
    title: {
        color: "#fff",
        fontSize: 20,
        fontFamily: FONTS.bold,
    },
});
