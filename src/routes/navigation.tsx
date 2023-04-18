import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { COLORS as colors, fontFamily } from "../constants";
import navigationStrings from "../utils/navigationString";
import * as Screens from "../screens";

const Stack = createNativeStackNavigator();

const options: any = {
    headerTintColor: "#ffffff",
    headerStyle: {
        backgroundColor: colors.white,
        shadowColor: colors.white,
    },
    headerTitleStyle: {
        fontFamily: fontFamily.proximaMedium,
        textTransform: "capitalize",
    },
};


export default function MainStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={navigationStrings.CHATSCREEN}>
            <Stack.Screen
                name={navigationStrings.CHATSCREEN}
                component={Screens.ChatScreen}
                options={{
                    headerShown: false,
                    ...options,
                }}
            />
             <Stack.Screen
                name={navigationStrings.DETAILSCREEN}
                component={Screens.ChatSectionScreen}
                options={{
                    headerShown: false,
                    ...options,
                }}
            />
            <Stack.Screen
                name={navigationStrings.CONTACTSCREEN}
                component={Screens.ContactScreen}
                options={{
                    headerShown: false,
                    ...options,
                }}
            />
        </Stack.Navigator>
    );
}
