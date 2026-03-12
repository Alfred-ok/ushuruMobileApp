import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import URL from "../../BaseUrl";

const PlotListScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { landCode } = route.params;

    const [plots, setPlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPlots();
    }, []);

    const fetchPlots = async () => {
        try {
            const response = await fetch(
                `${URL.BASE_URL}/api/get-plots-by-land/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ landCode }),
                }
            );

            const data = await response.json();

            if (data.success) {
                setPlots(data.plots);
            } else {
                setError("No plots found.");
            }
        } catch (err) {
            setError("Failed to load plots.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#fca311" />
                <Text>Loading plots...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.loader}>
                <Text style={{ color: "red" }}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialCommunityIcons
                        name="map-marker"
                        size={28}
                        color="#fca311"
                    />
                    <Text style={styles.headerTitle}>
                        Plots for Land {landCode}
                    </Text>
                </View>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons
                        name="arrow-left"
                        size={28}
                        color="#fff"
                    />
                </TouchableOpacity>
            </View>

            {/* Plot List */}
            <ScrollView contentContainerStyle={styles.listContainer}>
                {plots.map((plot, index) => {
                    const isAvailable = plot.plot_status === "Available";

                    return (
                        <View key={index} style={styles.plotCard}>
                            <Text style={styles.plotTitle}>
                                {plot.plot_code}
                            </Text>

                            <Text style={styles.detail}>
                                Area: {plot.area} acres
                            </Text>

                            <Text style={styles.detail}>
                                Status: {plot.plot_status}
                            </Text>

                            <Text style={styles.detail}>
                                Member Price: {plot.member_price}
                            </Text>

                            <Text style={styles.detail}>
                                Non-Member Price: {plot.non_member_price}
                            </Text>

                            {/* <Text style={styles.detail}>
                                Owned By: {plot.owned_by}
                            </Text> */}

                            <TouchableOpacity
                                style={[
                                    styles.actionButton,
                                    !isAvailable && styles.disabledButton
                                ]}
                                disabled={!isAvailable}
                                onPress={() =>
                                    navigation.navigate("PlotBookingScreen", {
                                        landCode: plot.land_code,
                                        plotCode: plot.plot_code,
                                    })
                                }
                            >
                                <Text style={styles.actionText}>
                                    {isAvailable
                                        ? "Book Plot"
                                        : "Already Booked"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

export default PlotListScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },

    header: {
        backgroundColor: "#14213d",
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },

    headerTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 10,
    },

    listContainer: { padding: 15 },

    plotCard: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },

    plotTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#14213d",
        marginBottom: 5,
    },

    detail: {
        fontSize: 14,
        marginBottom: 3,
        color: "#333",
    },

    actionButton: {
        marginTop: 10,
        backgroundColor: "#fca311",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
    },

    disabledButton: {
        backgroundColor: "#ccc",
    },

    actionText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },

    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});