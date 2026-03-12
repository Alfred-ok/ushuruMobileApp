import React, { useEffect, useState } from "react";
import {
    View, Text, StyleSheet, FlatList,
    Animated, Easing, TextInput, Modal,
    TouchableOpacity, ScrollView, ActivityIndicator
} from "react-native";
import TopBar from "../../navigation/TopBar";
import URL from '../../BaseUrl';
import { FONTS } from "../../constants/fonts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

const BookedPlots = ({ route }) => {
    // You can pass memberNo using navigation OR hardcode it

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [memberNo, setMemberNo] = useState(null);

    const [offerModalVisible, setOfferModalVisible] = useState(false);
    const [offerData, setOfferData] = useState([]);
    const [offerLoading, setOfferLoading] = useState(false);
    const [offerError, setOfferError] = useState("");



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

    const fetchOffer = async () => {
        setOfferLoading(true);
        setOfferError("");
        setOfferData([]);
        setOfferModalVisible(true);
        try {
            const response = await fetch(
                `http://88.99.215.90:8001/api/get-member-plots-offer/?member_no=${memberNo}`
            );
            const json = await response.json();
            const items = Array.isArray(json) ? json : json.data ?? json.results ?? [];
            setOfferData(items);
        } catch {
            setOfferError("Could not load offer details. Please try again.");
        } finally {
            setOfferLoading(false);
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

                {item.bookingStatus === "Completed" && (
                    <>
                        <View style={styles.divider} />
                        <TouchableOpacity
                            style={styles.offerButton}
                            onPress={fetchOffer}
                            activeOpacity={0.82}
                        >
                            <Text style={styles.offerButtonText}>View Offer</Text>
                        </TouchableOpacity>
                    </>
                )}

            </View>
        );
    };

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
                    contentContainerStyle={{ paddingBottom: 48 }}
                />
            </View>

            {/* OFFER BOTTOM MODAL */}
            <Modal
                visible={offerModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setOfferModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalSheet}>

                        {/* MODAL HEADER */}
                        <View style={styles.modalHeader}>
                            <View style={styles.modalHandle} />
                            <View style={styles.modalTitleRow}>
                                <Text style={styles.modalTitle}>Plot Offer Details</Text>
                                <TouchableOpacity
                                    onPress={() => setOfferModalVisible(false)}
                                    style={styles.closeButton}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.closeButtonText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 30 }}
                        >
                            {offerLoading && (
                                <View style={styles.modalCenter}>
                                    <ActivityIndicator size="large" color="#800000" />
                                    <Text style={styles.modalLoadingText}>Loading offer...</Text>
                                </View>
                            )}

                            {!offerLoading && offerError !== "" && (
                                <View style={styles.modalCenter}>
                                    <Text style={styles.modalErrorText}>{offerError}</Text>
                                </View>
                            )}

                            {!offerLoading && offerError === "" && offerData.length === 0 && (
                                <View style={styles.modalCenter}>
                                    <Text style={styles.modalEmptyText}>No offer data available.</Text>
                                </View>
                            )}

                            {!offerLoading && offerData.map((offer, index) => (
                                <OfferCard key={index} offer={offer} memberNo={memberNo} />
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const AmountItem = ({ label, value }) => (
    <View style={styles.amountItem}>
        <Text style={styles.amountLabel}>{label}</Text>
        <Text style={styles.amountValue}>KES {value}</Text>
    </View>
);

const OfferRow = ({ label, value }) => (
    <View style={styles.offerRow}>
        <Text style={styles.offerRowLabel}>{label}</Text>
        <Text style={styles.offerRowValue}>{value ?? "—"}</Text>
    </View>
);

const fmt = (n) =>
    n != null ? Number(n).toLocaleString("en-KE") : "—";

const getOfferStatusColor = (status) => {
    switch (status) {
        case "Active":     return "#2563EB";
        case "Completed":  return "#16A34A";
        case "Pending":    return "#F59E0B";
        case "Acquired":   return "#16A34A";
        default:           return "#6B7280";
    }
};

const getPlotStatusColor = (status) => {
    switch (status) {
        case "Acquired": return "#16A34A";
        case "Booked":   return "#2563EB";
        default:         return "#6B7280";
    }
};

const todayStr = () => new Date().toISOString().split("T")[0];
const nowTimeStr = () => new Date().toTimeString().slice(0, 5);

const OfferCard = ({ offer, memberNo }) => {
    const offerStatus = offer.plot_offer_status && offer.plot_offer_status !== "0"
        ? offer.plot_offer_status
        : null;

    const [payVisible, setPayVisible] = useState(false);
    const [payForm, setPayForm] = useState({});
    const [payLoading, setPayLoading] = useState(false);
    const [payResult, setPayResult] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const openPayment = () => {
        setPayResult(null);
        setPayForm({
            amount: "",
            cheque_date: todayStr(),
            cheque_no: "",
            transaction_time: nowTimeStr(),
            transaction_type: "3",
        });
        setPayVisible(true);
    };

    const submitPayment = async () => {
        if (!payForm.amount || !payForm.cheque_no) return;
        setPayLoading(true);
        setPayResult(null);
        try {
            const res = await fetch("http://88.99.215.90:8001/api/general-receipts/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount:           payForm.amount,
                    cheque_date:      payForm.cheque_date,
                    cheque_no:        payForm.cheque_no,
                    customer_no:      String(memberNo),
                    plot_code:        offer.plot_code,
                    transaction_time: payForm.transaction_time,
                    transaction_type: 3,
                }),
            });
            const json = await res.json();
            setPayResult({ success: json.status === "success", message: json.message ?? "Done." });
            setTimeout(() => setPayVisible(false), 3000);
        } catch {
            setPayResult({ success: false, message: "Network error. Please try again." });
            setTimeout(() => setPayVisible(false), 3000);
        } finally {
            setPayLoading(false);
        }
    };

    return (
        <View style={styles.offerCard}>

            {/* HEADER */}
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.plotCode}>{offer.plot_code}</Text>
                    <Text style={styles.subText}>
                        {offer.land_code}
                        {offer.description ? ` • ${offer.description}` : ""}
                    </Text>
                </View>
                <View style={{ alignItems: "flex-end", gap: 6 }}>
                    {offerStatus && (
                        <View style={[styles.modernBadge, { backgroundColor: getOfferStatusColor(offerStatus) }]}>
                            <Text style={styles.badgeText}>{offerStatus}</Text>
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.divider} />

            {/* PRICING ROW */}
            <View style={styles.amountRow}>
                <AmountItem label="Member Price"     value={fmt(offer.member_price)} />
                <AmountItem label="Non-Member Price" value={fmt(offer.non_member_price)} />
                <AmountItem label="Balance"          value={fmt(offer.balance)} />
            </View>

            <View style={styles.divider} />

            {/* PLOT DETAILS */}
            <Text style={styles.sectionLabel}>Plot Details</Text>
            <OfferRow label="Area"        value={`${offer.area} Ha`} />
            <OfferRow label="Land Code"   value={offer.land_code} />
            <OfferRow label="Location"    value={offer.description} />
            <OfferRow label="Plot Status" value={offer.plot_status} />

            <View style={styles.divider} />

            {/* ACTION BUTTONS */}
            <View style={styles.offerActionRow}>
                <TouchableOpacity style={styles.offerActionBtn} activeOpacity={0.8}>
                    <Text style={styles.offerActionText}>Generate Plan</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.offerActionBtn, styles.offerActionBtnOutline]} activeOpacity={0.8}>
                    <Text style={[styles.offerActionText, styles.offerActionTextOutline]}>View Plan</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.offerActionBtn, styles.offerActionBtnGreen]}
                    activeOpacity={0.8}
                    onPress={openPayment}
                >
                    <Text style={styles.offerActionText}>Make Payment</Text>
                </TouchableOpacity>
            </View>

            {/* PAYMENT DIALOG */}
            <Modal
                visible={payVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setPayVisible(false)}
            >
                <View style={styles.payOverlay}>
                    <View style={styles.payDialog}>

                        {/* DIALOG HEADER */}
                        <View style={styles.payDialogHeader}>
                            <Text style={styles.payDialogTitle}>Make Payment</Text>
                            <TouchableOpacity
                                onPress={() => setPayVisible(false)}
                                style={styles.closeButton}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.divider} />

                        <ScrollView showsVerticalScrollIndicator={false}>

                            {/* READ-ONLY FIELDS */}
                            <Text style={styles.payFieldLabel}>Customer No.</Text>
                            <View style={styles.payReadOnly}>
                                <Text style={styles.payReadOnlyText}>{memberNo}</Text>
                            </View>

                            <Text style={styles.payFieldLabel}>Plot Code</Text>
                            <View style={styles.payReadOnly}>
                                <Text style={styles.payReadOnlyText}>{offer.plot_code}</Text>
                            </View>

                            {/* EDITABLE FIELDS */}
                            <Text style={styles.payFieldLabel}>Amount <Text style={styles.payRequired}>*</Text></Text>
                            <TextInput
                                style={styles.payInput}
                                value={payForm.amount}
                                onChangeText={(v) => setPayForm(f => ({ ...f, amount: v }))}
                                keyboardType="numeric"
                                placeholder="e.g. 9000.00"
                                placeholderTextColor="#9CA3AF"
                                editable={!payLoading}
                            />

                            <Text style={styles.payFieldLabel}>Reference / Cheque No. <Text style={styles.payRequired}>*</Text></Text>
                            <TextInput
                                style={styles.payInput}
                                value={payForm.cheque_no}
                                onChangeText={(v) => setPayForm(f => ({ ...f, cheque_no: v }))}
                                placeholder="e.g. REF-544098"
                                placeholderTextColor="#9CA3AF"
                                editable={!payLoading}
                            />

                            <Text style={styles.payFieldLabel}>Date</Text>
                            <TouchableOpacity
                                style={styles.payPickerTrigger}
                                onPress={() => !payLoading && setShowDatePicker(true)}
                                activeOpacity={0.75}
                            >
                                <Text style={styles.payPickerText}>{payForm.cheque_date}</Text>
                                <Text style={styles.payPickerIcon}></Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={new Date(payForm.cheque_date)}
                                    mode="date"
                                    display="default"
                                    onChange={(_, selected) => {
                                        setShowDatePicker(false);
                                        if (selected) {
                                            const yyyy = selected.getFullYear();
                                            const mm = String(selected.getMonth() + 1).padStart(2, "0");
                                            const dd = String(selected.getDate()).padStart(2, "0");
                                            setPayForm(f => ({ ...f, cheque_date: `${yyyy}-${mm}-${dd}` }));
                                        }
                                    }}
                                />
                            )}

                            <Text style={styles.payFieldLabel}>Transaction Time</Text>
                            <TouchableOpacity
                                style={styles.payPickerTrigger}
                                onPress={() => !payLoading && setShowTimePicker(true)}
                                activeOpacity={0.75}
                            >
                                <Text style={styles.payPickerText}>{payForm.transaction_time}</Text>
                                <Text style={styles.payPickerIcon}></Text>
                            </TouchableOpacity>
                            {showTimePicker && (
                                <DateTimePicker
                                    value={(() => {
                                        const [h, m] = (payForm.transaction_time || "00:00").split(":").map(Number);
                                        const d = new Date();
                                        d.setHours(h, m, 0, 0);
                                        return d;
                                    })()}
                                    mode="time"
                                    is24Hour
                                    display="default"
                                    onChange={(_, selected) => {
                                        setShowTimePicker(false);
                                        if (selected) {
                                            const hh = String(selected.getHours()).padStart(2, "0");
                                            const mm = String(selected.getMinutes()).padStart(2, "0");
                                            setPayForm(f => ({ ...f, transaction_time: `${hh}:${mm}` }));
                                        }
                                    }}
                                />
                            )}

                            {/*<Text style={styles.payFieldLabel}>Transaction Type</Text>
                            <TextInput
                                style={styles.payInput}
                                value={payForm.transaction_type}
                                onChangeText={(v) => setPayForm(f => ({ ...f, transaction_type: v }))}
                                keyboardType="numeric"
                                placeholder="3"
                                placeholderTextColor="#9CA3AF"
                                editable={!payLoading}
                            />*/}

                            {/* RESULT BANNER */}
                            {payResult && (
                                <View style={[
                                    styles.payResultBanner,
                                    payResult.success ? styles.payResultSuccess : styles.payResultError
                                ]}>
                                    <Text style={styles.payResultText}>{payResult.message}</Text>
                                </View>
                            )}

                            {/* SUBMIT */}
                            <TouchableOpacity
                                style={[
                                    styles.paySubmitBtn,
                                    (payLoading || !payForm.amount || !payForm.cheque_no)
                                        && styles.paySubmitBtnDisabled
                                ]}
                                onPress={submitPayment}
                                activeOpacity={0.85}
                                disabled={payLoading || !payForm.amount || !payForm.cheque_no}
                            >
                                {payLoading
                                    ? <ActivityIndicator color="#fff" />
                                    : <Text style={styles.paySubmitText}>Submit Payment</Text>
                                }
                            </TouchableOpacity>

                        </ScrollView>
                    </View>
                </View>
            </Modal>

        </View>
    );
};

export default BookedPlots;

const styles = StyleSheet.create({
    modernCard: {
        backgroundColor: "#ffffff",
        marginHorizontal: 16,
        marginTop: 14,
        borderRadius: 18,
        paddingVertical: 16,
        paddingHorizontal: 18,
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
        fontFamily: FONTS.bold,
        color: "#800000",
    },

    subText: {
        fontSize: 13,
        fontFamily: FONTS.regular,
        color: "#6B7280",
        marginTop: 0,
    },

    modernBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 50,
    },

    badgeText: {
        color: "#fff",
        fontSize: 12,
        fontFamily: FONTS.medium,
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
        fontFamily: FONTS.regular,
        color: "#6B7280",
    },

    amountValue: {
        fontSize: 16,
        fontFamily: FONTS.bold,
        color: "#111827",
        marginTop: 0,
    },

    sectionLabel: {
        fontSize: 14,
        fontFamily: FONTS.medium,
        marginBottom: 6,
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
        fontFamily: FONTS.regular,
        color: "#6B7280",
        marginTop: 0,
        backgroundColor: "#F3F4F6",
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 8,
    },

    deadlineText: {
        fontSize: 12,
        fontFamily: FONTS.regular,
        color: "#6B7280",
        marginTop: 6,
    },

    searchInput: {
        marginHorizontal: 16,
        marginTop: 8,
        backgroundColor: "#fff",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        fontSize: 14,
        fontFamily: FONTS.regular,
    },

    offerButton: {
        backgroundColor: "#800000",
        borderRadius: 12,
        paddingVertical: 10,
        alignItems: "center",
        marginTop: 0,
    },

    offerButtonText: {
        color: "#fff",
        fontSize: 14,
        fontFamily: FONTS.bold,
        letterSpacing: 0.4,
    },

    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "flex-end",
    },

    modalSheet: {
        backgroundColor: "#F9FAFB",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: "80%",
        paddingHorizontal: 0,
        paddingBottom: 0,
    },

    modalHeader: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 6,
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F1F1",
    },

    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: "#D1D5DB",
        borderRadius: 99,
        alignSelf: "center",
        marginBottom: 10,
    },

    modalTitleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
    },

    modalTitle: {
        fontSize: 18,
        fontFamily: FONTS.bold,
        color: "#800000",
    },

    closeButton: {
        backgroundColor: "#F3F4F6",
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },

    closeButtonText: {
        fontSize: 14,
        color: "#374151",
        fontFamily: FONTS.medium,
    },

    modalCenter: {
        alignItems: "center",
        paddingVertical: 38,
        gap: 10,
    },

    modalLoadingText: {
        color: "#6B7280",
        fontSize: 14,
        fontFamily: FONTS.regular,
        marginTop: 6,
    },

    modalErrorText: {
        color: "#EF4444",
        fontSize: 14,
        fontFamily: FONTS.regular,
        textAlign: "center",
        paddingHorizontal: 24,
    },

    modalEmptyText: {
        color: "#6B7280",
        fontSize: 14,
        fontFamily: FONTS.regular,
        textAlign: "center",
    },

    offerCard: {
        backgroundColor: "#ffffff",
        marginHorizontal: 16,
        marginTop: 14,
        borderRadius: 18,
        paddingVertical: 16,
        paddingHorizontal: 18,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 4,
    },

    offerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },

    offerRowLabel: {
        fontSize: 13,
        fontFamily: FONTS.regular,
        color: "#6B7280",
        flex: 1,
    },

    offerRowValue: {
        fontSize: 13,
        fontFamily: FONTS.medium,
        color: "#111827",
        flex: 1,
        textAlign: "right",
    },

    offerActionRow: {
        flexDirection: "row",
        gap: 8,
    },

    offerActionBtn: {
        flex: 1,
        backgroundColor: "#800000",
        borderRadius: 10,
        paddingVertical: 8,
        alignItems: "center",
        justifyContent: "center",
    },

    offerActionBtnOutline: {
        backgroundColor: "transparent",
        borderWidth: 1.5,
        borderColor: "#800000",
    },

    offerActionBtnGreen: {
        backgroundColor: "#16A34A",
    },

    offerActionText: {
        color: "#fff",
        fontSize: 11,
        fontFamily: FONTS.bold,
        textAlign: "center",
    },

    offerActionTextOutline: {
        color: "#800000",
    },

    // Payment dialog
    payOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 18,
        paddingHorizontal: 20,
    },

    payDialog: {
        backgroundColor: "#fff",
        borderRadius: 20,
        paddingVertical: 18,
        paddingHorizontal: 20,
        width: "100%",
        maxHeight: "88%",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },

    payDialogHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },

    payDialogTitle: {
        fontSize: 18,
        fontFamily: FONTS.bold,
        color: "#800000",
    },

    payFieldLabel: {
        fontSize: 12,
        fontFamily: FONTS.medium,
        color: "#6B7280",
        marginTop: 14,
        marginBottom: 3,
        textTransform: "uppercase",
        letterSpacing: 0.4,
    },

    payRequired: {
        color: "#EF4444",
    },

    payReadOnly: {
        backgroundColor: "#F3F4F6",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },

    payReadOnlyText: {
        fontSize: 14,
        color: "#374151",
        fontFamily: FONTS.medium,
    },

    payInput: {
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderWidth: 1.5,
        borderColor: "#E5E7EB",
        fontSize: 14,
        fontFamily: FONTS.regular,
        color: "#111827",
    },

    payResultBanner: {
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginTop: 14,
    },

    payResultSuccess: {
        backgroundColor: "#D1FAE5",
        borderWidth: 1,
        borderColor: "#6EE7B7",
    },

    payResultError: {
        backgroundColor: "#FEE2E2",
        borderWidth: 1,
        borderColor: "#FCA5A5",
    },

    payResultText: {
        fontSize: 13,
        fontFamily: FONTS.medium,
        color: "#111827",
        textAlign: "center",
    },

    paySubmitBtn: {
        backgroundColor: "#800000",
        borderRadius: 12,
        paddingVertical: 10,
        alignItems: "center",
        marginTop: 20,
        marginBottom: 6,
    },

    paySubmitBtnDisabled: {
        backgroundColor: "#D1D5DB",
    },

    paySubmitText: {
        color: "#fff",
        fontSize: 15,
        fontFamily: FONTS.bold,
        letterSpacing: 0.3,
    },

    payPickerTrigger: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderWidth: 1.5,
        borderColor: "#E5E7EB",
    },

    payPickerText: {
        fontSize: 14,
        color: "#111827",
        fontFamily: FONTS.medium,
    },

    payPickerIcon: {
        fontSize: 16,
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
