import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScree from "expo-splash-screen";

function SplashScreen() {
  const [loaded, error] = useFonts({
    "Poppins": require("../../assets/fonts/Poppins-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScree.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>Bienvenue sur</Text>
        <Text style={styles.welcomeText}>MediMeet</Text>
      </View>
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
