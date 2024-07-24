import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Layout, ProgressBar } from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../../../api/axios";

type AppointmentStatus = "pending" | "cancelled" | "completed";

type StatsType = {
  [key in AppointmentStatus]: { count: number; percentage: string };
};

const statusTranslations: { [key in AppointmentStatus]: string } = {
  pending: "En attente",
  cancelled: "Annulés",
  completed: "Terminés",
};

interface AppointmentStatsProps {
  refreshing: boolean;
}

const AppointmentStats: React.FC<AppointmentStatsProps> = ({ refreshing }) => {
  const [stats, setStats] = useState<StatsType>({
    pending: { count: 0, percentage: "0" },
    cancelled: { count: 0, percentage: "0" },
    completed: { count: 0, percentage: "0" },
  });

  const fetchStats = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      if (!userString) {
        throw new Error("User data not found");
      }
      const user = JSON.parse(userString);
      const doctorId = user._id;

      const response = await axios.get(
        `/appointments/stats?doctorId=${doctorId}`
      );
      setStats(response.data.stats);
    } catch (error) {
      console.error("Failed to fetch appointment stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (refreshing) {
      fetchStats();
    }
  }, [refreshing]);

  const renderProgressBar = (status: AppointmentStatus, color: string) => (
    <View style={styles.card}>
      <Text style={styles.statusText}>{statusTranslations[status]}</Text>
      <ProgressBar
        style={styles.progress}
        status={color}
        progress={parseFloat(stats[status].percentage) / 100}
        animating={true}
        size="giant"
      />
      <View style={styles.statsRow}>
        <Text style={{ fontFamily: "Poppins" }}>
          {stats[status].count} rendez-vous
        </Text>
        <Text style={{ fontFamily: "Poppins" }}>
          {stats[status].percentage}%
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderProgressBar("pending", "warning")}
      {renderProgressBar("cancelled", "danger")}
      {renderProgressBar("completed", "success")}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    padding: 10,
  },
  statusText: {
    marginBottom: 8,
    fontFamily: "Poppins-Bold",
  },
  progress: {
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default AppointmentStats;
