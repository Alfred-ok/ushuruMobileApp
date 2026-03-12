import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    LayoutAnimation,
    Platform,
    UIManager,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import TopBar from "../../navigation/TopBar";
import { FONTS } from "../../constants/fonts";

// Enable animation on Android
if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
}

const COLORS = {
    MAROON: "#800000",
    CREAM: "#F5F5DC",
    WHITE: "#FFF",
    GREY: "#777",
    LIGHT_LINE: "#DDD",
};

const UshuruMembershipInfo = ({ memberData }) => {
    const [expanded, setExpanded] = useState({
        membership: true,
        employment: false,
        benefits: false,
        savings: false,
    });

    const toggle = (section) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded((p) => ({ ...p, [section]: !p[section] }));
    };

    // Fallback data for testing if no API data is passed
    const data = memberData || {
        MembershipNumber: "US-00732",
        Status: "Active",
        DateJoined: "2019-04-12",
        MembershipType: "Normal Member",
        Branch: "Nairobi HQ",
        PayrollNumber: "PR23922",
        Employer: "KRA",
        Department: "Revenue Operations",
        Position: "Tax Compliance Officer",
        MonthlyContribution: "2,500",
        SavingsBalance: "86,000",
        LoanEligibility: "Up to 300,000",
        Benefits: [
            "Low interest loans",
            "Share dividends",
            "Emergency loans",
            "Business loans",
            "School fees loans",
        ],
    };

    return (
        <>
            <TopBar title="Members Information" />
            <SafeAreaView style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>


                    {/* MEMBERSHIP DETAILS */}
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => toggle("membership")}
                    >
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>Membership Details</Text>
                            <Feather
                                name={expanded.membership ? "chevron-up" : "chevron-down"}
                                size={22}
                                color={COLORS.MAROON}
                            />
                        </View>

                        {expanded.membership && (
                            <View style={styles.cardBody}>
                                <InfoItem label="Membership Number" value={data.MembershipNumber} />
                                <InfoItem label="Membership Type" value={data.MembershipType} />
                                <InfoItem label="Status" value={data.Status} />
                                <InfoItem label="Date Joined" value={data.DateJoined} />
                                <InfoItem label="Branch" value={data.Branch} />
                                <InfoItem label="Payroll Number" value={data.PayrollNumber} />
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* EMPLOYMENT DETAILS */}
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => toggle("employment")}
                    >
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>Employment Details</Text>
                            <Feather
                                name={expanded.employment ? "chevron-up" : "chevron-down"}
                                size={22}
                                color={COLORS.MAROON}
                            />
                        </View>

                        {expanded.employment && (
                            <View style={styles.cardBody}>
                                <InfoItem label="Employer" value={data.Employer} />
                                <InfoItem label="Department" value={data.Department} />
                                <InfoItem label="Position" value={data.Position} />
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* MEMBERSHIP BENEFITS */}
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => toggle("benefits")}
                    >
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>Membership Benefits</Text>
                            <Feather
                                name={expanded.benefits ? "chevron-up" : "chevron-down"}
                                size={22}
                                color={COLORS.MAROON}
                            />
                        </View>

                        {expanded.benefits && (
                            <View style={styles.cardBody}>
                                {data.Benefits.map((item, index) => (
                                    <Text key={index} style={styles.benefitItem}>
                                        • {item}
                                    </Text>
                                ))}
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* SAVINGS & CONTRIBUTIONS */}
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => toggle("savings")}
                    >
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>Savings & Contributions</Text>
                            <Feather
                                name={expanded.savings ? "chevron-up" : "chevron-down"}
                                size={22}
                                color={COLORS.MAROON}
                            />
                        </View>

                        {expanded.savings && (
                            <View style={styles.cardBody}>
                                <InfoItem
                                    label="Savings Balance"
                                    value={`KSh ${data.SavingsBalance}`}
                                />
                                <InfoItem
                                    label="Monthly Contribution"
                                    value={`KSh ${data.MonthlyContribution}`}
                                />
                                <InfoItem
                                    label="Loan Eligibility"
                                    value={data.LoanEligibility}
                                />
                            </View>
                        )}
                    </TouchableOpacity>

                </ScrollView>

            </SafeAreaView>
        </>
    );
};

// Reusable info row component
const InfoItem = ({ label, value }) => (
    <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value || "-"}</Text>
    </View>
);

export default UshuruMembershipInfo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.CREAM,
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    header: {
        fontSize: 22,
        fontFamily: FONTS.bold,
        color: COLORS.MAROON,
        marginBottom: 14,
        textAlign: "center",
    },
    card: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 12,
        marginBottom: 14,
        paddingHorizontal: 14,
        paddingVertical: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cardTitle: {
        fontSize: 17,
        fontFamily: FONTS.medium,
        color: COLORS.MAROON,
    },
    cardBody: {
        marginTop: 8,
        borderTopWidth: 1,
        borderTopColor: COLORS.LIGHT_LINE,
        paddingTop: 8,
    },
    row: {
        marginBottom: 6,
    },
    label: {
        fontSize: 14,
        fontFamily: FONTS.medium,
        color: COLORS.GREY,
    },
    value: {
        fontSize: 15,
        fontFamily: FONTS.bold,
        color: COLORS.MAROON,
        marginTop: 0,
    },
    benefitItem: {
        fontSize: 15,
        fontFamily: FONTS.regular,
        marginBottom: 6,
        color: COLORS.GREY,
    },
});
