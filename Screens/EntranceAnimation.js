import React, { useEffect, useRef } from "react";
import { View, Text, Image, Animated, StyleSheet } from "react-native";

export default function EntranceAnimation({ onFinish }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;     // fade-in
    const scaleAnim = useRef(new Animated.Value(0.5)).current;  // zoom-in
    const translateAnim = useRef(new Animated.Value(40)).current; // slide-up

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 900,
                useNativeDriver: true,
            }),

            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 5,
                tension: 80,
                useNativeDriver: true,
            }),

            Animated.timing(translateAnim, {
                toValue: 0,
                duration: 900,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setTimeout(() => onFinish && onFinish(), 700); // go to Login after animation
        });
    }, []);

    return (
        <View style={styles.container}>
            <Animated.Image
                source={require("../assets/ushurulogo.png")}
                style={[
                    styles.logo,
                    {
                        opacity: fadeAnim,
                        transform: [
                            { scale: scaleAnim },
                            { translateY: translateAnim },
                        ],
                    },
                ]}
            />

            <Animated.Text
                style={[
                    styles.title,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: translateAnim }],
                    },
                ]}
            >
                USHURU INVESTMENT COOPERATIVE
            </Animated.Text>

            <Animated.Text
                style={[
                    styles.society,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: translateAnim }],
                    },
                ]}
            >
                SOCIETY
            </Animated.Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "maroon",
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: 150,
        height: 150,
        backgroundColor: "#fff",
        borderRadius: 60,
        resizeMode: "contain",
        marginBottom: 15,
    },
    title: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
    },
    society: {
        color: "orange",
        marginTop: 3,
        fontWeight: "bold",
        fontSize: 14,
    },
});
