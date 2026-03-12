
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { FONTS } from "../../constants/fonts";

const PlotBookingScreen = ({ route, navigation }) => {
    const { landCode, plotCode } = route.params || {};

    const [memberNo, setMemberNo] = useState("");
    const [buyerName, setBuyerName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [amount, setAmount] = useState("20000");
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        loadMemberNo();
    }, []);

    const loadMemberNo = async () => {
        try {
            const storedMember = await AsyncStorage.getItem("memberNo");

            if (storedMember) {
                setMemberNo(storedMember);
            } else {
                Alert.alert("Session Expired", "Please login again.");
            }
        } catch (error) {
            console.log("Error loading member:", error);
        }
    };

    const handleBooking = async () => {
        if (!memberNo || !buyerName || !phoneNumber || !amount) {
            Alert.alert("Missing Details", "All fields are required.");
            return;
        }

        const payload = {
            phonenumber: phoneNumber,
            amount: "10",
            accno: memberNo,
            transactionType: "PlotBooking",
            bookingType: "member",
            orgCode: "68",
            bookingData: {
                memberNo: memberNo,
                landCode: landCode,
                plotCode: plotCode || "",
                bookingDate: new Date().toISOString().split("T")[0]
            }
        };

        setLoading(true);

        try {
            const response = await fetch(
                "http://88.99.215.90:8001/api/mpesa-stk-push/",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json();
            setLoading(false);

            if (response.ok) {
                Alert.alert(
                    "STK Push Sent",
                    "Check your phone to complete the M-Pesa payment.",
                    [{ text: "OK", onPress: () => navigation.goBack() }]
                );
            } else {
                Alert.alert("Error", data.message || "Payment request failed.");
            }

        } catch (error) {
            setLoading(false);
            Alert.alert("Network Error", "Unable to connect to server.");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.heading}>Plot Deposit (M-Pesa)</Text>

            <View style={styles.infoBox}>
                <Text style={styles.infoText}>Land Code: {landCode}</Text>
                {plotCode && (
                    <Text style={styles.infoText}>Plot Code: {plotCode}</Text>
                )}
                <Text style={styles.infoText}>
                    Booking Date: {new Date().toISOString().split("T")[0]}
                </Text>
            </View>

            <Text style={styles.label}>Member Number</Text>
            <TextInput
                value={memberNo}
                style={styles.input}
                editable={false}
            />

            <Text style={styles.label}>Buyer Name</Text>
            <TextInput
                value={buyerName}
                onChangeText={setBuyerName}
                style={styles.input}
                placeholder="Enter Buyer Name"
            />

            <Text style={styles.label}>Phone Number (2547XXXXXXXX)</Text>
            <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                style={styles.input}
                keyboardType="phone-pad"
                placeholder="2547XXXXXXXX"
            />

            <Text style={styles.label}>Deposit Amount</Text>
            <TextInput
                value={amount}
                onChangeText={setAmount}
                style={styles.input}
                keyboardType="numeric"
                placeholder="Enter Amount"
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleBooking}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Pay & Book Plot</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
};

export default PlotBookingScreen;

const styles = StyleSheet.create({
    container: {
        paddingVertical: 18,
        paddingHorizontal: 20,
        backgroundColor: "#fff",
        flex: 1
    },
    heading: {
        fontSize: 22,
        fontFamily: FONTS.bold,
        textAlign: "center",
        marginBottom: 18,
        color: "#14213d"
    },
    infoBox: {
        paddingVertical: 13,
        paddingHorizontal: 15,
        backgroundColor: "#f2f2f2",
        borderRadius: 10,
        marginBottom: 20
    },
    infoText: {
        fontSize: 16,
        fontFamily: FONTS.medium,
        color: "#14213d"
    },
    label: {
        fontSize: 14,
        marginBottom: 3,
        color: "#555",
        fontFamily: FONTS.medium
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginBottom: 13,
        fontSize: 16,
        fontFamily: FONTS.regular
    },
    button: {
        backgroundColor: "#fca311",
        paddingVertical: 13,
        paddingHorizontal: 15,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 8
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontFamily: FONTS.bold
    }
});