import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import TopBar from "../../navigation/TopBar";
import URL from '../../BaseUrl';
import { Animated, Easing } from "react-native";
import { TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BookedPlots = ({ route }) => {
    // You can pass memberNo using navigation OR hardcode it

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [memberNo, setMemberNo] = useState(null);



    useEffect(() => {
        loadMemberNo();
    }, []);

    const loadMemberNo = async () => {
        try {
            // 1️⃣ First check if passed via navigation
            const routeMember = route?.params?.memberNo;

            if (routeMember) {
                setMemberNo(routeMember);
                fetchBookedPlots(routeMember);
                return;
            }

            // 2️⃣ Otherwise load from AsyncStorage
            const storedMember = await AsyncStorage.getItem("memberNo");

            if (storedMember) {
                setMemberNo(storedMember);
                fetchBookedPlots(storedMember);
            } else {
                setError("Member not found. Please login again.");
                setLoading(false);
            }
        } catch (error) {
            setError("Failed to load member.");
            setLoading(false);
        }
    };


    const fetchBookedPlots = async (memberNumber) => {
        try {
            const response = await fetch(
                `${URL.BASE_URL}/api/member-booked-plots/?memberNo=${memberNumber}`
            );

            const json = await response.json();

            if (json.success) {
                // map snake_case to camelCase
                const mappedData = json.data.all_entries.map(item => ({
                    entryNumber: item.entry_number,
                    landCode: item.land_code,
                    plotCode: item.plot_code,
                    bookingStatus: item.booking_status,
                    plotPrice: item.plot_price,
                    bookingFeePaid: item.booking_fee_paid,
                    commitmentAmount: item.commitment_amount,
                    commitmentPaid: item.commitment_paid,
                    commitmentDeadline: item.commitment_deadline,
                    commitmentStatus: item.commitment_status,
                    isEmptyApplication: item.is_empty_application
                }));

                setData(mappedData);
                setFilteredData(mappedData);
            } else {
                setError("Failed to load booked plots");
            }
        } catch (err) {
            setError("Network error");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (text) => {
        setSearchQuery(text);

        if (text.trim() === "") {
            setFilteredData(data);
        } else {
            const filtered = data.filter(item =>
                item.plotCode.toLowerCase().includes(text.toLowerCase()) ||
                item.landCode.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredData(filtered);
        }
    };


    useEffect(() => {
        fetchBookedPlots();
    }, []);

    if (loading) {
        return (
            <>
                <View style={styles.container}>
                    <TopBar title="Booked Plots" />
                    {[1, 2, 3, 4].map((i) => (
                        <SkeletonCard key={i} />
                    ))}

                </View>
            </>
        );
    }


    if (error) {
        return (
            <View style={styles.center}>
                <Text style={{ color: "red" }}>{error}</Text>
            </View>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "Completed":
                return "#16A34A";
            case "Active":
                return "#2563EB";
            case "Application":
                return "#F59E0B";
            default:
                return "#6B7280";
        }
    };

    const renderItem = ({ item }) => {
        // const progress =
        //     item.commitmentAmount > 0
        //         ? (Number(item.commitmentPaid === "Yes") ? 1 : 0)
        //         : 0;
        const progress = item.commitmentPaid === "Yes" ? 1 : 0;

        return (
            <View style={styles.modernCard}>

                {/* HEADER */}
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={styles.plotCode}>
                            {item.plotCode}
                        </Text>
                        <Text style={styles.subText}>
                            {item.landCode} • Entry #{item.entryNumber}
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.modernBadge,
                            { backgroundColor: getStatusColor(item.bookingStatus) }
                        ]}
                    >
                        <Text style={styles.badgeText}>
                            {item.bookingStatus}
                        </Text>
                    </View>
                </View>

                {/* DIVIDER */}
                <View style={styles.divider} />

                {/* FINANCIAL INFO */}
                <View style={styles.amountRow}>
                    <AmountItem label="Plot Price" value={item.plotPrice} />
                    <AmountItem label="Booking Fee" value={item.bookingFeePaid} />
                    <AmountItem label="Commitment" value={item.commitmentAmount} />
                </View>

                {/* DIVIDER */}
                <View style={styles.divider} />

                {/* COMMITMENT SECTION */}
                <Text style={styles.sectionLabel}>Commitment Status</Text>

                {/* <View style={styles.progressBarBackground}>
                    <View
                        style={[
                            styles.progressBarFill,
                            { width: `${progress * 100}%` }
                        ]}
                    />
                </View> */}
                <View>
                    <Text style={styles.commitmentInfo}>Paid: {item.commitmentPaid}</Text>
                    <Text style={styles.commitmentInfo}>Status: {item.commitmentStatus}</Text>
                </View>

                <Text style={styles.deadlineText}>
                    Deadline: {item.commitmentDeadline}
                </Text>

            </View>
        );
    };

    const AmountItem = ({ label, value }) => (
        <View style={styles.amountItem}>
            <Text style={styles.amountLabel}>{label}</Text>
            <Text style={styles.amountValue}>KES {value}</Text>
        </View>
    );

    const Info = ({ label, value }) => (
        <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    );

    return (
        <>
            <View style={styles.container}>
                <TopBar title="Booked Plots" />
                <TextInput
                    placeholder="Search by Plot Code or Land Code..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                    style={styles.searchInput}
                />
                <FlatList
                    data={filteredData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.entryNumber.toString()}
                    contentContainerStyle={{ paddingBottom: 50 }}
                />

            </View>
        </>
    );
};

export default BookedPlots;

const styles = StyleSheet.create({
    modernCard: {
        backgroundColor: "#ffffff",
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 18,
        padding: 18,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 4,
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    plotCode: {
        fontSize: 20,
        fontWeight: "700",
        color: "#800000",
    },

    subText: {
        fontSize: 13,
        color: "#6B7280",
        marginTop: 4,
    },

    modernBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 50,
    },

    badgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },

    divider: {
        height: 1,
        backgroundColor: "#F1F1F1",
        marginVertical: 14,
    },

    amountRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    amountItem: {
        alignItems: "center",
    },

    amountLabel: {
        fontSize: 12,
        color: "#6B7280",
    },

    amountValue: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
        marginTop: 4,
    },

    sectionLabel: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
        color: "#374151",
    },

    progressBarBackground: {
        height: 8,
        backgroundColor: "#E5E7EB",
        borderRadius: 20,
        overflow: "hidden",
    },

    progressBarFill: {
        height: 8,
        backgroundColor: "#16A34A",
        borderRadius: 20,
    },
    commitmentInfo: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 4,
        backgroundColor: "#F3F4F6",
        padding: 8,
        borderRadius: 8,
    },

    deadlineText: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 8,
    },

    searchInput: {
        marginHorizontal: 16,
        marginTop: 10,
        backgroundColor: "#fff",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        fontSize: 14
    },

});







////seleton

const SkeletonCard = () => {
    const shimmerAnim = new Animated.Value(0);

    Animated.loop(
        Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1300,
            easing: Easing.linear,
            useNativeDriver: true,
        })
    ).start();
    return (
        <View style={styles.card}>
            <View style={[styles.skeletonTitle, styles.shimmer]}>
                <Animated.View
                    style={[
                        styles.shine,
                        {
                            transform: [{
                                translateX: shimmerAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-150, 300]
                                })
                            }]
                        }
                    ]}
                />
            </View>

            <View style={[styles.skeletonLine, styles.shimmer, { width: "70%" }]}>
                <Animated.View style={[
                    styles.shine,
                    {
                        transform: [{
                            translateX: shimmerAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-150, 300]
                            })
                        }]
                    }
                ]} />
            </View>

            <View style={[styles.skeletonLine, styles.shimmer, { width: "50%" }]}>
                <Animated.View style={[
                    styles.shine,
                    {
                        transform: [{
                            translateX: shimmerAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-150, 300]
                            })
                        }]
                    }
                ]} />
            </View>

            <View style={[styles.skeletonLine, styles.shimmer, { width: "60%" }]}>
                <Animated.View style={[
                    styles.shine,
                    {
                        transform: [{
                            translateX: shimmerAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-150, 300]
                            })
                        }]
                    }
                ]} />
            </View>

            <View style={styles.row}>
                <View style={[styles.skeletonLine, styles.shimmer, { width: "40%" }]}>
                    <Animated.View style={[
                        styles.shine,
                        {
                            transform: [{
                                translateX: shimmerAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-150, 300]
                                })
                            }]
                        }
                    ]} />
                </View>

                <View style={[styles.skeletonLine, styles.shimmer, { width: "30%" }]}>
                    <Animated.View style={[
                        styles.shine,
                        {
                            transform: [{
                                translateX: shimmerAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-150, 300]
                                })
                            }]
                        }
                    ]} />
                </View>
            </View>
        </View>
    );
};
