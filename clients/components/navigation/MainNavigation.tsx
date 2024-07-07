import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Icon } from "@ui-kitten/components";
import { View, StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

import HomeScreen from "../screen/HomeScreen";
import AppointmentScreen from "../screen/AppointmentScreen";
import ChatScreen from "../screen/ChatScreen";
import NotificationScreen from "../screen/NotificationScreen";
import AccountScreen from "../screen/AccountScreen";
import DoctorDetails from "../screen/DoctorDetails";

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DoctorDetails"
        component={DoctorDetails}
        options={{ title: "Détails du médecin" }}
      />
    </Stack.Navigator>
  );
}

function MainNavigation() {
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
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: "#00BFA6",
        tabBarStyle: { paddingVertical: 10 },
        tabBarLabelStyle: { fontSize: 10, paddingVertical: 5 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
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
        name="Chat"
        component={ChatScreen}
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
        name="Appointments"
        component={AppointmentScreen}
        options={{
          tabBarLabel: () => null,
          headerShown: false,
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
        name="Notifications"
        component={NotificationScreen}
        options={{
          tabBarLabel: "Notifications",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Icon
              name={focused ? "bell" : "bell-outline"}
              fill={color}
              style={{ width: size, height: size }}
            />
          ),
          tabBarBadge: 3,
        }}
      />
      <Tab.Screen
        name="Account"
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

export default MainNavigation;
