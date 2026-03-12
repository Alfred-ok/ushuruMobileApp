
import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TopBar from '../../navigation/TopBar';
import AsyncStorage from "@react-native-async-storage/async-storage";

const COLORS = {
    BACKGROUND: '#F0F2F5',
    PRIMARY: '#635BFF',
    TEXT_MAIN: '#1A1A1A',
    TEXT_MUTED: '#7A7A7A',
    SUCCESS: '#4CAF50',
    CARD_BG: '#FFFFFF',
    SKELETON: '#E1E9EE', // Light grey for skeleton blocks
};

// --- Skeleton Component ---
const SkeletonPulse = ({ style }) => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return <Animated.View style={[style, { backgroundColor: COLORS.SKELETON, opacity }]} />;
};

const AccountSkeleton = () => (
    <SafeAreaView style={styles.safeArea}>
        <View style={{ padding: 20 }}>
            {/* Header Card Skeleton */}
            <View style={[styles.balanceCard, { backgroundColor: COLORS.SKELETON, opacity: 0.5 }]}>
                <SkeletonPulse style={{ width: 100, height: 15, borderRadius: 4, marginBottom: 20 }} />
                <SkeletonPulse style={{ width: '40%', height: 12, borderRadius: 4, marginBottom: 10 }} />
                <SkeletonPulse style={{ width: '70%', height: 40, borderRadius: 8 }} />
            </View>

            {/* Assets List Skeleton */}
            <View style={[styles.assetList, { padding: 15 }]}>
                {[1, 2, 3].map((i) => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                        <SkeletonPulse style={{ width: 35, height: 35, borderRadius: 12, marginRight: 15 }} />
                        <View style={{ flex: 1 }}>
                            <SkeletonPulse style={{ width: '50%', height: 15, borderRadius: 4 }} />
                        </View>
                        <SkeletonPulse style={{ width: 60, height: 15, borderRadius: 4 }} />
                    </View>
                ))}
            </View>
        </View>
    </SafeAreaView>
);

const Accounts = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [memberNo, setMemberNo] = useState(null);

    useEffect(() => {
        loadAccountStats();
    }, []);

    const loadAccountStats = async () => {
        try {
            const storedMember = await AsyncStorage.getItem("memberNo");

            if (!storedMember) {
                console.log("No member found. Please login again.");
                setLoading(false);
                return;
            }

            setMemberNo(storedMember);

            const response = await fetch(
                `http://88.99.215.90:8001/api/member-account-statistics/?username=${storedMember}`
            );

            const data = await response.json();

            if (data.status === "success") {
                setStats(data.data);
            }

        } catch (error) {
            console.log("API ERROR:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.BACKGROUND }}>
                <TopBar title="Welcome" />
                <AccountSkeleton />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F5F5DC' }}>
            <TopBar title="My Accounts" />
            <SafeAreaView style={styles.safeArea}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                    {/* 🔥 Main Balance Card */}
                    <View style={styles.balanceCard}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardNumber}>••••  {stats?.MemberNumber?.slice(-3) || '4060'}</Text>
                            <View style={styles.currencyBadge}>
                                <Text style={styles.currencyText}>🇰🇪 KES</Text>
                                <MaterialCommunityIcons name="chevron-down" size={16} color={COLORS.TEXT_MAIN} />
                            </View>
                        </View>

                        <Text style={styles.balanceLabel}>Account Balance</Text>
                        <View style={styles.balanceRow}>
                            <Text style={styles.balanceAmount}>
                                {stats?.MemberDeposits?.split('.')[0] || '0'}
                                <Text style={styles.decimal}>.{stats?.MemberDeposits?.split('.')[1] || '00'}</Text>
                            </Text>
                        </View>
                    </View>

                    {/* 🔥 Assets Section */}
                    <View style={styles.assetList}>
                        <AssetItem
                            icon="bank"
                            label="Member Deposits"
                            value={stats?.MemberDeposits}
                            iconBg="#E7F0FF"
                            iconColor="#2F80ED"
                        />
                        <AssetItem
                            icon="chart-pie"
                            label="Share Capital"
                            value={stats?.ShareCapital}
                            iconBg="#FFE7E7"
                            iconColor="#EB5757"
                        />
                        <AssetItem
                            icon="home-city"
                            label="Plot Balance"
                            value={stats?.OutstandingPlotsBalance}
                            iconBg="#E7FFE9"
                            iconColor="#27AE60"
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const AssetItem = ({ icon, label, value, iconBg, iconColor }) => (
    <TouchableOpacity style={styles.assetItem}>
        <View style={[styles.assetIconArea, { backgroundColor: iconBg }]}>
            <MaterialCommunityIcons name={icon} size={16} color={iconColor} />
        </View>
        <View style={{ flex: 1 }}>
            <Text style={styles.assetLabelText}>{label}</Text>
        </View>
        <Text style={styles.assetValue}>Ksh {value}</Text>
        <MaterialCommunityIcons name="chevron-right" size={18} color="#CCC" style={{ marginLeft: 5 }} />
    </TouchableOpacity>
);

export default Accounts;

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    balanceCard: {
        backgroundColor: '#800020',
        margin: 20,
        borderRadius: 30,
        padding: 24,
        elevation: 5,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    cardNumber: { color: '#FFF', letterSpacing: 1 },
    currencyBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingVertical: 4, borderRadius: 10, paddingHorizontal: 8 },
    currencyText: { fontSize: 12, fontWeight: 'bold', marginRight: 4 },
    balanceLabel: { color: '#FFF', fontSize: 14, marginBottom: 8 },
    balanceAmount: { fontSize: 36, fontWeight: '700', color: '#FFF' },
    decimal: { fontSize: 20, color: '#FFF' },
    assetList: {
        backgroundColor: COLORS.CARD_BG,
        marginHorizontal: 20,
        borderRadius: 25,
        paddingVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.06)'
    },
    assetItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    assetIconArea: { width: 35, height: 35, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    assetLabelText: { fontWeight: '600', color: COLORS.TEXT_MAIN, fontSize: 14 },
    assetValue: { fontWeight: '700', color: COLORS.TEXT_MAIN, fontSize: 14 },
});