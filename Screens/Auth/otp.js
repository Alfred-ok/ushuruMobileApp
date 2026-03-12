
import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import URL from '../../BaseUrl';

export default function OTP() {
    const navigation = useNavigation();
    const route = useRoute();
    const { memberNumber } = route.params; // this is the username
    const [otp, setOtp] = useState(["", "", "", ""]);
    const inputs = useRef([]);

    console.log(memberNumber);

    const handleChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Move to next input automatically
        if (text && index < 3) {
            inputs.current[index + 1].focus();
        }

    };

    const handleVerify = async () => {
        const otpCode = otp.join("");
        if (otpCode.length < 4) {
            Alert.alert("Error", "Please enter all 4 digits");
            return;
        }

        try {
            const response = await fetch(`${URL.BASE_URL}/api/confirm-otp/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: memberNumber,
                    otpCode: otpCode,
                }),
            });

            const data = await response.json();
            console.log(data);
            if (response.ok) {
                // Navigate to Home on success
                //navigation.navigate("Home");
                navigation.replace("MainTabs", {
                    screen: "HomeTab",
                });


            } else {
                Alert.alert("Error", data.error || "Invalid OTP");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Something went wrong. Please try again.");
        }
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

            <TouchableOpacity style={styles.button} onPress={handleVerify}>
                <Text style={styles.buttonText}>Verify & Continue</Text>
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
        fontWeight: "bold",
        color: maroon,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: "#555",
        marginBottom: 35,
        textAlign: "center",
    },
    otpContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginBottom: 40,
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
        fontWeight: "bold",
        color: maroon,
    },
    button: {
        width: "100%",
        backgroundColor: maroon,
        paddingVertical: 14,
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
        fontWeight: "600",
        fontSize: 16,
    },
    resendText: {
        marginTop: 20,
        color: maroon,
        fontWeight: "600",
        fontSize: 14,
    },
});
