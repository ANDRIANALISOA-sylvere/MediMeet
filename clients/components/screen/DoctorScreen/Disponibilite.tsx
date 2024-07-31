import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../../..//api/axios";
import { Button, Datepicker, Input, Layout } from "@ui-kitten/components";
import Toast from "react-native-toast-message";

interface Availability {
  day: string;
  startTime: string;
}

const Disponibilite = () => {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDate, setNewDate] = useState(new Date());
  const [newTime, setNewTime] = useState("");

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

  const showToast = (type: any, text1: any, text2: any) => {
    Toast.show({
      type: type,
      position: "top",
      text1: text1,
      text2: text2,
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
    });
  };

  const addAvailability = async () => {
    if (!newDate || !newTime) {
      Alert.alert("Erreur", "Veuillez sélectionner une date et une heure");
      return;
    }

    // Validation simple du format de l'heure
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(newTime)) {
      Alert.alert("Erreur", "Veuillez entrer l'heure au format HH:MM");
      return;
    }

    try {
      const userString = await AsyncStorage.getItem("user");
      if (!userString) {
        setError("Utilisateur non trouvé");
        return;
      }

      const user = JSON.parse(userString);
      const doctorId = user._id;

      const formattedDate = `${newDate.getFullYear()}/${String(
        newDate.getMonth() + 1
      ).padStart(2, "0")}/${String(newDate.getDate()).padStart(2, "0")}`;

      const newAvailability = {
        day: formattedDate,
        startTime: newTime,
      };

      const response = await axios.post(
        `/doctor/${doctorId}/availability`,
        newAvailability
      );

      setAvailabilities([...availabilities, newAvailability]);
      setNewDate(new Date());
      setNewTime("");
      setShowAddForm(false);
      showToast("success", "Succès", "Nouvelle disponibilité ajoutée" + " 💯");
    } catch (err) {
      console.error("Erreur lors de l'ajout de la disponibilité:", err);
      Alert.alert("Erreur", "Une erreur est survenue lors de l'ajout");
    }
  };

  const renderAvailabilityItem = ({ item }: { item: Availability }) => (
    <View style={styles.availabilityItem}>
      <Text style={styles.dayLabel}>Jour :</Text>
      <View style={styles.dateBadge}>
        <Text style={styles.dateBadgeText}>{formatDate(item.day)}</Text>
      </View>
      <Text style={styles.timeLabel}>Heure de début :</Text>
      <View style={styles.timeBadge}>
        <Text style={styles.timeBadgeText}>{item.startTime}</Text>
      </View>
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
    <>
      <View style={styles.container}>
        <FlatList
          data={availabilities}
          renderItem={renderAvailabilityItem}
          keyExtractor={(item, index) => `${item.day}-${index}`}
          ListEmptyComponent={<Text>Aucune disponibilité trouvée</Text>}
        />

        {!showAddForm ? (
          <Button style={styles.addButton} onPress={() => setShowAddForm(true)}>
            Ajouter une disponibilité
          </Button>
        ) : (
          <Layout style={styles.formContainer}>
            <Datepicker
              date={newDate}
              onSelect={(nextDate) => setNewDate(nextDate)}
              style={styles.input}
              placeholder="Sélectionnez une date"
            />
            <Input
              style={styles.input}
              placeholder="Heure de début (HH:MM)"
              value={newTime}
              onChangeText={setNewTime}
            />
            <Button style={styles.submitButton} onPress={addAvailability}>
              Ajouter
            </Button>
          </Layout>
        )}
      </View>
      <Toast />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  availabilityItem: {
    backgroundColor: "#003366",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  dayLabel: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 5,
    fontFamily: "Poppins-Bold",
  },
  dateBadge: {
    backgroundColor: "#E3F2FD",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  dateBadgeText: {
    color: "#2196F3",
    fontWeight: "bold",
  },
  timeLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "#fff",
    marginBottom: 5,
  },
  timeBadge: {
    backgroundColor: "#E8F5E9",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
  },
  timeBadgeText: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  addButton: {
    marginTop: 20,
  },
  formContainer: {
    marginTop: 20,
  },
  input: {
    marginBottom: 10,
  },
  submitButton: {
    marginTop: 10,
  },
});

export default Disponibilite;
