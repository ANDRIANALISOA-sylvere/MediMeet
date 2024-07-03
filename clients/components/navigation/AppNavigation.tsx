import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../screen/SplashScreen";
import LoginScreen from "../screen/Auth/LoginScreen";
import MainNavigation from "./MainNavigation";
import RegisterScreen from "../screen/Auth/RegisterScreen";
import DoctorNavigation from "./DoctorNavigation";

const Stack = createStackNavigator();

const AppNavigation = () => {
    return (
        <>
            <Stack.Navigator initialRouteName="Splash">
                <Stack.Screen
                    name="Splash"
                    component={SplashScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="MainNavigation"
                    component={MainNavigation}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="DoctorNavigation"
                    component={DoctorNavigation}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </>
    );
};

export default AppNavigation;
