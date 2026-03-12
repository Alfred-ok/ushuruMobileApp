import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
} from "react-native";
import { Link } from "expo-router";
import { useNavigation } from "@react-navigation/native";

import imgbg from "../../assets/backimg.jpg";
import logoImg from "../../assets/ushurulogo.png";
import URL from '../../BaseUrl';
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Login() {
    const navigation = useNavigation();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert("Error", "Please enter both username and password.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${URL.BASE_URL}/api/login-member/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password }),
                }
            );

            const data = await response.json();

            console.log("Login Response:", data);

            await AsyncStorage.setItem("memberNo", data.member_number);

            if (data.status === "otp_required" && data.requires_otp) {
                // Navigate to OTP screen, pass member_number
                navigation.navigate("Otp", { memberNumber: data.member_number });
            } else if (data.status === "success") {
                // Navigate to home or dashboard
                //navigation.navigate("Home");
                navigation.replace("MainTabs", {
                    screen: "HomeTab",
                });



            } else {
                Alert.alert("Login Failed", data.message || "Something went wrong");
            }
        } catch (error) {
            Alert.alert("Error", "Unable to login. Please try again later.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "#800020" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.container}>

                    {/* Header gradient / maroon area */}
                    <View style={styles.topBackground}>

                        <Image
                            source={logoImg}
                            style={styles.logo}
                        />

                        <Text style={styles.logotitle}>USHURU INVESTMENT COOPERATIVE</Text>
                        <Text style={{ color: "orange", fontWeight: "bold", fontSize: 12, textAlign: "center" }}>
                            SOCIETY
                        </Text>

                    </View>

                    <View style={styles.card}>
                        <Text style={styles.title}>Sign In</Text>
                        <Text style={styles.subtitle}>Let’s get you in</Text>

                        <TextInput
                            placeholder="Member ID/No"
                            placeholderTextColor="#888"
                            style={styles.input}
                            keyboardType=""
                            value={username}
                            onChangeText={setUsername}
                        />

                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#888"
                            style={styles.input}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />

                        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
                        </TouchableOpacity>


                        {/* <TouchableOpacity onPress={() => navigation.replace("MainTabs", {
                            screen: "HomeTab",
                        })}>
                            <Text style={styles.guestText}>Continue as Guest</Text>
                        </TouchableOpacity> */}
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#800020",
    },

    topBackground: {
        height: "32%",
        backgroundColor: "#800020",
        display: "flex",
        justifyContent: "center"
    },

    card: {
        flex: 1,
        backgroundColor: "#f9efe5",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 25,
        paddingTop: 35,
        alignItems: "center",
        elevation: 10,
    },

    logo: {
        width: 120,
        height: 120,
        backgroundColor: "#fff",
        marginTop: 30,
        marginHorizontal: "auto",
        marginBottom: 10,
        resizeMode: "contain",
        borderRadius: 60, // must be a number
    },

    logotitle: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 12,
        marginTop: 5,
        textAlign: "center"
    },

    title: {
        fontSize: 26,
        fontWeight: "800",
        color: "#800020",
        marginBottom: 4,
    },

    subtitle: {
        fontSize: 14,
        color: "#654c4c",
        marginBottom: 28,
    },

    input: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 10,
        borderColor: "#ddd",
        borderWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 15,
        color: "#333",
    },

    button: {
        width: "100%",
        backgroundColor: "#800020",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 5,
    },

    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },

    guestText: {
        marginTop: 18,
        fontSize: 14,
        color: "#3d0f18",
        textDecorationLine: "underline",
    },
});



