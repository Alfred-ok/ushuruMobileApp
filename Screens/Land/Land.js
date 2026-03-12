
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

const { width } = Dimensions.get("window");

/* ================= LAND CARD ================= */

const LandCard = ({ item, onBookVisit, onViewMore }) => {

    // Convert Base64 image
    const imageUri = item["Land Image"]
        ? `data:image/jpeg;base64,${item["Land Image"]}`
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
                    {item.Description || "Untitled Property"}
                </Text>

                <Text style={styles.cardCode}>
                    Code: {item["Land Code"]}
                </Text>

                <Text style={styles.cardInfo}>📍 {item.Region}</Text>
                <Text style={styles.cardInfo}>Status: {item.Status}</Text>
                <Text style={styles.cardInfo}>
                    Total Area: {item["Total Area"]} acres
                </Text>
                <Text style={styles.cardInfo}>
                    Available: {item["Available Area"]} acres
                </Text>
                <Text style={styles.cardInfo}>
                    Plot Size: {item["Default Plot Size"]} acres
                </Text>
                <Text style={styles.cardInfo}>
                    Title: {item["Title Deed No"]}
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
                        onViewMore(item["Land Code"])
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
                <Text style={{ marginTop: 10 }}>Loading Land Listings...</Text>
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
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
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
        fontWeight: "bold",
    },

    headerSub: {
        color: "#ccc",
        fontSize: 12,
    },

    scrollContent: {
        padding: 15,
        paddingBottom: 60,
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        marginBottom: 15,
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
        padding: 15,
    },

    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#14213d",
    },

    cardCode: {
        fontSize: 14,
        color: "#fca311",
        fontWeight: "bold",
        marginVertical: 5,
    },

    cardInfo: {
        color: "#555",
        marginTop: 4,
        fontSize: 13,
    },

    buttonContainer: {
        flexDirection: "row",
        padding: 10,
    },

    actionButton: {
        flex: 1,
        marginHorizontal: 5,
        padding: 12,
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
        fontWeight: "bold",
    },

    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});