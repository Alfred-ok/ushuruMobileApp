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
import { FONTS } from "../../constants/fonts";


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
                            <Text style={{ color: "#fff", fontSize: 12, fontFamily: FONTS.regular, textAlign: "center", borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2, backgroundColor: "rgba(255,255,255,0.3)", marginTop: 4 }}>
                                Member No: {profile?.MemberNumber}
                            </Text>
                        </View>
                    </View>

                    {console.log(profile)}


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
                                    <Text style={styles.landTitle}>{land["description"]}</Text>
                                    <Text style={styles.landRegion}>{land["region"]}</Text>

                                    <View style={styles.statusBadge}>
                                        <Text style={styles.statusText}>{land["status"]}</Text>
                                    </View>

                                    <Text style={styles.landArea}>
                                        Total: {land["total_area"]} Acres
                                    </Text>
                                    <Text style={styles.landArea}>
                                        Available: {land["available_area"]} Acres
                                    </Text>

                                    <Text style={styles.plotSize}>
                                        Plot Size: {land["default_plot_size"]} Acres
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
        paddingTop: 48,
        paddingBottom: 98,
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
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 60,
    },

    balance: {
        color: "#fff",
        fontSize: 24,
        fontFamily: FONTS.bold,
    },

    balanceLabel: {
        color: "#E3E8FD",
        textAlign: "center",
        marginTop: 1,
        fontFamily: FONTS.regular,
        fontSize: 18,
        marginBottom: 4,
    },

    topUpButton: {
        backgroundColor: "#fca311",
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 30,
    },

    topUpText: {
        color: "#fff",
        fontFamily: FONTS.bold,
    },

    cardContainer: {
        backgroundColor: "#fff",
        marginTop: -62,
        marginHorizontal: 20,
        borderRadius: 25,
        paddingVertical: 23,
        paddingHorizontal: 25,
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
        marginBottom: 23,
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
        marginTop: 6,
        fontFamily: FONTS.medium,
        color: "#4A4A4A",
    },

    placeholderBox: {
        backgroundColor: "#F5F7FB",
        marginTop: 13,
        paddingVertical: 13,
        paddingHorizontal: 15,
        borderRadius: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    placeholderText: {
        color: "#6A6A6A",
        width: "85%",
        fontFamily: FONTS.regular,
    },

    upcomingTitle: {
        fontSize: 20,
        fontFamily: FONTS.bold,
        marginTop: 18,
        marginLeft: 25,
        color: "#333",
    },

    upcomingScroll: {
        marginTop: 13,
        paddingLeft: 25,
    },

    upcomingCard: {
        width: 140,
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginRight: 15,
    },

    upcomingText: {
        color: "#fff",
        fontSize: 14,
        fontFamily: FONTS.medium,
        marginBottom: 8,
    },

    upcomingPrice: {
        color: "#fff",
        fontSize: 18,
        fontFamily: FONTS.bold,
    },

    ///land card
    landCard: {
        width: 180,
        paddingVertical: 16,
        paddingHorizontal: 18,
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
        fontFamily: FONTS.bold,
        fontSize: 16,
        marginBottom: 3
    },

    landRegion: {
        color: "#fca311",
        fontFamily: FONTS.medium,
        marginBottom: 8
    },

    statusBadge: {
        backgroundColor: "#4CAF50",
        alignSelf: "flex-start",
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderRadius: 12,
        marginBottom: 8
    },

    statusText: {
        color: "#fff",
        fontSize: 12,
        fontFamily: FONTS.bold
    },

    landArea: {
        color: "#fff",
        fontSize: 13,
        fontFamily: FONTS.regular,
        marginBottom: 1
    },

    plotSize: {
        marginTop: 6,
        color: "#fff",
        fontFamily: FONTS.medium,
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
        paddingVertical: 23,
        paddingHorizontal: 25,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: FONTS.bold,
        marginBottom: 8,
        color: "#14213d",
    },
    modalMessage: {
        fontSize: 14,
        fontFamily: FONTS.regular,
        color: "#555",
        marginBottom: 18,
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
        fontFamily: FONTS.medium,
    },
    continueButton: {
        backgroundColor: "#25D366",
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 10,
    },
    continueText: {
        color: "#fff",
        fontFamily: FONTS.bold,
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
