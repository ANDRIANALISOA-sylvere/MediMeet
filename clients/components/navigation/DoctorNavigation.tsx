import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Icon } from "@ui-kitten/components";
import { View, StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

import HomeScreen from "../screen/DoctorScreen/Home";
import MessagesScreen from "../screen/DoctorScreen/Message";
import AppointmentsScreen from "../screen/DoctorScreen/Appointment";
import PatientsScreen from "../screen/DoctorScreen/Patient";
import AccountScreen from "../screen/DoctorScreen/Account";
import MessageDetails from "../screen/DoctorScreen/MessageDetails";

function DoctorNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="Accueil"
      screenOptions={{
        tabBarActiveTintColor: "#00BFA6",
        tabBarInactiveTintColor: "white",
        tabBarStyle: {
          backgroundColor: "#003366",
          paddingBottom: 10,
          paddingTop: 10,
          height: 70,
        },
      }}
    >
      <Tab.Screen
        name="Accueil"
        component={HomeScreen}
        options={{
          tabBarLabel: "Accueil",
          headerShown: false,
          tabBarLabelStyle: {
            fontFamily: "Poppins",
            fontSize: 10,
          },
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
          tabBarLabelStyle: {
            fontFamily: "Poppins",
            fontSize: 10,
          },
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
          title: "Rendez-vous",
          headerShown: false,
          tabBarLabel: "Rendez-vous",
          tabBarLabelStyle: {
            fontFamily: "Poppins",
            fontSize: 10,
          },
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.ctaButton}>
              <Icon
                name={focused ? "calendar" : "calendar-outline"}
                fill={color}
                style={{ width: size, height: size }}
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
          tabBarLabelStyle: {
            fontFamily: "Poppins",
            fontSize: 10,
          },
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
          headerShown: true,
          title: "Mon compte",
          tabBarLabelStyle: {
            fontFamily: "Poppins",
            fontSize: 10,
          },
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

function DoctorMainNavigation() {
  const [loaded, error] = useFonts({
    Poppins: require("../../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DoctorTabNavigation"
        component={DoctorNavigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MessageDetails"
        component={MessageDetails}
        options={{
          headerShown: true,
          title: "Messages",
          headerTitleStyle: {
            fontFamily: "Poppins-Bold",
            color: "#003366",
          },
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  ctaButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
  appointmentIcon: {
    width: 40,
    height: 40,
  },
});

export default DoctorMainNavigation;
