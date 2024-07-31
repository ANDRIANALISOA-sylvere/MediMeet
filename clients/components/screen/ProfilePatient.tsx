import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { Text, Input, Button, Spinner } from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../../api/axios";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import { Icon } from "@ui-kitten/components";

interface Patient {
  dateOfBirth: string;
  gender: string;
  address: string;
  avatar: string | null;
}

const ProfilePatient: React.FC = () => {
  const [patient, setPatient] = useState<Patient>({
    dateOfBirth: "",
    gender: "",
    address: "",
    avatar: null,
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingData, setFetchingData] = useState<boolean>(true);

  useEffect(() => {
    const getUserIdAndPatientData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setUserId(user._id);
          await fetchPatientData(user._id);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setFetchingData(false);
      }
    };

    getUserIdAndPatientData();
  }, []);

  const fetchPatientData = async (id: string) => {
    try {
      const response = await axios.get(`/patient/${id}`);
      if (response.data && response.data.patient) {
        const { dateOfBirth, gender, address, avatar } = response.data.patient;
        setPatient({
          dateOfBirth,
          gender,
          address,
          avatar,
        });
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données du patient:",
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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPatient({ ...patient, avatar: result.assets[0].uri });
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
      console.error("ID utilisateur non disponible");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("_id", userId);
      formData.append("dateOfBirth", patient.dateOfBirth);
      formData.append("gender", patient.gender);
      formData.append("address", patient.address);

      if (patient.avatar) {
        const uriParts = patient.avatar.split(".");
        const fileType = uriParts[uriParts.length - 1];
        formData.append("avatar", {
          uri: patient.avatar,
          name: `avatar.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }

      const response = await axios.post("/patient", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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

          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            {patient.avatar ? (
              <Image source={{ uri: patient.avatar }} style={styles.avatar} />
            ) : (
              <>
                <Icon name="camera" width={40} height={40} fill="#888" />
                <Text style={styles.avatarText}>Ajouter un avatar</Text>
              </>
            )}
          </TouchableOpacity>

          <Input
            label="Date de naissance"
            placeholder="Ex: 1990-01-01"
            value={patient.dateOfBirth}
            onChangeText={(text) =>
              setPatient({ ...patient, dateOfBirth: text })
            }
            style={styles.input}
          />
          <Input
            label="Genre"
            placeholder="Ex: Homme / Femme"
            value={patient.gender}
            onChangeText={(text) => setPatient({ ...patient, gender: text })}
            style={styles.input}
          />
          <Input
            label="Adresse"
            placeholder="Ex: 123 Rue Principale, Ville"
            value={patient.address}
            onChangeText={(text) => setPatient({ ...patient, address: text })}
            style={styles.input}
          />

          <Button onPress={handleSubmit} status="success" disabled={loading}>
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
    backgroundColor: "#fff",
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
  avatarContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  avatarText: {
    marginTop: 10,
    color: "#888",
  },
});

export default ProfilePatient;
