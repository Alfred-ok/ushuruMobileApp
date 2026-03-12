import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import URL from '../../BaseUrl';
import { FONTS } from "../../constants/fonts";

export default function OTP() {
    const navigation = useNavigation();
    const route = useRoute();
    const { memberNumber, generatedOtp } = route.params || {};
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [verifying, setVerifying] = useState(false);
    const inputs = useRef([]);
    const hasAutoSubmitted = useRef(false);

    useEffect(() => {
        if (generatedOtp && generatedOtp.length === 4 && !hasAutoSubmitted.current) {
            const digits = generatedOtp.split("");
            setOtp(digits);
            hasAutoSubmitted.current = true;
            const timer = setTimeout(() => {
                handleVerifyWithOtp(digits.join(""));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [generatedOtp]);

    const handleVerifyWithOtp = async (otpCode) => {
        if (!otpCode || otpCode.length !== 4) return;
        setVerifying(true);
        try {
            const response = await fetch(`${URL.BASE_URL}/api/confirm-otp/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: memberNumber,
                    otpCode: otpCode,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                navigation.replace("MainTabs", { screen: "HomeTab" });
            } else {
                Alert.alert("Error", data.error || "Invalid OTP");
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong. Please try again.");
        } finally {
            setVerifying(false);
        }
    };

    const handleChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Move to next input automatically
        if (text && index < 3) {
            inputs.current[index + 1].focus();
        }

    };

    const handleVerify = () => {
        const otpCode = otp.join("");
        if (otpCode.length < 4) {
            Alert.alert("Error", "Please enter all 4 digits");
            return;
        }
        handleVerifyWithOtp(otpCode);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.subtitle}>Enter the 4-digit code sent to your phone</Text>


            <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={(el) => (inputs.current[index] = el)}
                        maxLength={1}
                        keyboardType="numeric"
                        style={styles.otpBox}
                        value={digit}
                        onChangeText={(text) => handleChange(text, index)}
                    />
                ))}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={verifying}>
                {verifying ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Verify & Continue</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => Alert.alert("OTP Resent", "A new OTP has been sent.")}>
                <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
        </View>
    );
}

const maroon = "#800020";
const cream = "#FFF9E8";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: cream,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 30,
        fontFamily: FONTS.bold,
        color: maroon,
        marginBottom: 4,
        includeFontPadding: false,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: FONTS.regular,
        color: "#555",
        marginBottom: 20,
        textAlign: "center",
        includeFontPadding: false,
    },
    otpContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginBottom: 24,
    },
    otpBox: {
        width: 45,
        height: 55,
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: maroon,
        borderRadius: 10,
        textAlign: "center",
        fontSize: 22,
        fontFamily: FONTS.bold,
        color: maroon,
        paddingVertical: 0,
        includeFontPadding: false,
    },
    button: {
        width: "100%",
        backgroundColor: maroon,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        shadowColor: maroon,
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: "#fff",
        fontFamily: FONTS.medium,
        fontSize: 16,
        includeFontPadding: false,
    },
    resendText: {
        marginTop: 12,
        color: maroon,
        fontFamily: FONTS.medium,
        fontSize: 14,
        includeFontPadding: false,
    },
});
