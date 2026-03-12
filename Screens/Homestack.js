


import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./Homepage/Home";
import Land from "./Land/Land";
import ShareHolder from "./ShareHolder";
import Accounts from "./Accounts";
import FAQs from "./FAQs";
import UshuruMembershipInfo from "./Info/UshuruMembershipInfo";
import PlotListScreen from "./Land/PlotListScreen";
import PlotBookingScreen from "./Land/PlotBookingScreen";
import BookedPlots from "./BookedPlots/BookedPlots";

const Stack = createNativeStackNavigator();

export function HomeStackScreen() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Land" component={Land} />
            <Stack.Screen name="PlotListScreen" component={PlotListScreen} />
            <Stack.Screen name="PlotBookingScreen" component={PlotBookingScreen} />
            <Stack.Screen name="Booked" component={BookedPlots} />
            {/* <Stack.Screen name="Shares" component={ShareHolder} /> */}
            <Stack.Screen name="Accounts" component={Accounts} />
            <Stack.Screen name="FAQs" component={FAQs} />
            <Stack.Screen name="Info" component={UshuruMembershipInfo} />

        </Stack.Navigator>
    );
}





