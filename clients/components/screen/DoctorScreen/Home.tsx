import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../../../api/axios";
import { Layout, Card, Text, Icon } from "@ui-kitten/components";
import AppointmentStats from "./AppointmentStats";
import { LineChart } from "react-native-chart-kit";

const PersonIcon = (props: any) => <Icon {...props} name="person-outline" />;
const StarIcon = (props: any) => <Icon {...props} name="star-outline" />;

function Home() {
  const [patientCount, setPatientCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [patientData, setPatientData] = useState([0, 0, 0]);

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

      const patients = patientResponse.data.patients;
      const now = new Date();
      const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
      const twoMonthsAgo = new Date(now.setMonth(now.getMonth() + 1));
      const oneMonthAgo = new Date(now.setMonth(now.getMonth() + 1));

      const patientCounts = [0, 0, 0];
      patients.forEach((patient: any) => {
        const createdAt = new Date(patient.createdAt);
        if (createdAt >= twoMonthsAgo && createdAt < oneMonthAgo) {
          patientCounts[0]++;
        } else if (createdAt >= oneMonthAgo && createdAt < now) {
          patientCounts[1]++;
        } else if (createdAt >= now) {
          patientCounts[2]++;
        }
      });
      setPatientData(patientCounts);

      const doctorResponse = await axios.get(`/doctor/${doctorId}`);
      const { averageRating, reviewCount } = doctorResponse.data.data;
      setAverageRating(averageRating || 0);
      setReviewCount(reviewCount || 0);
    } catch (error) {
      console.error("Failed to fetch doctor data:", error);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDoctorData().then(() => setRefreshing(false));
  }, []);

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => "#003366",
    strokeWidth: 2,
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#00BFA6",
    },
    propsForBackgroundLines: {
      stroke: "#fff",
    },
  };

  const data = {
    labels: ["Il y a 2 mois", "Le mois dernier", "Ce mois-ci"],
    datasets: [
      {
        data: patientData,
        color: (opacity = 1) => "#00BFA6",
        strokeWidth: 2,
      },
    ],
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
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
      <AppointmentStats refreshing={refreshing} />
      {/* <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Patients par mois</Text>
        <LineChart
          data={data}
          width={Dimensions.get("window").width - 50}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  chartCard: {
    marginTop: 16,
    padding: 16,
  },
  chartTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    marginBottom: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default Home;
