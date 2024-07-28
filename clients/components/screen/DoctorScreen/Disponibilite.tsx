import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../../../api/axios";

interface Availability {
  day: string;
  startTime: string;
}

const Disponibilite = () => {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAvailabilities();
  }, []);

  const fetchAvailabilities = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      if (!userString) {
        setError("Utilisateur non trouvé");
        setLoading(false);
        return;
      }

      const user = JSON.parse(userString);
      const doctorId = user._id;

      const response = await axios.get(`/doctor/${doctorId}/availability`);
      setAvailabilities(response.data.availability);
      setLoading(false);
    } catch (err) {
      console.error("Erreur lors de la récupération des disponibilités:", err);
      setError("Erreur lors du chargement des disponibilités");
      setLoading(false);
    }
  };

  const renderAvailabilityItem = ({ item }: { item: Availability }) => (
    <View style={styles.availabilityItem}>
      <Text style={styles.dayText}>{formatDate(item.day)}</Text>
      <Text style={styles.timeText}>{item.startTime}</Text>
    </View>
  );

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("/");
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return <Text>Chargement des disponibilités...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={availabilities}
        renderItem={renderAvailabilityItem}
        keyExtractor={(item, index) => `${item.day}-${index}`}
        ListEmptyComponent={<Text>Aucune disponibilité trouvée</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    fontFamily: "Poppins-Bold",
  },
  availabilityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  dayText: {
    fontSize: 16,
    fontFamily: "Poppins",
  },
  timeText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
});

export default Disponibilite;
