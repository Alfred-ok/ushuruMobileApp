import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const TopBar = ({ title }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={26} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.title}>{title}</Text>

            <Ionicons name="person-circle" size={30} color="#fff" />
        </View>
    );
};

export default TopBar;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 60,
        backgroundColor: "#800000", // Maroon theme
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        justifyContent: "space-between",
        elevation: 4,
    },
    title: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
});
