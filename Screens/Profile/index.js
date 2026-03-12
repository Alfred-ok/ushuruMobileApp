import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Switch,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import {
    MaterialCommunityIcons,
    MaterialIcons,
    Feather,
    Ionicons
} from '@expo/vector-icons';
import URL from '../../BaseUrl';
import AsyncStorage from "@react-native-async-storage/async-storage";

const COLORS = {
    MAROON: '#800000',
    CREAM: '#F5F5DC',
    ACCENT_MAROON: '#B03060',
    GREY_TEXT: '#555555',
    LIGHT_GREY_LINE: '#E5E5E5',
};

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [nextOfKin, setNextOfKin] = useState([]);
    const [nominees, setNominees] = useState([]);
    const [memberNumber, setMemberNumber] = useState(null);


    useEffect(() => {
        fetchProfile();
        loadMember();
    }, []);

    const loadMember = async () => {
        try {
            const storedMember = await AsyncStorage.getItem("memberNo");

            if (storedMember) {
                setMemberNumber(storedMember);
                fetchProfile(storedMember);
            } else {
                setLoading(false);
                console.log("No member number found");
            }
        } catch (error) {
            console.error("Storage Error:", error);
            setLoading(false);
        }
    };

    const fetchProfile = async (memberNo) => {
        try {
            const response = await fetch(
                `${URL.BASE_URL}/api/member-profile/?username=${memberNo}`
            );

            const data = await response.json();

            setProfile(data.profile);
            setNextOfKin(data.next_of_kin || []);
            setNominees(data.nominees || []);
        } catch (error) {
            console.error("Profile Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 120 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* TOP HEADER SKELETON */}
                    <View style={[styles.topHeader, { opacity: 0.5 }]} />

                    {/* PROFILE CARD SKELETON */}
                    <View style={styles.profileCard}>
                        <View style={styles.profileImageWrapper}>
                            <View style={styles.skeletonCircle} />
                        </View>

                        <View style={styles.skeletonLineShort} />
                        <View style={styles.skeletonLineTiny} />

                        <View style={styles.skeletonButton} />
                    </View>

                    {/* PERSONAL INFO SKELETON */}
                    <View style={styles.sectionCard}>
                        <View style={styles.skeletonLineMedium} />

                        <View style={styles.skeletonInfoRow} />
                        <View style={styles.skeletonInfoRow} />
                        <View style={styles.skeletonInfoRow} />
                        <View style={styles.skeletonInfoRow} />
                        <View style={styles.skeletonInfoRow} />
                    </View>
                </ScrollView>

            </SafeAreaView>
        );
    }

    return (
        <>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 120 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* TOP YELLOW HEADER */}
                    <View style={styles.topHeader} />

                    {/* FLOATING PROFILE CARD */}
                    <View style={styles.profileCard}>
                        <View style={styles.profileImageWrapper}>
                            <View style={styles.profileImageCircle}>
                                <Text style={styles.profileInitials}>
                                    {profile?.FullName?.slice(0, 2).toUpperCase()}
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.profileName}>{profile?.FullName}</Text>
                        <Text style={styles.profileSubLabel}>Member</Text>

                        {/* <TouchableOpacity style={styles.connectBtn}>
                            <Text style={styles.connectText}>Edit Profile</Text>
                        </TouchableOpacity> */}
                    </View>

                    {/* PERSONAL INFO CARD */}
                    {/* PERSONAL INFORMATION */}
                    <View style={styles.sectionCard}>
                        <Text style={styles.sectionTitle}>Personal Information</Text>

                        {/* STATUS BADGE */}
                        {/* <View style={[
                            styles.statusBadge,
                            profile?.Status === "Active"
                                ? styles.activeBadge
                                : styles.inactiveBadge
                        ]}>
                            <Text style={styles.statusText}>{profile?.Status}</Text>
                        </View> */}

                        {[
                            { icon: "numeric", label: "Member Number", value: profile?.MemberNumber },
                            { icon: "badge-account-horizontal-outline", label: "ID Number", value: profile?.IDNumber },
                            { icon: "phone-outline", label: "Phone Number", value: profile?.Phone },
                            { icon: "email-outline", label: "Email Address", value: profile?.Email },
                            { icon: "briefcase-outline", label: "Payroll Number", value: profile?.PayrollNumber || "N/A" },
                        ].map((item, index) => (
                            <View key={index} style={styles.infoCardRow}>
                                <View style={styles.iconContainer}>
                                    <MaterialCommunityIcons
                                        name={item.icon}
                                        size={20}
                                        color="#8B0000"
                                    />
                                </View>

                                <View style={{ flex: 1 }}>
                                    <Text style={styles.infoLabel}>{item.label}</Text>
                                    <Text style={styles.infoValue}>{item.value || "N/A"}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* NEXT OF KIN */}
                    <View style={styles.sectionCard}>
                        <Text style={styles.sectionTitle}>Next of Kin</Text>

                        {nextOfKin.length === 0 ? (
                            <Text style={styles.emptyText}>No next of kin added</Text>
                        ) : (
                            nextOfKin.map((kin, index) => (
                                <View key={index} style={styles.infoCardRow}>
                                    <Text style={styles.infoValue}>{kin.Name}</Text>
                                </View>
                            ))
                        )}
                    </View>

                    {/* NOMINEES */}
                    <View style={styles.sectionCard}>
                        <Text style={styles.sectionTitle}>Nominees</Text>

                        {nominees.length === 0 ? (
                            <Text style={styles.emptyText}>No nominees added</Text>
                        ) : (
                            nominees.map((nominee, index) => (
                                <View key={index} style={styles.nomineeCard}>
                                    <View style={styles.nomineeHeader}>
                                        <MaterialCommunityIcons
                                            name="account-star-outline"
                                            size={20}
                                            color="#8B0000"
                                        />
                                        <Text style={styles.nomineeName}>
                                            {nominee.Name}
                                        </Text>
                                    </View>

                                    <View style={styles.nomineeDetails}>
                                        <Text style={styles.nomineeDetail}>
                                            Relationship: {nominee.Relationship}
                                        </Text>
                                        <Text style={styles.nomineeDetail}>
                                            Allocation: {nominee.Allocation}%
                                        </Text>
                                        <Text style={styles.nomineeDetail}>
                                            DOB: {nominee.DOB}
                                        </Text>
                                        {nominee.Guardian ? (
                                            <Text style={styles.nomineeDetail}>
                                                Guardian: {nominee.Guardian}
                                            </Text>
                                        ) : null}
                                    </View>
                                </View>
                            ))
                        )}
                    </View>


                </ScrollView>

            </SafeAreaView>
        </>
    );
};

export default Profile;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.CREAM,
    },

    topHeader: {
        height: 160,
        backgroundColor: "#8B0000",

    },

    profileCard: {
        marginTop: -60,
        marginHorizontal: 25,
        backgroundColor: "white",
        borderRadius: 22,
        paddingTop: 70,
        paddingBottom: 25,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
    },

    profileImageWrapper: {
        position: "absolute",
        top: -40,
        alignSelf: "center",
    },

    profileImageCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#8B0000",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: COLORS.CREAM,
    },

    profileInitials: {
        fontSize: 30,
        fontWeight: "bold",
        color: COLORS.CREAM,
    },

    profileName: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.MAROON,
    },

    profileSubLabel: {
        fontSize: 13,
        color: COLORS.GREY_TEXT,
        marginTop: 3,
    },

    connectBtn: {
        backgroundColor: "#8B0000",
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 10,
    },

    connectText: {
        color: "#fff",
        fontWeight: "600",
    },

    /* SECTION CARD */
    sectionCard: {
        marginTop: 20,
        marginHorizontal: 20,
        backgroundColor: "#FFF",
        borderRadius: 18,
        paddingHorizontal: 15,
        paddingVertical: 15,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.MAROON,
        marginBottom: 15,
        marginLeft: 8,
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.LIGHT_GREY_LINE,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 5,
        marginBottom: 5,
    },

    infoTextWrapper: {
        marginLeft: 12,
        flex: 1,
    },

    infoLabel: {
        fontSize: 13,
        color: COLORS.GREY_TEXT,
    },

    infoValue: {
        fontSize: 15,
        fontWeight: "600",
        color: COLORS.MAROON,
        marginTop: 2,
    },



    // SKELETON BASE
    skeletonBase: {
        backgroundColor: "#ddd",
        borderRadius: 8,
        overflow: "hidden",
    },

    skeletonCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#e0e0e0",
    },

    skeletonLineShort: {
        width: 140,
        height: 18,
        backgroundColor: "#e0e0e0",
        borderRadius: 6,
        marginTop: 15,
    },

    skeletonLineTiny: {
        width: 80,
        height: 12,
        backgroundColor: "#e0e0e0",
        borderRadius: 6,
        marginTop: 8,
    },

    skeletonButton: {
        width: 120,
        height: 32,
        backgroundColor: "#e0e0e0",
        borderRadius: 16,
        marginTop: 15,
    },

    skeletonLineMedium: {
        width: 180,
        height: 16,
        backgroundColor: "#e0e0e0",
        borderRadius: 6,
        marginBottom: 20,
    },

    skeletonInfoRow: {
        width: "100%",
        height: 55,
        backgroundColor: "#e0e0e0",
        borderRadius: 10,
        marginBottom: 12,
    },

    /* STATUS */
    statusBadge: {
        alignSelf: "flex-start",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 15,
    },

    activeBadge: {
        backgroundColor: "#E6F4EA",
    },

    inactiveBadge: {
        backgroundColor: "#FDECEA",
    },

    statusText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#2E7D32",
    },

    /* INFO CARD ROW */
    infoCardRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FAFAFA",
        padding: 14,
        borderRadius: 14,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 1,
    },

    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "#FCEAEA",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    infoLabel: {
        fontSize: 12,
        color: "#777",
    },

    infoValue: {
        fontSize: 15,
        fontWeight: "600",
        color: "#800000",
    },

    /* EMPTY */
    emptyText: {
        color: "#888",
        fontSize: 14,
        marginTop: 10,
    },

    /* NOMINEE */
    nomineeCard: {
        backgroundColor: "#FAFAFA",
        padding: 15,
        borderRadius: 14,
        marginBottom: 12,
    },

    nomineeHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },

    nomineeName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#800000",
        marginLeft: 8,
    },

    nomineeDetails: {
        marginLeft: 28,
    },

    nomineeDetail: {
        fontSize: 13,
        color: "#555",
        marginBottom: 4,
    },

});
