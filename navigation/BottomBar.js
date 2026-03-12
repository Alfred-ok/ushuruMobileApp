// import React, { useRef, useState, useEffect } from "react";
// import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// export default function BottomBar({ state, navigation }) {
//     if (!state) return null; // prevent crash

//     const [width, setWidth] = useState(0);
//     const anim = useRef(new Animated.Value(0)).current;

//     const activeIndex = state.index;
//     const tabWidth = width / state.routes.length;

//     useEffect(() => {
//         Animated.spring(anim, {
//             toValue: activeIndex * tabWidth,
//             useNativeDriver: true,
//         }).start();
//     }, [activeIndex, width]);

//     return (
//         <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap }}>
//             <View
//                 style={styles.container}
//                 onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
//             >
//                 <Animated.View
//                     style={[
//                         styles.highlight,
//                         { width: tabWidth, transform: [{ translateX: anim }] },
//                     ]}
//                 />

//                 {state.routes.map((route, index) => {
//                     const isFocused = activeIndex === index;

//                     const icons = {
//                         HomeTab: "home-outline",
//                         Payments: "card-outline",
//                         Profile: "person-outline",
//                         AboutUs: "people-outline",
//                     };

//                     return (
//                         <TouchableOpacity
//                             key={route.key}
//                             style={styles.tab}
//                             onPress={() => navigation.navigate(route.name)}
//                         >
//                             <Ionicons
//                                 name={icons[route.name]}
//                                 size={22}
//                                 color={isFocused ? "#800020" : "#fff"}
//                             />
//                             <Text style={{ color: isFocused ? "#800020" : "#fff", fontSize: 12 }}>
//                                 {route.name === "HomeTab" ? "Home" : route.name}
//                             </Text>
//                         </TouchableOpacity>
//                     );
//                 })}
//             </View>
//             <View style={{ height: 45, backgroundColor: "#800020" }} />
//             {/* Extra space for iPhone home indicator */}
//         </View>
//         </View >
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flexDirection: "row",
//         backgroundColor: "#800020",
//         height: 105,
//         position: "absolute",
//         bottom: 0,
//         width: "100%",
//     },
//     tab: {
//         flex: 1,
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     highlight: {
//         position: "absolute",
//         height: "100%",
//         backgroundColor: "#fff",
//     },
// });



import React, { useRef, useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BottomBar({ state, navigation }) {
    if (!state) return null;

    const [width, setWidth] = useState(0);
    const anim = useRef(new Animated.Value(0)).current;

    const activeIndex = state.index;
    const tabWidth =
        width && state.routes.length ? width / state.routes.length : 0;

    useEffect(() => {
        if (tabWidth > 0) {
            Animated.spring(anim, {
                toValue: activeIndex * tabWidth,
                useNativeDriver: true,
            }).start();
        }
    }, [activeIndex, tabWidth]);

    const icons = {
        HomeTab: "home-outline",
        Payments: "card-outline",
        Profile: "person-outline",
        AboutUs: "people-outline",
    };

    return (
        <SafeAreaView style={styles.wrapper}>
            <View
                style={styles.container}
                onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
            >
                {tabWidth > 0 && (
                    <Animated.View
                        style={[
                            styles.highlight,
                            {
                                width: tabWidth,
                                transform: [{ translateX: anim }],
                            },
                        ]}
                    />
                )}

                {state.routes.map((route, index) => {
                    const isFocused = activeIndex === index;

                    return (
                        <TouchableOpacity
                            key={route.key}
                            style={styles.tab}
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate(route.name)}
                        >
                            <Ionicons
                                name={icons[route.name]}
                                size={22}
                                color={isFocused ? "#800020" : "#fff"}
                            />
                            <Text
                                style={[
                                    styles.label,
                                    { color: isFocused ? "#800020" : "#fff" },
                                ]}
                            >
                                {route.name === "Home" ? "Home" : route.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: "#800020",
        paddingBottom: 40,
        paddingHorizontal: 10,
        paddingTop: 5,
    },
    container: {
        flexDirection: "row",
        backgroundColor: "#800020",
        height: 65,
        borderRadius: 12,
    },
    tab: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    highlight: {
        position: "absolute",
        height: "100%",
        backgroundColor: "#fff",
        borderRadius: 12,
    },
    label: {
        fontSize: 12,
        marginTop: 4,
    },
});