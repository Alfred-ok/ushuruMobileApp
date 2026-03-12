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
import { FONTS } from "../../constants/fonts";

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
            const response = await fetch(`${URL.BASE_URL}/api/login-member/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.status === "otp_required" && data.requires_otp) {
                // Only store memberNo if it's actually present
                if (data.member_number != null) {
                    await AsyncStorage.setItem("memberNo", String(data.member_number));
                }
                navigation.navigate("Otp", {
                    memberNumber: data.member_number,
                    generatedOtp: data.generated_otp || "",
                });
            } else if (data.status === "success") {
                // Only store memberNo if it's actually present
                if (data.member_number != null) {
                    await AsyncStorage.setItem("memberNo", String(data.member_number));
                }
                navigation.replace("MainTabs", {
                    screen: "HomeTab",
                });
            } else {
                Alert.alert("Login Failed", data.message || "Something went wrong");
            }
        } catch (error) {
            Alert.alert("Error", String(error));
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
                        <Image source={logoImg} style={styles.logo} />
                        <Text style={styles.logotitle}>USHURU INVESTMENT COOPERATIVE</Text>
                        <Text style={{ color: "orange", fontFamily: FONTS.bold, fontSize: 12, textAlign: "center" }}>
                            SOCIETY
                        </Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.title}>Sign In</Text>
                        <Text style={styles.subtitle}>Let's get you in</Text>

                        <TextInput
                            placeholder="Member ID/No"
                            placeholderTextColor="#888"
                            style={styles.input}
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

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Sign In</Text>
                            )}
                        </TouchableOpacity>
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
        justifyContent: "center",
    },
    card: {
        flex: 1,
        backgroundColor: "#f9efe5",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 25,
        paddingTop: 33,
        alignItems: "center",
        elevation: 10,
    },
    logo: {
        width: 120,
        height: 120,
        backgroundColor: "#fff",
        marginTop: 28,
        marginHorizontal: "auto",
        marginBottom: 8,
        resizeMode: "contain",
        borderRadius: 60,
    },
    logotitle: {
        color: "#fff",
        fontFamily: FONTS.bold,
        fontSize: 12,
        marginTop: 3,
        textAlign: "center",
    },
    title: {
        fontSize: 26,
        fontFamily: FONTS.bold,
        color: "#800020",
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: FONTS.regular,
        color: "#654c4c",
        marginBottom: 26,
    },
    input: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 10,
        borderColor: "#ddd",
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 13,
        fontSize: 15,
        fontFamily: FONTS.regular,
        color: "#333",
    },
    button: {
        width: "100%",
        backgroundColor: "#800020",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 3,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: FONTS.bold,
    },
    guestText: {
        marginTop: 16,
        fontSize: 14,
        fontFamily: FONTS.regular,
        color: "#3d0f18",
        textDecorationLine: "underline",
    },
});