import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Icon } from "@ui-kitten/components";

function DoctorDetails({ route }: any) {
  const { doctor } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/docteur.webp')}
          style={styles.avatar}
        />
        <View style={styles.headerText}>
          <Text style={styles.name}>Dr {doctor.name}</Text>
          <Text style={styles.specialty}>{doctor.specialty}</Text>
          <View style={styles.rating}>
            <Icon
              name="star"
              fill="#FFD700"
              style={styles.starIcon}
            />
            <Text style={styles.ratingText}>
              {doctor.averageRating.toFixed(1)} ({doctor.reviewCount})
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.aboutTitle}>À propos</Text>
      <Text style={styles.about}>{doctor.about}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  headerText: {
    marginLeft: 20,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
  specialty: {
    opacity: 0.3,
    marginTop: 5,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  starIcon: {
    width: 20,
    height: 20,
  },
  ratingText: {
    marginLeft: 5,
    opacity: 0.3,
  },
  aboutTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
  },
  about: {
    textAlign: 'justify',
    opacity: 0.3,
    fontFamily:'Poppins'
  },
});

export default DoctorDetails;
