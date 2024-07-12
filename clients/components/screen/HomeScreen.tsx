import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Icon, Button } from "@ui-kitten/components";
import axios from "../../api/axios";

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  experience: number;
  price: number;
  about: string;
  location: string;
  availability: {
    day: string;
    startTime: string;
    endTime: string;
  };
  averageRating: number;
  reviewCount: number;
}

function HomeScreen({ navigation }: any) {
  const [popularDoctors, setPopularDoctors] = useState<Doctor[]>([]);

  const fetchPopularDoctors = async () => {
    try {
      const response = await axios.get<{ data: Doctor[] }>("/doctor/popular");
      setPopularDoctors(response.data.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des médecins populaires:",
        error
      );
    }
  };

  useEffect(() => {
    fetchPopularDoctors();
  }, []);

  const handleDoctorPress = (doctor: Doctor) => {
    navigation.navigate("DoctorDetails", { doctor });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row" }}>
          <Image
            source={require("../../assets/images/avatar4.jpg")}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.greetingText}>Bonjour</Text>
            <Text style={styles.nameText}>Mr Joséphin</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Icon name="search-outline" style={styles.icon} fill="#000" />
          <Icon name="bell-outline" style={styles.icon} fill="#000" />
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.leftColumn}>
          <Text style={styles.searchText}>Vous cherchez le médecin</Text>
          <Text style={styles.searchText}>souhaité ?</Text>
          <Button
            style={styles.searchButton}
            appearance="outline"
            accessoryLeft={(props) => <Icon {...props} name="search" />}
            status="basic"
            size="small"
          >
            <Text style={styles.buttonText}>chercher maintenat ...</Text>
          </Button>
        </View>
        <Image
          source={require("../../assets/images/istockphoto-1500500690-170667a-removebg-preview.png")}
          style={styles.rightImage}
        />
      </View>

      <View style={styles.populaire}>
        <Text style={{ fontFamily: "Poppins-Bold", color: "#003366" }}>
          Médecin populaire
        </Text>
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          <Text
            style={{ opacity: 0.3, fontFamily: "Poppins", color: "#003366" }}
          >
            Voir tous
          </Text>
          <Icon
            name="arrow-ios-forward-outline"
            style={[styles.icon, { opacity: 0.3 }]}
          />
        </View>
      </View>

      <ScrollView style={styles.doctorList}>
        {popularDoctors.map((doctor: Doctor) => (
          <View key={doctor._id} style={styles.doctorContainer}>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => handleDoctorPress(doctor)}
            >
              <Image
                source={require("../../assets/images/docteur.webp")}
                style={styles.doctorAvatar}
              />
              <View style={styles.doctorTextContainer}>
                <Text style={styles.doctorName}>Dr. {doctor.name}</Text>
                <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                <View style={styles.ratingContainer}>
                  <Icon name="star" style={styles.starIcon} fill="#FFD700" />
                  <Text style={styles.ratingText}>
                    {doctor.averageRating.toFixed(1)} ({doctor.reviewCount})
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.rightColumn}>
              <View style={styles.feesContainer}>
                <Text style={styles.feesLabel}>Frais</Text>
                <Text style={styles.feesValue}>Ar {doctor.price}</Text>
              </View>
              <Button
                style={styles.appointmentButton}
                onPress={() => handleDoctorPress(doctor)}
                size="small"
              >
                <Text style={styles.buttonText}>Rendez-vous</Text>
              </Button>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    flexDirection: "column",
    marginLeft: 10,
  },
  greetingText: {
    fontSize: 15,
    color: "#003366",
    fontFamily: "Poppins",
  },
  nameText: {
    fontSize: 18,
    color: "#003366",
    fontFamily: "Poppins-Bold",
    textTransform: "capitalize",
  },
  icon: {
    width: 24,
    height: 24,
    color: "#003366",
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#00BFA6",
    padding: 12,
    margin: 10,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    position: "relative",
  },
  leftColumn: {
    flex: 1,
  },
  searchText: {
    fontSize: 12,
    color: "#fff",
    fontFamily: "Poppins",
  },
  searchButton: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderColor: "#fff",
    width: "50%",
  },
  buttonText: {
    color: "#000",
    fontFamily: "Poppins",
  },
  rightImage: {
    position: "absolute",
    bottom: -3,
    right: 30,
    width: 80,
    height: 100,
    resizeMode: "contain",
  },
  populaire: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  doctorList: {
    flex: 1,
  },
  doctorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(224, 224, 224, 0.3)",
  },
  doctorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  doctorTextContainer: {
    marginLeft: 10,
  },
  doctorName: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    textTransform: "capitalize",
    color: "#003366",
  },
  doctorSpecialty: {
    fontSize: 14,
    opacity: 0.4,
    fontFamily: "Poppins",
    color:"#003366"
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  starIcon: {
    width: 16,
    height: 16,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: "Poppins",
    marginLeft: 5,
  },
  rightColumn: {
    alignItems: "flex-end",
  },
  feesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  feesLabel: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#003366",
  },
  feesValue: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#00BFA6",
    marginLeft: 5,
  },
  appointmentButton: {
    marginTop: 5,
    backgroundColor: "#00BFA6",
    borderColor: "#00BFA6",
    paddingHorizontal: 10,
  },
});

export default HomeScreen;
