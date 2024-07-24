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
import ChatDetailsScreen from "../screen/DoctorScreen/ChatDetailsScreen";
import SearchDoctor from "../screen/SearchDoctor";

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function TabNavigation() {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        initialRouteName="Home"
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
          name="Home"
          component={HomeStack}
          options={{
            title: "Acceuil",
            headerShown: false,
            tabBarLabel: "Acceuil",
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
          name="Chat"
          component={ChatScreen}
          options={{
            title: "Messages",
            headerShown: false,
            tabBarLabel: "Messages",
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
          name="Appointments"
          component={AppointmentScreen}
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
          name="Notifications"
          component={NotificationScreen}
          options={{
            title: "Notifications",
            headerShown: false,
            tabBarLabel: "Notifications",
            tabBarLabelStyle: {
              fontFamily: "Poppins",
              fontSize: 10,
            },
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
            title: "Compte",
            headerShown: false,
            tabBarLabel: "Compte",
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
    </View>
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
    <Stack.Navigator>
      <Stack.Screen
        name="TabNavigation"
        component={TabNavigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DoctorDetails"
        component={DoctorDetails}
        options={{
          headerShown: true,
          title: "Détails du médecin",
          headerTitleStyle: {
            fontFamily: "Poppins-Bold",
            color: "#003366",
          },
        }}
      />
      <Stack.Screen
        name="ChatDetails"
        component={ChatDetailsScreen}
        options={{
          headerShown: true,
          title: "Messages",
          headerTitleStyle: {
            fontFamily: "Poppins-Bold",
            color: "#003366",
          },
        }}
      />
      <Stack.Screen
        name="SearchDoctor"
        component={SearchDoctor}
        options={{
          headerShown: true,
          title: "Chercher un médecin",
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
  container: {
    flex: 1,
    backgroundColor: "white",
  },
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

export default MainNavigation;
