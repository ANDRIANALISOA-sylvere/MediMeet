import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text, Input, Button, Spinner } from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../../../api/axios";
import Toast from "react-native-toast-message";

interface Doctor {
  about: string;
  experience: string;
  location: string;
  price: string;
  specialty: string;
}

const ProfileDoctor: React.FC = () => {
  const [doctor, setDoctor] = useState<Doctor>({
    about: "",
    experience: "",
    location: "",
    price: "",
    specialty: "",
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingData, setFetchingData] = useState<boolean>(true);

  useEffect(() => {
    const getUserIdAndDoctorData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setUserId(user._id);
          await fetchDoctorData(user._id);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setFetchingData(false);
      }
    };

    getUserIdAndDoctorData();
  }, []);

  const fetchDoctorData = async (id: string) => {
    try {
      const response = await axios.get(`/doctor/${id}`);
      if (response.data && response.data.data) {
        const { about, experience, location, price, specialty } =
          response.data.data;
        setDoctor({
          about,
          experience: experience.toString(),
          location,
          price: price.toString(),
          specialty,
        });
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données du docteur:",
        error
      );
    }
  };

  const showToast = (type: any, text1: string, text2: string) => {
    Toast.show({
      type,
      position: "top",
      text1,
      text2,
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
    });
  };

  const handleSubmit = async () => {
    if (!userId) {
      console.error("ID utilisateur non disponible");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/doctor", {
        ...doctor,
        _id: userId,
      });
      showToast("success", "Succès", "Profil mis à jour avec succès 💯");
      console.log("Profil mis à jour avec succès:", response.data);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      showToast("error", "Erreur", "Échec de la mise à jour du profil");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <View style={styles.container}>
        <Spinner size="large" />
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.layout}>
          <Text style={styles.title}>Éditer votre profil</Text>

          <Input
            label="Spécialité"
            placeholder="Ex: Cardiologue"
            value={doctor.specialty}
            onChangeText={(text) => setDoctor({ ...doctor, specialty: text })}
            style={styles.input}
          />
          <Input
            label="Expérience (années)"
            placeholder="Ex: 2"
            keyboardType="numeric"
            value={doctor.experience}
            onChangeText={(text) => setDoctor({ ...doctor, experience: text })}
            style={styles.input}
          />
          <Input
            label="Prix (Ar)"
            placeholder="Ex: 2000"
            keyboardType="numeric"
            value={doctor.price}
            onChangeText={(text) => setDoctor({ ...doctor, price: text })}
            style={styles.input}
          />
          <Input
            label="Localisation"
            placeholder="Ex: Fianarantsoa"
            value={doctor.location}
            onChangeText={(text) => setDoctor({ ...doctor, location: text })}
            style={styles.input}
          />
          <Input
            label="À propos"
            placeholder="Décrivez votre pratique..."
            multiline={true}
            textStyle={{ minHeight: 64 }}
            value={doctor.about}
            onChangeText={(text) => setDoctor({ ...doctor, about: text })}
            style={styles.input}
          />

          <Button
            onPress={handleSubmit}
            status="success"
            disabled={loading}
          >
            {loading ? <Spinner size="small" /> : "Mettre à jour le profil"}
          </Button>
        </View>
      </ScrollView>
      <Toast />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#fff"
  },
  layout: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Poppins-Bold",
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
});

export default ProfileDoctor;
