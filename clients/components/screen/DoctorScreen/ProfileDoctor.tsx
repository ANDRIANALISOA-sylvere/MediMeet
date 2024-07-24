import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Layout, Text, Input, Button, Spinner } from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../../../api/axios";
import Toast from "react-native-toast-message";

interface Doctor {
  specialty: string;
  experience: string;
  price: string;
  location: string;
  about: string;
}

const ProfileDoctor: React.FC = () => {
  const [doctor, setDoctor] = useState<Doctor>({
    specialty: "",
    experience: "",
    price: "",
    location: "",
    about: "",
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setUserId(user._id);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'ID utilisateur:",
          error
        );
      }
    };

    getUserId();
  }, []);

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
      showToast("success", "Succès", "Profil créé avec succès" + " 💯");
      console.log("Profil créé avec succès:", response.data);
    } catch (error) {
      console.error("Erreur lors de la création du profil:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.layout}>
          <Text style={styles.title}>Editer votre profile</Text>

          <Input
            label="Spécialité"
            placeholder="Ex: Dentiste"
            value={doctor.specialty}
            onChangeText={(text) => setDoctor({ ...doctor, specialty: text })}
            style={styles.input}
            appearance="default"
          />
          <Input
            label="Expérience (années)"
            placeholder="Ex: 2"
            keyboardType="numeric"
            value={doctor.experience.toString()}
            onChangeText={(text) => setDoctor({ ...doctor, experience: text })}
            style={styles.input}
          />
          <Input
            label="Prix (Ar)"
            placeholder="Ex: 2000"
            keyboardType="numeric"
            value={doctor.price.toString()}
            onChangeText={(text) => setDoctor({ ...doctor, price: text })}
            style={styles.input}
          />
          <Input
            label="Localisation"
            placeholder="Ex: Antananarivo"
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
            style={styles.button}
            disabled={loading}
          >
            {loading ? <Spinner size="small" /> : "Editer le profil"}
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
