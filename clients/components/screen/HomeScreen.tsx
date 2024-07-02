import React, { useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Icon } from "@ui-kitten/components";

function HomeScreen() {
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
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row" }}>
          <Image
            source={require("../../assets/images/avatar4.jpg")}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.greetingText}>Bonjour</Text>
            <Text style={styles.nameText}>Mr Joséphin</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Icon name="search-outline" style={styles.icon} />
          <Icon name="bell-outline" style={styles.icon} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    flexDirection: "column",
    marginLeft: 10,
  },
  greetingText: {
    fontSize: 15,
    color: "#000",
    fontFamily: "Poppins",
  },
  nameText: {
    fontSize: 18,
    color: "#000",
    fontFamily: "Poppins-Bold",
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default HomeScreen;
