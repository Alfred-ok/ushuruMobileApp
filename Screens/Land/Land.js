
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    ActivityIndicator
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import TopBar from "../../navigation/TopBar";
import { FONTS } from "../../constants/fonts";

const { width } = Dimensions.get("window");

/* ================= LAND CARD ================= */

const LandCard = ({ item, onBookVisit, onViewMore }) => {

    // Convert Base64 image
    const imageUri = item["land_image"]
        ? `data:image/jpeg;base64,${item["land_image"]}`
        : "https://via.placeholder.com/400x200";

    return (
        <View style={styles.card}>
            <Image
                source={{ uri: imageUri }}
                style={styles.cardImage}
                resizeMode="cover"
            />

            <View style={styles.detailsContainer}>
                <Text style={styles.cardTitle}>
                    {item.description || "Untitled Property"}
                </Text>

                <Text style={styles.cardCode}>
                    Code: {item["land_code"]}
                </Text>

                <Text style={styles.cardInfo}>📍 {item.region}</Text>
                <Text style={styles.cardInfo}>Status: {item.status}</Text>
                <Text style={styles.cardInfo}>
                    Total Area: {item["total_area"]} acres
                </Text>
                <Text style={styles.cardInfo}>
                    Available: {item["available_area"]} acres
                </Text>
                <Text style={styles.cardInfo}>
                    Plot Size: {item["default_plot_size"]} acres
                </Text>
                <Text style={styles.cardInfo}>
                    Title: {item["title_deed_no"]}
                </Text>
            </View>

            <View style={styles.buttonContainer}>
                {/* <TouchableOpacity
                    style={[styles.actionButton, styles.primaryButton]}
                    onPress={() =>
                        onBookVisit(item["Land Code"], item.Description)
                    }
                >
                    <Text style={styles.buttonText}>Book Visit</Text>
                </TouchableOpacity> */}

                <TouchableOpacity
                    style={[styles.actionButton, styles.secondaryButton]}
                    onPress={() =>
                        onViewMore(item["land_code"])
                    }
                >
                    <Text style={styles.buttonText}>View Plots</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

/* ================= MAIN SCREEN ================= */

const LandListingScreen = () => {
    const [landList, setLandList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        fetchLandList();
    }, []);

    const fetchLandList = async () => {
        try {
            const response = await fetch(
                "http://88.99.215.90:8001/api/get-land-list/"
            );

            const json = await response.json();

            if (json.success) {
                setLandList(json.landList);
            } else {
                setError("No land data found");
            }
        } catch (err) {
            setError("Failed to load land data");
        } finally {
            setLoading(false);
        }
    };

    const handleViewMore = (landCode) => {
        navigation.navigate("PlotListScreen", { landCode });
    };

    const handleBookVisit = (landCode) => {
        navigation.navigate("PlotBookingScreen", {
            landCode
        });
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#14213d" />
                <Text style={{ marginTop: 8, fontFamily: FONTS.regular }}>Loading Land Listings...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.loader}>
                <Text style={{ color: "red", fontFamily: FONTS.regular }}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons
                        name="arrow-left"
                        size={28}
                        color="#fff"
                    />
                </TouchableOpacity>
                <View style={styles.headerLeft}>
                    <MaterialCommunityIcons
                        name="map"
                        size={28}
                        color="#fca311"
                    />
                    <View style={{ marginLeft: 10 }}>
                        <Text style={styles.headerTitle}>
                            Available Land Parcels
                        </Text>
                        <Text style={styles.headerSub}>
                            Explore opportunities
                        </Text>
                    </View>
                </View>

            </View>

            {/* LIST */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {landList.map((item, index) => (
                    <LandCard
                        key={index}
                        item={item}
                        onBookVisit={handleBookVisit}
                        onViewMore={handleViewMore}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export default LandListingScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f6f8",
    },

    header: {
        paddingTop: 48,
        paddingHorizontal: 20,
        paddingBottom: 18,
        backgroundColor: "#14213d",
        flexDirection: "row",
        alignItems: "center",
    },

    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },

    headerTitle: {
        color: "#fff",
        fontSize: 18,
        fontFamily: FONTS.bold,
    },

    headerSub: {
        color: "#ccc",
        fontSize: 12,
        fontFamily: FONTS.regular,
    },

    scrollContent: {
        paddingVertical: 13,
        paddingHorizontal: 15,
        paddingBottom: 58,
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        marginBottom: 13,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 4,
        overflow: "hidden",
    },

    cardImage: {
        width: "100%",
        height: 200,
    },

    detailsContainer: {
        paddingVertical: 13,
        paddingHorizontal: 15,
    },

    cardTitle: {
        fontSize: 18,
        fontFamily: FONTS.bold,
        color: "#14213d",
    },

    cardCode: {
        fontSize: 14,
        color: "#fca311",
        fontFamily: FONTS.bold,
        marginVertical: 5,
    },

    cardInfo: {
        color: "#555",
        marginTop: 2,
        fontSize: 13,
        fontFamily: FONTS.regular,
    },

    buttonContainer: {
        flexDirection: "row",
        paddingVertical: 8,
        paddingHorizontal: 10,
    },

    actionButton: {
        flex: 1,
        marginHorizontal: 5,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        alignItems: "center",
    },

    primaryButton: {
        backgroundColor: "#14213d",
    },

    secondaryButton: {
        backgroundColor: "#fca311",
    },

    buttonText: {
        color: "#fff",
        fontFamily: FONTS.bold,
    },

    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});