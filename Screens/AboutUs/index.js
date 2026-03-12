import React, { useRef, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Animated,
    TouchableOpacity
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import TopBar from "../../navigation/TopBar";

export default function AboutUs() {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <>
            <TopBar title="About Us" />
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <Animated.View style={{ opacity: fadeAnim }}>

                    {/* HEADER */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>About Us</Text>
                        <Text style={styles.headerSubtitle}>
                            Learn More About Who We Are & What We Do
                        </Text>
                    </View>

                    {/* WHO WE ARE */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Who We Are</Text>
                        <Text style={styles.contentText}>
                            Ushuru Investment Co-operative Society provides a platform where members can pool resources to invest in high-return opportunities. We aim to empower our members financially by promoting savings, investment, and shared prosperity.
                        </Text>
                    </View>

                    {/* MISSION & VISION */}
                    <View style={styles.row}>
                        <View style={styles.card}>
                            <Ionicons name="rocket-outline" size={35} color="#8B0000" />
                            <Text style={styles.cardTitle}>Our Mission</Text>
                            <Text style={styles.cardText}>
                                To provide diverse, affordable, and profitable investment options for the mutual socio-economic benefit of members.
                            </Text>
                        </View>

                        <View style={styles.card}>
                            <Ionicons name="eye-outline" size={35} color="#8B0000" />
                            <Text style={styles.cardTitle}>Our Vision</Text>
                            <Text style={styles.cardText}>
                                To be the leading cooperative society in Kenya, fostering prosperity and financial independence among members.
                            </Text>
                        </View>
                    </View>

                    {/* VALUES */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Our Core Values</Text>

                        <View style={styles.valueGrid}>
                            <View style={styles.valueItem}>
                                <MaterialIcons name="verified" size={28} color="#8B0000" />
                                <Text style={styles.valueText}>Integrity</Text>

                                <Text style={{ fontSize: 12, fontWeight: "600", color: "#888888ff", marginTop: 10 }}>
                                    We uphold honesty and ethical practices in every decision and action.
                                </Text>
                            </View>

                            <View style={styles.valueItem}>
                                <Ionicons name="people-outline" size={28} color="#8B0000" />
                                <Text style={styles.valueText}>Reliability</Text>
                                <Text style={{ fontSize: 12, fontWeight: "600", color: "#888888ff", marginTop: 10 }}>
                                    Members can count on us to deliver consistent value and results.
                                </Text>
                            </View>

                            <View style={styles.valueItem}>
                                <Ionicons name="bulb-outline" size={28} color="#8B0000" />
                                <Text style={styles.valueText}>Trust</Text>
                                <Text style={{ fontSize: 12, fontWeight: "600", color: "#888888ff", marginTop: 10 }}>
                                    We build confidence by being dependable and transparent in all dealings
                                </Text>
                            </View>

                            <View style={styles.valueItem}>
                                <MaterialIcons name="people-outline" size={28} color="#8B0000" />
                                <Text style={styles.valueText}>Prudence</Text>
                                <Text style={{ fontSize: 12, fontWeight: "600", color: "#888888ff", marginTop: 10 }}>
                                    We make careful, well-considered investment choices for sustainable growth.
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* CTA */}
                    {/* <View style={styles.contactCard}>
                        <Text style={styles.contactTitle}>Have Questions?</Text>
                        <Text style={styles.contactSubtitle}>
                            We’re always here to help.
                        </Text>

                        <TouchableOpacity style={styles.contactButton}>
                            <Text style={styles.contactButtonText}>Contact Us</Text>
                        </TouchableOpacity>
                    </View> */}
                </Animated.View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAFAFA",
        marginBottom: 5,
    },

    // SOLID HEADER (NO GRADIENT)
    header: {
        paddingVertical: 50,
        paddingHorizontal: 20,
        backgroundColor: "#8B0000",
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#fff",
    },
    headerSubtitle: {
        fontSize: 16,
        color: "#ffe6e6",
        marginTop: 5,
    },

    section: {
        marginTop: 25,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#8B0000",
        marginBottom: 10,
    },
    contentText: {
        fontSize: 15,
        lineHeight: 22,
        color: "#555",
    },

    row: {
        flexDirection: "column",

        paddingHorizontal: 20,
        marginTop: 20,
    },
    card: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 15,
        marginTop: 15,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
        color: "#8B0000",
    },
    cardText: {
        marginTop: 5,
        color: "#666",
        fontSize: 14,
        lineHeight: 20,
    },

    valueGrid: {
        flexDirection: "column",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 15,
    },
    valueItem: {
        width: "100%",
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    valueText: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: "600",
        color: "#444",
    },

    contactCard: {
        backgroundColor: "#fff",
        margin: 20,
        padding: 20,
        borderRadius: 20,
        alignItems: "center",
        elevation: 5,
    },
    contactTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#8B0000",
    },
    contactSubtitle: {
        marginTop: 6,
        color: "#666",
        fontSize: 15,
    },
    contactButton: {
        marginTop: 20,
        backgroundColor: "#8B0000",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 30,
    },
    contactButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
