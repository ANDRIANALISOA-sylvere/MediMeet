import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../../../api/axios";
import { Layout, Card, Text, Icon } from "@ui-kitten/components";
import AppointmentStats from "./AppointmentStats";

const PersonIcon = (props: any) => <Icon {...props} name="person-outline" />;
const StarIcon = (props: any) => <Icon {...props} name="star-outline" />;

function Home() {
  const [patientCount, setPatientCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (!userString) {
          throw new Error("User data not found");
        }

        const user = JSON.parse(userString);
        const doctorId = user._id;

        const patientResponse = await axios.get(
          `/doctor/patients?doctorId=${doctorId}`
        );
        setPatientCount(patientResponse.data.count);

        const doctorResponse = await axios.get(`/doctor/${doctorId}`);
        const { averageRating, reviewCount } = doctorResponse.data.data;
        setAverageRating(averageRating || 0);
        setReviewCount(reviewCount || 0);
      } catch (error) {
        console.error("Failed to fetch doctor data:", error);
      }
    };

    fetchDoctorData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Card style={[styles.card, styles.blueCard]}>
          <PersonIcon style={styles.icon} fill="#3366FF" />
          <Text style={styles.cardTitle}>Patients</Text>
          <Text style={styles.cardValue}>{patientCount}</Text>
        </Card>
        <Card style={[styles.card, styles.yellowCard]}>
          <StarIcon style={styles.icon} fill="#FFD700" />
          <Text style={styles.cardTitle}>Notes</Text>
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <Text style={styles.cardValue}>{averageRating.toFixed(1)}</Text>
            <Text category="s1" appearance="hint">
              ({reviewCount} avis)
            </Text>
          </View>
        </Card>
      </View>
      <AppointmentStats></AppointmentStats>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    margin: 8,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  blueCard: {
    backgroundColor: "#E6F3FF",
  },
  yellowCard: {
    backgroundColor: "#FFF9E6",
  },
  icon: {
    width: 32,
    height: 32,
    marginBottom: 8,
  },
  cardTitle: {
    marginBottom: 4,
    fontFamily: "Poppins-Bold",
  },
  cardValue: {
    fontFamily: "Poppins-Bold",
    fontSize: 30,
  },
});

export default Home;
