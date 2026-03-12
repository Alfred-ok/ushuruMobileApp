import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Dimensions,
    ImageBackground,
    Modal,
    Linking
} from "react-native";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Animated, Easing } from "react-native";
import URL from '../../BaseUrl';
import AsyncStorage from "@react-native-async-storage/async-storage";


const { width } = Dimensions.get("window");

export default function Home() {
    const navigation = useNavigation();
    const [lands, setLands] = useState([]);
    const [loadingSales, setLoadingSales] = useState(true);
    const [whatsappModalVisible, setWhatsappModalVisible] = useState(false);

    const [profile, setProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);


    const actions = [
        { name: "land", icon: "land-plots-marker" },
        { name: "Payments", icon: "credit-card" },

        { name: "Booked", icon: "file-document" },
        { name: "FAQs", icon: "comment-question" },
        { name: "Accounts", icon: "account-circle" },
        { name: "Chat", icon: "message-text-outline" },

        // { name: "Shares", icon: "cash-plus" },
        //{ name: "Info", icon: "information-variant-circle-outline" },

    ];
    const upcoming = [
        { title: "Eldoret", price: "2.4 acres", color: "#fca311" },
        { title: "Kitengela", price: "10 acres", color: "#800020" },
        { title: "Joska", price: "5acres", color: "#fca311" },
    ];

    const handleActionPress = (name) => {
        switch (name) {
            case "land":
                // Navigate to Land inside HomeStack
                navigation.navigate("Land", { screen: "Land" });
                break; s
            case "Booked":
                navigation.navigate("Booked", { screen: "Booked" });
                break;
            // case "Shares":
            //     navigation.navigate("Shares", { screen: "Shares" });
            //     break;
            case "Accounts":
                navigation.navigate("Accounts", { screen: "Accounts" });
                break;
            case "FAQs":
                navigation.navigate("FAQs", { screen: "FAQs" });
                break;
            // case "Info":
            //     navigation.navigate("Info", { screen: "Info" });
            //     break;
            //     break;
            case "Chat":
                setWhatsappModalVisible(true);
                break;
            case "Payments":
                // Payments is a separate tab
                navigation.navigate("Payments");
                break;
            default:
                console.log("Unknown action:", name);
        }
    };


    const fetchOngoingSales = async () => {
        try {
            const response = await fetch(
                `${URL.BASE_URL}/api/get-land-list/`
            );
            const json = await response.json();

            if (json.success) {
                setLands(json.landList);
            }
        } catch (error) {
            console.log("Error fetching sales:", error);
        } finally {
            setLoadingSales(false);
        }
    };

    const loadProfile = async () => {
        try {
            const storedMember = await AsyncStorage.getItem("memberNo");

            if (!storedMember) {
                console.log("No member found.");
                setLoadingProfile(false);
                return;
            }

            const response = await fetch(
                `${URL.BASE_URL}/api/member-profile/?username=${storedMember}`
            );

            const data = await response.json();

            if (data.status === "success") {
                setProfile(data.profile);
            }

        } catch (error) {
            console.log("Profile fetch error:", error);
        } finally {
            setLoadingProfile(false);
        }
    };


    useEffect(() => {
        loadProfile();
        fetchOngoingSales();
    }, []);


    const openWhatsApp = () => {
        const phoneNumber = "254796851111"; // change to your number
        const message = "Hello, I would like to make an inquiry about your plots.";

        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        Linking.openURL(url)
            .catch(() => alert("Make sure WhatsApp is installed"));

        setWhatsappModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* HEADER */}

                <ImageBackground
                    source={require("../../assets/bankcard4.jpg")} // your background image
                    style={styles.header}
                    resizeMode="cover"
                >

                    {/* New combined view for icon and text, using flexDirection: 'row' for side-by-side alignment */}
                    <View style={styles.profileGreeting}>
                        <View style={styles.profileIconWrapper}>
                            {/* Profile Icon */}
                            <MaterialIcons name="person-pin" size={60} color="#fff" />
                        </View>
                        <View>
                            <Text style={styles.balance}>
                                {loadingProfile
                                    ? "Loading..."
                                    : `Hello, ${profile?.FullName?.split(" ")[0] || "Member"}`
                                }
                            </Text>
                            <Text style={styles.balanceLabel} >Welcome Back</Text>
                            <Text style={{ color: "#fff", fontSize: 12, textAlign: "center", borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: "rgba(255,255,255,0.3)", marginTop: 6 }}>
                                Member No: {profile?.MemberNumber}
                            </Text>
                        </View>
                    </View>




                    {/* <TouchableOpacity style={styles.topUpButton}>
                        <Text style={styles.topUpText}>Info</Text>
                    </TouchableOpacity> */}
                </ImageBackground>

                {/* ACTION CARD */}
                <View style={styles.cardContainer}>
                    <View style={styles.actionGrid}>
                        {actions.map((item, i) => (
                            <View key={i} style={styles.actionItem}>
                                <TouchableOpacity
                                    style={styles.actionIconWrapper}
                                    onPress={() => handleActionPress(item.name)}
                                >
                                    <MaterialCommunityIcons
                                        name={item.icon}
                                        size={28}
                                        color="#fff"
                                    />
                                </TouchableOpacity>
                                <Text style={styles.actionText}>{item.name}</Text>
                            </View>
                        ))}

                    </View>

                    {/* <View style={styles.placeholderBox}>
                        <Text style={styles.placeholderText}>
                            Lorem ipsum dolor sit amet dan aku tan moyan
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="#7E8A93" />
                    </View> */}
                </View>

                {/* UPCOMING */}
                <Text style={styles.upcomingTitle}>Ongoing land Sales</Text>


                <View style={styles.upcomingScroll}>
                    {loadingSales ? (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                            {[1, 2, 3].map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </ScrollView>
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                            {lands.map((land, i) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.landCard,
                                        { backgroundColor: "#ab0a32ff" } // maroon theme
                                    ]}
                                >
                                    <Text style={styles.landTitle}>{land["Description"]}</Text>
                                    <Text style={styles.landRegion}>{land["Region"]}</Text>

                                    <View style={styles.statusBadge}>
                                        <Text style={styles.statusText}>{land["Status"]}</Text>
                                    </View>

                                    <Text style={styles.landArea}>
                                        Total: {land["Total Area"]} Acres
                                    </Text>
                                    <Text style={styles.landArea}>
                                        Available: {land["Available Area"]} Acres
                                    </Text>

                                    <Text style={styles.plotSize}>
                                        Plot Size: {land["Default Plot Size"]} Acres
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>
                    )}
                </View>

                {/* Extra padding so scroll content doesn't hide behind tabs */}
                <View style={{ height: 180 }} />
            </ScrollView>
            <Modal
                transparent
                visible={whatsappModalVisible}
                animationType="fade"
            >
                <View style={modalStyles.overlay}>
                    <View style={modalStyles.modalContainer}>
                        <Text style={modalStyles.modalTitle}>
                            Continue to WhatsApp?
                        </Text>

                        <Text style={modalStyles.modalMessage}>
                            You will be redirected to WhatsApp to start a chat.
                        </Text>

                        <View style={modalStyles.buttonRow}>
                            <TouchableOpacity
                                style={modalStyles.cancelButton}
                                onPress={() => setWhatsappModalVisible(false)}
                            >
                                <Text style={modalStyles.cancelText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={modalStyles.continueButton}
                                onPress={openWhatsApp}
                            >
                                <Text style={modalStyles.continueText}>Continue</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F7FB",
    },

    header: {
        backgroundColor: "#800020",
        paddingTop: 50,
        paddingBottom: 100,
        paddingHorizontal: 25,
        // borderBottomLeftRadius: 40,
        // borderBottomRightRadius: 40,
        position: "relative",
        zIndex: 1,
    },

    // New style to arrange the icon and text horizontally
    profileGreeting: {
        flexDirection: 'column',
        alignItems: 'center',
    },

    // New style for spacing the icon
    profileIconWrapper: {
        marginRight: 10,
        backgroundColor: "#fca311",
        padding: 8,
        borderRadius: 60,
    },

    balance: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
    },

    balanceLabel: {
        color: "#E3E8FD",
        textAlign: "center",
        marginTop: 3,
        fontWeight: "400",
        fontSize: 18,
        marginBottom: 6,
    },

    topUpButton: {
        backgroundColor: "#fca311",
        padding: 8,
        borderRadius: 30,
    },

    topUpText: {
        color: "#fff",
        fontWeight: "700",
    },

    cardContainer: {
        backgroundColor: "#fff",
        marginTop: -60,
        marginHorizontal: 20,
        borderRadius: 25,
        padding: 25,
        elevation: 12,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        position: "relative",
        zIndex: 999,
    },

    actionGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },

    actionItem: {
        width: "30%",
        alignItems: "center",
        marginBottom: 25,
    },

    actionIconWrapper: {
        backgroundColor: "#800020",
        width: 55,
        height: 55,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
    },

    actionText: {
        marginTop: 8,
        fontWeight: "600",
        color: "#4A4A4A",
    },

    placeholderBox: {
        backgroundColor: "#F5F7FB",
        marginTop: 15,
        padding: 15,
        borderRadius: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    placeholderText: {
        color: "#6A6A6A",
        width: "85%",
    },

    upcomingTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 20,
        marginLeft: 25,
        color: "#333",
    },

    upcomingScroll: {
        marginTop: 15,
        paddingLeft: 25,
    },

    upcomingCard: {
        width: 140,
        padding: 20,
        borderRadius: 20,
        marginRight: 15,
    },

    upcomingText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 10,
    },

    upcomingPrice: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },

    ///land card
    landCard: {
        width: 180,
        padding: 18,
        borderRadius: 20,
        marginRight: 15,
        elevation: 6,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 }
    },

    landTitle: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 5
    },

    landRegion: {
        color: "#fca311",
        fontWeight: "600",
        marginBottom: 10
    },

    statusBadge: {
        backgroundColor: "#4CAF50",
        alignSelf: "flex-start",
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderRadius: 12,
        marginBottom: 10
    },

    statusText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold"
    },

    landArea: {
        color: "#fff",
        fontSize: 13,
        marginBottom: 3
    },

    plotSize: {
        marginTop: 8,
        color: "#fff",
        fontWeight: "600",
        fontSize: 13
    },


});





const modalStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 25,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#14213d",
    },
    modalMessage: {
        fontSize: 14,
        color: "#555",
        marginBottom: 20,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    cancelButton: {
        marginRight: 15,
    },
    cancelText: {
        color: "#888",
        fontWeight: "600",
    },
    continueButton: {
        backgroundColor: "#25D366",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 10,
    },
    continueText: {
        color: "#fff",
        fontWeight: "bold",
    },
});









///skeleton loading component
function SkeletonCard() {
    const shimmer = new Animated.Value(0);

    React.useEffect(() => {
        Animated.loop(
            Animated.timing(shimmer, {
                toValue: 1,
                duration: 1200,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const translateX = shimmer.interpolate({
        inputRange: [0, 1],
        outputRange: [-200, 200],
    });

    return (
        <View style={skeletonStyles.card}>
            <Animated.View
                style={[
                    skeletonStyles.shimmer,
                    { transform: [{ translateX }] }
                ]}
            />
        </View>
    );
}

const skeletonStyles = StyleSheet.create({
    card: {
        width: 180,
        height: 150,
        borderRadius: 20,
        backgroundColor: "#d9d9d9",
        overflow: "hidden",
        marginRight: 15,
    },
    shimmer: {
        position: "absolute",
        width: 80,
        height: "100%",
        backgroundColor: "rgba(255,255,255,0.4)",
        opacity: 0.7,
    }
});
