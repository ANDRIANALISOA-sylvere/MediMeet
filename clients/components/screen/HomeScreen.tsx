import React, { useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Icon, Button } from "@ui-kitten/components";

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
          <Icon name="search-outline" style={styles.icon} fill="#000" />
          <Icon name="bell-outline" style={styles.icon} fill="#000" />
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.leftColumn}>
          <Text style={styles.searchText}>Vous cherchez le médecin</Text>
          <Text style={styles.searchText}>souhaité ?</Text>
          <Button
            style={styles.searchButton}
            appearance="outline"
            status="basic"
            size="small"
          >
            <Text style={styles.buttonText}>chercher ici ...</Text>
          </Button>
        </View>
        <Image
          source={require("../../assets/images/istockphoto-1500500690-170667a-removebg-preview.png")}
          style={styles.rightImage}
        />
      </View>

      <View style={styles.populaire}>
        <Text style={{ fontFamily: "Poppins-Bold" }}>Médecin populaire</Text>
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          <Text style={{ opacity: 0.3, fontFamily: "Poppins" }}>Voir tous</Text>
          <Icon
            name="arrow-ios-forward-outline"
            style={[styles.icon, { opacity: 0.3 }]}
          />
        </View>
      </View>

      <View style={styles.doctorContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../../assets/images/docteur.webp")}
            style={styles.doctorAvatar}
          />
          <View style={styles.doctorTextContainer}>
            <Text style={styles.doctorName}>Sandra</Text>
            <Text style={styles.doctorSpecialty}>Dentiste</Text>
            <View style={styles.ratingContainer}>
              <Icon name="star" style={styles.starIcon} fill="#FFD700" />
              <Text style={styles.ratingText}>4 (2000)</Text>
            </View>
          </View>
        </View>
        <View style={styles.rightColumn}>
          <View style={styles.feesContainer}>
            <Text style={styles.feesLabel}>Frais</Text>
            <Text style={styles.feesValue}>Ar 5000</Text>
          </View>
          <Button style={styles.appointmentButton} size="small">
            <Text style={styles.buttonText}>Rendez-vous</Text>
          </Button>
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
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#00BFA6",
    padding: 12,
    margin: 10,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    position: "relative",
  },
  leftColumn: {
    flex: 1,
  },
  searchText: {
    fontSize: 12,
    color: "#fff",
    fontFamily: "Poppins",
  },
  searchButton: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderColor: "#fff",
    width: "50%",
  },
  buttonText: {
    color: "#000",
    fontFamily: "Poppins",
  },
  rightImage: {
    position: "absolute",
    bottom: -3,
    right: 30,
    width: 80,
    height: 100,
    resizeMode: "contain",
  },
  populaire: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  doctorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(224, 224, 224, 0.3)",
  },
  doctorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  doctorTextContainer: {
    marginLeft: 10,
  },
  doctorName: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
  doctorSpecialty: {
    fontSize: 14,
    opacity: 0.4,
    fontFamily: "Poppins",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  starIcon: {
    width: 16,
    height: 16,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: "Poppins",
    marginLeft: 5,
  },
  rightColumn: {
    alignItems: "flex-end",
  },
  feesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  feesLabel: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#000",
  },
  feesValue: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#00BFA6",
    marginLeft: 5,
  },
  appointmentButton: {
    marginTop: 5,
    backgroundColor: "#00BFA6",
    borderColor: "#00BFA6",
    paddingHorizontal: 10,
  },
});

export default HomeScreen;
