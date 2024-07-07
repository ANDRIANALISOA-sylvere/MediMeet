import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Icon, Button } from "@ui-kitten/components";

function DoctorDetails({ route }: any) {
  const { doctor } = route.params;

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", gap: 20 }}>
        <Image
          source={require("../../assets/images/docteur.webp")}
          style={styles.doctorAvatar}
        />
        <View>
          <Text style={styles.name}>{doctor.name}</Text>
          <Text style={styles.specialty}>{doctor.specialty}</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" style={styles.starIcon} fill="#FFD700" />
            <Text style={{ fontFamily: "Poppins", opacity: 0.3, fontSize: 15 }}>
              {doctor.averageRating.toFixed(1)} ({doctor.reviewCount}){" "}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  doctorAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontFamily: "Poppins-Bold",
    fontSize: 28,
  },
  specialty: {
    fontFamily: "Poppins",
    opacity: 0.3,
    fontSize: 15,
  },
  starIcon: {
    width: 16,
    height: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});

export default DoctorDetails;
