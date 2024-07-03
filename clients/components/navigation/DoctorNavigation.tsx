import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "@ui-kitten/components";
import { View, StyleSheet } from "react-native";

const Tab = createBottomTabNavigator();

import HomeScreen from "../screen/DoctorScreen/Home";
import MessagesScreen from "../screen/DoctorScreen/Message";
import AppointmentsScreen from "../screen/DoctorScreen/Appointment";
import PatientsScreen from "../screen/DoctorScreen/Patient";
import AccountScreen from "../screen/DoctorScreen/Account";

function DoctorNavigation() {
    return (
        <Tab.Navigator
            initialRouteName="Accueil"
            screenOptions={{
                tabBarActiveTintColor: "#00BFA6",
                tabBarStyle: { paddingVertical: 10 },
                tabBarLabelStyle: { fontSize: 10, paddingVertical: 5 },
            }}
        >
            <Tab.Screen
                name="Accueil"
                component={HomeScreen}
                options={{
                    tabBarLabel: "Accueil",
                    headerShown: false,
                    tabBarIcon: ({ color, size, focused }) => (
                        <Icon
                            name={focused ? "home" : "home-outline"}
                            fill={color}
                            style={{ width: size, height: size }}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Patients"
                component={PatientsScreen}
                options={{
                    tabBarLabel: "Patients",
                    headerShown: true,
                    title: "Mes patients",
                    headerTitleStyle: {
                        fontFamily: "Poppins",
                    },
                    tabBarIcon: ({ color, size, focused }) => (
                        <Icon
                            name={focused ? "people" : "people-outline"}
                            fill={color}
                            style={{ width: size, height: size }}
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="RendezVous"
                component={AppointmentsScreen}
                options={{
                    tabBarLabel: () => null,
                    headerShown: true,
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={[
                                styles.ctaButton,
                                {
                                    backgroundColor: focused ? "#00BFA6" : "white",
                                    borderColor: focused ? "#00BFA6" : "rgba(224, 224, 224, 0)",
                                    borderWidth: 1,
                                },
                            ]}
                        >
                            <Icon
                                name={focused ? "calendar" : "calendar-outline"}
                                fill={focused ? "white" : "#8e8e8e"}
                                style={styles.appointmentIcon}
                            />
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Messages"
                component={MessagesScreen}
                options={{
                    tabBarLabel: "Messages",
                    headerShown: false,
                    tabBarIcon: ({ color, size, focused }) => (
                        <Icon
                            name={focused ? "message-square" : "message-square-outline"}
                            fill={color}
                            style={{ width: size, height: size }}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Compte"
                component={AccountScreen}
                options={{
                    tabBarLabel: "Compte",
                    headerShown: false,
                    tabBarIcon: ({ color, size, focused }) => (
                        <Icon
                            name={focused ? "person" : "person-outline"}
                            fill={color}
                            style={{ width: size, height: size }}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    ctaButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 50,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 2,
        elevation: 1,
    },
    appointmentIcon: {
        width: 40,
        height: 40,
    },
});

export default DoctorNavigation;
