import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import TopBar from '../../navigation/TopBar';

const { width } = Dimensions.get('window');

// Define colors to match the new maroon and cream aesthetic
const COLORS = {
    MAROON: '#800000', // A deep red/brown
    CREAM: '#F5F5DC', // A light, warm off-white
    ACCENT_MAROON: '#B03060', // A slightly brighter maroon for accents
    GREY_TEXT: '#555555',
    LIGHT_GREY_LINE: '#CCCCCC',
    CARD_BG: '#FFFFFF', // Still using white for card backgrounds for contrast
    GREEN_ACCENT: '#4CAF50',
    RED_ACCENT: '#F44336',
    ORANGE_ACCENT: '#FF9800',
};

// Reusable Card Component
const Card = ({ children, style }) => (
    <View style={[styles.card, style]}>
        {children}
    </View>
);

// ShareholderDetails Component
const ShareholderDetails = () => {
    // Dummy data for details
    const totalShares = 1500;
    const monthlyDividend = 1450; // Example value

    return (
        <>
            <TopBar title="Booked Plots" />
            <SafeAreaView style={styles.safeArea}>
                <ScrollView style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Shareholder Details</Text>
                        <TouchableOpacity style={styles.menuIconContainer}>
                            <MaterialCommunityIcons name="menu" size={24} color={COLORS.MAROON} />
                        </TouchableOpacity>
                    </View>

                    {/* Shareholder Summary Card (modified to remove chart) */}
                    <Card>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>Overall Summary</Text>
                        </View>
                        <View style={styles.summaryContentNoChart}>
                            <View style={styles.summaryInfoBlock}>
                                <Text style={styles.summaryLabel}>Total Holdings Value</Text>
                                <Text style={styles.summaryValue}>250,123.00 kr.</Text>
                            </View>
                            <View style={styles.summaryInfoBlock}>
                                <Text style={styles.summaryLabel}>Portfolio Growth (YTD)</Text>
                                <Text style={[styles.summaryValue, { color: COLORS.GREEN_ACCENT }]}>+25.30%</Text>
                            </View>
                        </View>
                        <Text style={styles.cardSubtitle}>A quick overview of your investments.</Text>
                    </Card>

                    {/* Investment Portfolio Card (no chart) */}
                    <Card>
                        <Text style={styles.cardTitle}>Investment Portfolio</Text>
                        <Text style={styles.cardSubtitle}>Here's a breakdown of your current holdings</Text>

                        <View style={styles.portfolioDetails}>
                            <View style={styles.portfolioRow}>
                                <Text style={styles.portfolioLabel}>Total Shares Held:</Text>
                                <Text style={styles.portfolioValue}>{totalShares.toLocaleString()} units</Text>
                            </View>
                            <View style={styles.portfolioRow}>
                                <Text style={styles.portfolioLabel}>Current Market Value:</Text>
                                <Text style={styles.portfolioValue}>250,123.00 kr.</Text>
                            </View>
                            <View style={styles.portfolioRow}>
                                <Text style={styles.portfolioLabel}>Invested Capital:</Text>
                                <Text style={styles.portfolioValue}>200,000.00 kr.</Text>
                            </View>
                            <View style={styles.portfolioRow}>
                                <Text style={styles.portfolioLabel}>Dividends Earned:</Text>
                                <Text style={[styles.portfolioValue, { color: COLORS.GREEN_ACCENT }]}>+12,500.00 kr.</Text>
                            </View>
                            <View style={styles.portfolioRow}>
                                <Text style={styles.portfolioLabel}>Unrealized Gain/Loss:</Text>
                                <Text style={[styles.portfolioValue, { color: COLORS.GREEN_ACCENT }]}>+50,123.00 kr.</Text>
                            </View>
                        </View>
                    </Card>

                    {/* Recent Transactions Card (similar to Installments) */}
                    <Card>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>Recent Transactions</Text>
                            <TouchableOpacity onPress={() => console.log('View All Transactions')}>
                                <Text style={styles.viewAllText}>VIEW ALL </Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.cardSubtitle}>Here's a list of your latest activities</Text>

                        {/* Transaction Item 1 */}
                        <View style={styles.transactionItem}>
                            <View style={[styles.transactionIconCircle, { backgroundColor: COLORS.MAROON + '20' }]}>
                                <MaterialCommunityIcons name="arrow-up" size={24} color={COLORS.MAROON} />
                            </View>
                            <View style={styles.transactionDetails}>
                                <Text style={styles.transactionName}>Purchase - Company X</Text>
                                <Text style={styles.transactionDate}>25 May, 2023</Text>
                            </View>
                            <Text style={styles.transactionAmount}>-10,000.00 kr.</Text>
                        </View>
                        {/* Transaction Item 2 */}
                        <View style={styles.transactionItem}>
                            <View style={[styles.transactionIconCircle, { backgroundColor: COLORS.GREEN_ACCENT + '20' }]}>
                                <MaterialCommunityIcons name="arrow-down" size={24} color={COLORS.GREEN_ACCENT} />
                            </View>
                            <View style={styles.transactionDetails}>
                                <Text style={styles.transactionName}>Dividend Payout - Company Y</Text>
                                <Text style={styles.transactionDate}>20 May, 2023</Text>
                            </View>
                            <Text style={[styles.transactionAmount, { color: COLORS.GREEN_ACCENT }]}>+500.00 kr.</Text>
                        </View>
                        {/* Transaction Item 3 */}
                        <View style={styles.transactionItem}>
                            <View style={[styles.transactionIconCircle, { backgroundColor: COLORS.ORANGE_ACCENT + '20' }]}>
                                <MaterialIcons name="security" size={24} color={COLORS.ORANGE_ACCENT} />
                            </View>
                            <View style={styles.transactionDetails}>
                                <Text style={styles.transactionName}>Security Transfer - Brokerage Fee</Text>
                                <Text style={styles.transactionDate}>18 May, 2023</Text>
                            </View>
                            <Text style={[styles.transactionAmount, { color: COLORS.RED_ACCENT }]}>-50.00 kr.</Text>
                        </View>
                    </Card>

                    {/* Monthly Dividend Estimation Card (similar to Monthly Installment) */}
                    <Card style={{ backgroundColor: COLORS.RED_ACCENT + '10' }}>
                        <View style={styles.monthlyInstallment}>
                            <MaterialIcons name="payments" size={24} color={COLORS.RED_ACCENT} />
                            <Text style={styles.monthlyInstallmentText}>Estimated Monthly Dividend</Text>
                            <Text style={styles.monthlyInstallmentAmount}>+ {monthlyDividend.toLocaleString()} kr.</Text>
                        </View>
                    </Card>

                </ScrollView>
            </SafeAreaView>
        </>
    );
};

export default ShareholderDetails;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.CREAM, // Cream background
    },
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 5,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.MAROON, // Maroon text
    },
    menuIconContainer: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: COLORS.CARD_BG,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    card: {
        backgroundColor: COLORS.CARD_BG,
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.MAROON, // Maroon text
    },
    cardSubtitle: {
        fontSize: 14,
        color: COLORS.GREY_TEXT,
        marginBottom: 15,
    },
    viewAllText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.ACCENT_MAROON, // Maroon accent for links
    },
    // Modified summary content for no chart
    summaryContentNoChart: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        flexWrap: 'wrap', // Allow items to wrap
    },
    summaryInfoBlock: {
        alignItems: 'center',
        marginHorizontal: 10,
        marginBottom: 10,
    },
    summaryLabel: {
        fontSize: 14,
        color: COLORS.GREY_TEXT,
        marginBottom: 5,
    },
    summaryValue: {
        fontSize: 22, // Slightly smaller without a large circle next to it
        fontWeight: 'bold',
        color: COLORS.MAROON, // Maroon text
    },
    portfolioDetails: {
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: COLORS.LIGHT_GREY_LINE,
        paddingTop: 15,
    },
    portfolioRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    portfolioLabel: {
        fontSize: 15,
        color: COLORS.GREY_TEXT,
    },
    portfolioValue: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.MAROON, // Maroon text
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.LIGHT_GREY_LINE,
    },
    transactionIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    transactionDetails: {
        flex: 1,
    },
    transactionName: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.MAROON, // Maroon text
    },
    transactionDate: {
        fontSize: 12,
        color: COLORS.GREY_TEXT,
        marginTop: 2,
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.RED_ACCENT, // Red for negative, green for positive
    },
    monthlyInstallment: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    monthlyInstallmentText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.RED_ACCENT, // Keep red for the "installment" concept (or dividend outflow)
        marginLeft: 10,
    },
    monthlyInstallmentAmount: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.RED_ACCENT,
    },
});