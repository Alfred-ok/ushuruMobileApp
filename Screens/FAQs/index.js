import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    LayoutAnimation,
    UIManager,
    Platform,
    ScrollView,
    SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";

// Enable Android animation
if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
}

const COLORS = {
    MAROON: "#800000",
    CREAM: "#F5F5DC",
    WHITE: "#FFFFFF",
    GREY: "#666",
    LINE: "#DDD",
};

const FAQ_DATA = [
    {
        question: "What is Ushuru Sacco?",
        answer:
            "Ushuru Sacco is a financial cooperative that provides savings, loans, and investment opportunities to its members.",
    },
    {
        question: "How do I become a member?",
        answer:
            "You can register through the Ushuru mobile app, visit our offices, or contact your nearest Ushuru agent.",
    },
    {
        question: "How can I check my shareholder or member details?",
        answer:
            "You can view your profile, shares, and loan information directly inside the Ushuru mobile app under the 'My Account' section.",
    },
    {
        question: "What types of loans does Ushuru offer?",
        answer:
            "Ushuru Sacco offers development loans, emergency loans, instant loans, school fees loans, and business loans.",
    },
    {
        question: "How long does loan processing take?",
        answer:
            "Loan processing typically takes 24 to 48 hours depending on eligibility, guarantor approval, and loan type.",
    },
];

const FAQs = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleItem = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <>

            <SafeAreaView style={styles.container}>

                {/* MAROON HEADER */}
                <View style={styles.header}>
                    <Text style={styles.headerText}>Frequently Asked Questions</Text>
                </View>

                {/* WHITE CURVED SHEET */}
                <View style={styles.sheet}>
                    <ScrollView showsVerticalScrollIndicator={false}>


                        {FAQ_DATA.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.card}
                                onPress={() => toggleItem(index)}
                                activeOpacity={0.8}
                            >
                                <View style={styles.questionRow}>
                                    <Text style={styles.questionText}>{item.question}</Text>

                                    <Feather
                                        name={activeIndex === index ? "chevron-up" : "chevron-down"}
                                        size={22}
                                        color={COLORS.MAROON}
                                    />
                                </View>

                                {activeIndex === index && (
                                    <View style={styles.answerContainer}>
                                        <Text style={styles.answerText}>{item.answer}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}

                        <View style={{ height: 40 }} />
                    </ScrollView>
                </View>
            </SafeAreaView>

        </>
    );
};

export default FAQs;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.MAROON,
    },

    /* TOP HEADER */
    header: {
        height: 160,
        paddingHorizontal: 25,
        justifyContent: "flex-end",
        paddingBottom: 25,
        backgroundColor: COLORS.MAROON,
    },
    headerText: {
        fontSize: 32,
        fontWeight: "bold",
        color: COLORS.CREAM,
    },

    /* CURVED WHITE SHEET */
    sheet: {
        flex: 1,
        backgroundColor: COLORS.CREAM,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,

        paddingTop: 30,
        paddingHorizontal: 15,
    },
    sheetTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.MAROON,
        marginBottom: 15,
        marginLeft: 5,
    },

    /* FAQ CARDS */
    card: {
        backgroundColor: COLORS.WHITE,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    questionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    questionText: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.MAROON,
        flex: 1,
        paddingRight: 10,
    },
    answerContainer: {
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.LINE,
        paddingTop: 10,
    },
    answerText: {
        fontSize: 14.5,
        lineHeight: 22,
        color: COLORS.GREY,
    },
});
