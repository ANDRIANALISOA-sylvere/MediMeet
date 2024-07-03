import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScree from "expo-splash-screen";
import { useFonts } from "expo-font";

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "Patient" | "Docteur";
  phone: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

function SplashScreen({ navigation }: any) {
  const [loaded, error] = useFonts({
    Poppins: require("../../assets/fonts/Poppins-Regular.ttf"),
  });

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      const userString = await AsyncStorage.getItem("user");

      if (token && userString) {
        const user: User = JSON.parse(userString);
        setTimeout(() => {
          if (user.role === 'Patient') {
            navigation.navigate('MainNavigation');
          } else if (user.role === 'Docteur') {
            navigation.navigate('DoctorNavigation');
          }
        }, 4000);
      } else {
        setTimeout(() => {
          navigation.navigate('Login');
        }, 4000);
      }
    };

    SplashScree.preventAutoHideAsync().catch(() => { });
    checkToken();
  }, []);

  if (!loaded || error) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>Bienvenue sur</Text>
        <Text style={styles.welcomeText}>MediMeet</Text>
      </View>
      <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
      <Image
        source={require("../../assets/images/doctor.png")}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00BFA6",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  textContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    marginTop: 50,
  },
  welcomeText: {
    fontSize: 36,
    color: "#fff",
    fontFamily: "Poppins",
  },
  image: {
    width: 300,
    height: 362,
    marginBottom: 30,
  },
});

export default SplashScreen;
