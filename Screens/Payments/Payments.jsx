import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TopBar from "../../navigation/TopBar";
import { FONTS } from "../../constants/fonts";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

export default function Payments() {

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        customer_no: "",
        amount: "",
        cheque_date: getTodayDate(),
        transaction_time: getCurrentTime(),
        cheque_no: "",
        plot_code: "",
        transaction_type: "7",
    });

    const transactionTypes = [
        { value: "1", label: "Land Payment" },
        { value: "2", label: "Share Capital (Shares Capital)" },
        { value: "3", label: "Deposit Contribution" },
        { value: "6", label: "Land Booking Fee" },
        { value: "7", label: "Commitment Deposit" },
    ];

    useEffect(() => {
        loadCustomerNo();
    }, []);

    const loadCustomerNo = async () => {
        try {
            const storedMember = await AsyncStorage.getItem("memberNo");

            if (storedMember) {
                setFormData(prev => ({
                    ...prev,
                    customer_no: storedMember
                }));
            } else {
                Alert.alert("Session Expired", "Please login again.");
            }
        } catch (error) {
            console.log("Error loading member:", error);
        }
    };

    function getTodayDate() {
        const today = new Date();
        return today.toISOString().split("T")[0];
    }

    function getCurrentTime() {
        const now = new Date();
        return now.toTimeString().split(" ")[0];
    }


    const [phoneNumber, setPhoneNumber] = useState("");

    const handlePayment = async () => {
        if (
            !formData.amount ||
            !formData.plot_code ||
            !formData.transaction_type ||
            !phoneNumber
        ) {
            Alert.alert("Validation", "Please fill all required fields");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                phonenumber: phoneNumber,
                amount: Number(formData.amount).toFixed(2), // format as "10000.00"
                accno: formData.customer_no,
                transactionType: "Receipt",
                orgCode: "68",
                bookingType: "receipt",
                receiptData: {
                    customer_no: formData.customer_no,
                    amount: Number(formData.amount).toFixed(2),
                    cheque_date: formData.cheque_date,
                    transaction_time: formData.transaction_time,
                    cheque_no: formData.cheque_no || "",
                    plot_code: formData.plot_code,
                    transaction_type: formData.transaction_type,
                },
            };

            const response = await fetch(
                "http://88.99.215.90:8001/api/mpesa-stk-push/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json();

            if (response.ok) {
                Alert.alert(
                    "STK Push Sent",
                    "Check your phone to complete the M-Pesa payment."
                );

                setFormData({
                    ...formData,
                    amount: "",
                    cheque_no: "",
                    plot_code: "",
                });
            } else {
                Alert.alert("Error", data.message || "Payment failed.");
            }

        } catch (error) {
            Alert.alert("Error", "Unable to process payment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                <TopBar title="Make Payment" />

                <View style={styles.card}>

                    <Text style={styles.sectionTitle}>Payment Details</Text>

                    {/* Amount */}
                    <Text style={styles.label}>Amount (KES)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={formData.amount}
                        onChangeText={(text) =>
                            setFormData({ ...formData, amount: text })
                        }
                        placeholder="Enter amount"
                    />

                    {/* Reference */}
                    {/* <Text style={styles.label}>Reference Number</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.cheque_no}
                        onChangeText={(text) =>
                            setFormData({ ...formData, cheque_no: text })
                        }
                        placeholder="e.g REF-20260222-002"
                    /> */}

                    {/* Plot Code */}
                    <Text style={styles.label}>Plot Code</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.plot_code}
                        onChangeText={(text) =>
                            setFormData({ ...formData, plot_code: text })
                        }
                        placeholder="e.g VK-005"
                    />
                    {/* Phone Number */}
                    <Text style={styles.label}>M-Pesa Phone Number</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        placeholder="2547XXXXXXXX"
                    />
                    {/* Transaction Type Dropdown */}
                    <Text style={styles.label}>Transaction Type</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.transaction_type}
                            onValueChange={(itemValue) =>
                                setFormData({ ...formData, transaction_type: itemValue })
                            }
                        >
                            {transactionTypes.map((type) => (
                                <Picker.Item
                                    key={type.value}
                                    label={type.label}
                                    value={type.value}
                                />
                            ))}
                        </Picker>
                    </View>

                    {/* Auto Fields Display */}
                    <View style={styles.autoInfoBox}>
                        <Text style={styles.autoText}>
                            Date: {formData.cheque_date}
                        </Text>
                        <Text style={styles.autoText}>
                            Time: {formData.transaction_time}
                        </Text>

                    </View>

                    {loading ? (
                        <ActivityIndicator size="large" color="#800020" />
                    ) : (
                        <TouchableOpacity
                            style={styles.payButton}
                            onPress={handlePayment}
                        >
                            <Ionicons
                                name="card-outline"
                                size={20}
                                color="#fff"
                                style={{ marginRight: 8 }}
                            />
                            <Text style={styles.payButtonText}>
                                Submit Payment
                            </Text>
                        </TouchableOpacity>
                    )}

                </View>

                <View style={{ height: 60 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
        marginBottom: 38,
    },

    card: {
        backgroundColor: "#fff",
        margin: 20,
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },

    sectionTitle: {
        fontSize: 20,
        fontFamily: FONTS.bold,
        marginBottom: 18,
        color: "#800020",
    },

    label: {
        fontSize: 14,
        fontFamily: FONTS.regular,
        marginBottom: 4,
        color: "#555",
    },

    input: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 14,
        marginBottom: 16,
        fontSize: 14,
        fontFamily: FONTS.regular,
        backgroundColor: "#F9FAFB",
    },

    autoInfoBox: {
        backgroundColor: "#F3F4F6",
        paddingVertical: 13,
        paddingHorizontal: 15,
        borderRadius: 12,
        marginBottom: 18,
    },

    autoText: {
        fontSize: 13,
        fontFamily: FONTS.regular,
        color: "#444",
        marginBottom: 4,
    },

    payButton: {
        backgroundColor: "#800020",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 14,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },

    payButtonText: {
        color: "#fff",
        fontFamily: FONTS.bold,
        fontSize: 15,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        marginBottom: 18,
        backgroundColor: "#F9FAFB",
    },

});