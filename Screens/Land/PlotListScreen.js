import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Modal,
    Image,
    ActivityIndicator,
    Dimensions,
    Pressable,
    Animated,
    Easing,
} from "react-native";
import ImageZoom from "react-native-image-pan-zoom";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FONTS } from "../../constants/fonts";

const { width, height } = Dimensions.get("window");

const PlotListScreen = ({ route, navigation }) => {
    const { landCode } = route.params || {};

    const [landData, setLandData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [surveyModalVisible, setSurveyModalVisible] = useState(false);

    // Pulse animation for floating button
    const pulseScale = useRef(new Animated.Value(1)).current;
    const pulseOpacity = useRef(new Animated.Value(0.7)).current;

    useEffect(() => {
        fetchLandWithPlots();
        startPulse();
    }, []);

    const startPulse = () => {
        Animated.loop(
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(pulseScale, {
                        toValue: 1.18,
                        duration: 700,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseOpacity, {
                        toValue: 1,
                        duration: 700,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.parallel([
                    Animated.timing(pulseScale, {
                        toValue: 1,
                        duration: 700,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseOpacity, {
                        toValue: 0.7,
                        duration: 700,
                        useNativeDriver: true,
                    }),
                ]),
            ])
        ).start();
    };

    const fetchLandWithPlots = async () => {
        try {
            const response = await fetch(
                `http://88.99.215.90:8001/api/get-land-with-plots/?land_code=${landCode}`
            );
            const json = await response.json();
            setLandData(json);
        } catch (err) {
            setError("Failed to load land data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPlot = (plot) => {
        const status = plot.status ?? plot.plot_status;
        if (status !== "Available") return;
        navigation.navigate("PlotBookingScreen", {
            landCode: landData.land_code ?? landData.landCode ?? landCode,
            plotCode: plot.plot_code ?? plot.plotCode,
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Available":
                return "#16a34a";
            case "Booked":
                return "#dc2626";
            case "Acquired":
                return "#6b21a8";
            default:
                return "#6b7280";
        }
    };

    const getStatusBg = (status) => {
        switch (status) {
            case "Available":
                return "#dcfce7";
            case "Booked":
                return "#fee2e2";
            case "Acquired":
                return "#f3e8ff";
            default:
                return "#f3f4f6";
        }
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#14213d" />
                <Text style={styles.loaderText}>Loading plots…</Text>
            </View>
        );
    }

    if (error || !landData) {
        return (
            <View style={styles.loaderContainer}>
                <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#dc2626" />
                <Text style={styles.errorText}>{error || "No data available."}</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={fetchLandWithPlots}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const description = landData.description;
    const region = landData.region;
    const availableArea = landData.available_area ?? landData.availableArea;
    const totalArea = landData.total_area ?? landData.totalArea;
    const titleDeed = landData.title_deed_no ?? landData.titleDeed;
    const plots = landData.plots ?? [];
    const surveyPicture = landData.survey_picture ?? landData.surveyPicture;
    const surveyImageUri = surveyPicture ? `data:image/jpeg;base64,${surveyPicture}` : null;

    const renderPlotItem = ({ item }) => {
        const plotCode = item.plot_code ?? item.plotCode;
        const area = item.area;
        const status = item.status ?? item.plot_status;
        const memberPrice = item.member_price ?? item.memberPrice;
        const isAvailable = status === "Available";

        return (
            <TouchableOpacity
                style={[
                    styles.plotTile,
                    {
                        borderColor: getStatusColor(status),
                        backgroundColor: getStatusBg(status),
                        opacity: isAvailable ? 1 : 0.75,
                    },
                ]}
                onPress={() => handleSelectPlot(item)}
                activeOpacity={isAvailable ? 0.75 : 1}
            >
                <Text style={[styles.plotCode, { color: getStatusColor(status) }]}>
                    {plotCode}
                </Text>
                <Text style={styles.plotArea}>{area} ac</Text>
                {memberPrice ? (
                    <Text style={styles.plotPrice}>
                        KES {Number(memberPrice).toLocaleString()}
                    </Text>
                ) : null}
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
                    <Text style={styles.statusBadgeText}>{status}</Text>
                </View>
                {isAvailable && (
                    <MaterialCommunityIcons
                        name="cursor-pointer"
                        size={14}
                        color="#16a34a"
                        style={{ marginTop: 2 }}
                    />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <MaterialCommunityIcons name="arrow-left" size={26} color="#fff" />
                </TouchableOpacity>
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.headerTitle}>{description}</Text>
                    <Text style={styles.headerSub}>
                        {region}  ·  {availableArea} ac available
                    </Text>
                </View>
            </View>

            {/* Info strip */}
            <View style={styles.infoStrip}>
                <View style={styles.infoChip}>
                    <MaterialCommunityIcons name="ruler-square" size={14} color="#fca311" />
                    <Text style={styles.infoChipText}>Total: {totalArea} ac</Text>
                </View>
                <View style={styles.infoChip}>
                    <MaterialCommunityIcons name="file-document-outline" size={14} color="#fca311" />
                    <Text style={styles.infoChipText}>{titleDeed}</Text>
                </View>
                <View style={styles.infoChip}>
                    <MaterialCommunityIcons name="map-marker" size={14} color="#fca311" />
                    <Text style={styles.infoChipText}>{landCode}</Text>
                </View>
            </View>

            {/* Legend */}
            <View style={styles.legend}>
                {["Available", "Booked", "Acquired"].map((s) => (
                    <View key={s} style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: getStatusColor(s) }]} />
                        <Text style={styles.legendText}>{s}</Text>
                    </View>
                ))}
            </View>

            {/* Plots grid */}
            {plots.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="map-search-outline" size={56} color="#ccc" />
                    <Text style={styles.emptyText}>No plots found for this land parcel.</Text>
                </View>
            ) : (
                <FlatList
                    data={plots}
                    keyExtractor={(item, idx) =>
                        String(item.plot_code ?? item.plotCode ?? idx)
                    }
                    numColumns={3}
                    contentContainerStyle={styles.plotGrid}
                    renderItem={renderPlotItem}
                />
            )}

            {/* Floating survey map button */}
            {surveyImageUri && (
                <Animated.View
                    style={[
                        styles.floatingBtn,
                        {
                            transform: [{ scale: pulseScale }],
                            opacity: pulseOpacity,
                        },
                    ]}
                >
                    <TouchableOpacity
                        onPress={() => setSurveyModalVisible(true)}
                        style={styles.floatingBtnInner}
                        activeOpacity={0.85}
                    >
                        <MaterialCommunityIcons name="map-search" size={26} color="#fff" />
                    </TouchableOpacity>
                </Animated.View>
            )}

            {/* Survey Picture Modal */}
            <Modal
                visible={surveyModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setSurveyModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    {/* Backdrop: only tap here dismisses */}
                    <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={() => setSurveyModalVisible(false)}
                    />
                    {/* Content: pinch/pan handled here, no dismiss */}
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.closeBtn}
                            onPress={() => setSurveyModalVisible(false)}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <MaterialCommunityIcons
                                name="close-circle"
                                size={34}
                                color="#fff"
                            />
                        </TouchableOpacity>

                        <Text style={styles.modalTitle}>Survey Map</Text>

                        <View style={styles.imageZoomContainer}>
                            <ImageZoom
                                cropWidth={width * 0.9}
                                cropHeight={height * 0.55}
                                imageWidth={width}
                                imageHeight={height * 0.7}
                                pinchToZoom
                                panToMove
                                minScale={1}
                                maxScale={5}
                            >
                                <Image
                                    source={{ uri: surveyImageUri }}
                                    style={styles.surveyImage}
                                    resizeMode="contain"
                                />
                            </ImageZoom>
                        </View>

                        <Text style={styles.zoomHint}>
                            Pinch to zoom · Tap outside to dismiss
                        </Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default PlotListScreen;

/* ============================================================
   STYLES
   ============================================================ */
const TILE_SIZE = (width - 48) / 3;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f6f8",
    },

    /* ---- Header ---- */
    header: {
        paddingTop: 48,
        paddingHorizontal: 18,
        paddingBottom: 16,
        backgroundColor: "#14213d",
        flexDirection: "row",
        alignItems: "center",
    },
    backBtn: {
        paddingVertical: 2,
        paddingHorizontal: 4,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 17,
        fontFamily: FONTS.bold,
    },
    headerSub: {
        color: "#ccc",
        fontSize: 12,
        fontFamily: FONTS.regular,
        marginTop: 0,
    },

    /* ---- Info strip ---- */
    infoStrip: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 14,
        paddingVertical: 8,
        backgroundColor: "#1e2d4f",
        gap: 8,
    },
    infoChip: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 2,
        gap: 4,
    },
    infoChipText: {
        color: "#e2e8f0",
        fontSize: 11,
        fontFamily: FONTS.medium,
    },

    /* ---- Legend ---- */
    legend: {
        flexDirection: "row",
        justifyContent: "center",
        paddingVertical: 6,
        gap: 16,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendText: {
        fontSize: 12,
        color: "#374151",
        fontFamily: FONTS.medium,
    },

    /* ---- Plot grid ---- */
    plotGrid: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        paddingBottom: 98,
    },
    plotTile: {
        width: TILE_SIZE,
        margin: 4,
        borderRadius: 10,
        borderWidth: 1.5,
        paddingVertical: 6,
        paddingHorizontal: 8,
        alignItems: "center",
    },
    plotCode: {
        fontSize: 12,
        fontFamily: FONTS.bold,
        textAlign: "center",
    },
    plotArea: {
        fontSize: 10,
        fontFamily: FONTS.regular,
        color: "#6b7280",
        marginTop: 2,
    },
    plotPrice: {
        fontSize: 9,
        fontFamily: FONTS.regular,
        color: "#374151",
        marginTop: 2,
        textAlign: "center",
    },
    statusBadge: {
        marginTop: 3,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
    },
    statusBadgeText: {
        color: "#fff",
        fontSize: 9,
        fontFamily: FONTS.bold,
    },

    /* ---- Empty / Loader / Error ---- */
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
    },
    loaderText: {
        color: "#555",
        marginTop: 6,
        fontFamily: FONTS.regular,
    },
    errorText: {
        color: "#dc2626",
        textAlign: "center",
        marginHorizontal: 30,
        fontFamily: FONTS.regular,
    },
    retryBtn: {
        backgroundColor: "#14213d",
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 8,
    },
    retryText: {
        color: "#fff",
        fontFamily: FONTS.bold,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        marginTop: 58,
    },
    emptyText: {
        color: "#9ca3af",
        fontSize: 14,
        fontFamily: FONTS.regular,
        textAlign: "center",
    },

    /* ---- Floating button ---- */
    floatingBtn: {
        position: "absolute",
        bottom: 30,
        right: 24,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,
        borderRadius: 30,
    },
    floatingBtnInner: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: "#fca311",
        justifyContent: "center",
        alignItems: "center",
    },

    /* ---- Survey Modal ---- */
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.88)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: width * 0.94,
        height: height * 0.70,
        backgroundColor: "#111827",
        borderRadius: 18,
        overflow: "hidden",
        alignItems: "center",
        paddingTop: 12,
        paddingBottom: 10,
        zIndex: 1,
    },
    closeBtn: {
        position: "absolute",
        top: 10,
        right: 12,
        zIndex: 10,
    },
    modalTitle: {
        color: "#fca311",
        fontFamily: FONTS.bold,
        fontSize: 15,
        marginBottom: 6,
        letterSpacing: 0.5,
    },
    imageZoomContainer: {
        width: width * 0.9,
        height: height * 0.55,
        overflow: "hidden",
    },
    surveyImage: {
        width: width,
        height: height * 0.7,
    },
    zoomHint: {
        color: "#6b7280",
        fontSize: 11,
        fontFamily: FONTS.regular,
        marginTop: 6,
        letterSpacing: 0.3,
    },
});
