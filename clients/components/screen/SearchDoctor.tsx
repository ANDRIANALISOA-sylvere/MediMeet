import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { Icon, Button, Input } from "@ui-kitten/components";
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

interface Specialty {
  specialty: string;
  count: number;
}

function SearchDoctor({ navigation }: any) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get<{ data: Doctor[] }>("/doctors", {
        params: { name: searchTerm, specialty: selectedSpecialty },
      });
      setDoctors(response.data.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des médecins:", error);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const response = await axios.get<{ data: Specialty[] }>(
        "/doctors/specialties"
      );
      setSpecialties(response.data.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des spécialités:", error);
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [searchTerm, selectedSpecialty]);

  const searchIcon = (props: any) => <Icon {...props} name="search-outline" />;

  const handleDoctorPress = (doctor: Doctor) => {
    navigation.navigate("DoctorDetails", { doctor });
  };

  const handleSpecialtyPress = (specialty: string) => {
    setSelectedSpecialty(selectedSpecialty === specialty ? "" : specialty);
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Rechercher un médecin"
        value={searchTerm}
        onChangeText={setSearchTerm}
        accessoryLeft={searchIcon}
        style={styles.searchInput}
        status={isFocused ? "success" : "basic"}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <FlatList
        horizontal
        data={specialties}
        keyExtractor={(item) => item.specialty}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.specialtyBadge,
              selectedSpecialty === item.specialty &&
                styles.selectedSpecialtyBadge,
            ]}
            onPress={() => handleSpecialtyPress(item.specialty)}
          >
            <Text
              style={[
                styles.specialtyText,
                selectedSpecialty === item.specialty && { color: "#fff" },
              ]}
            >
              {item.specialty}
            </Text>
          </TouchableOpacity>
        )}
        style={styles.specialtyList}
        contentContainerStyle={{ alignItems: "center" }}
        showsHorizontalScrollIndicator={false}
      />
      <ScrollView style={styles.doctorList}>
        {doctors.map((doctor: Doctor) => (
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
                  <Icon name="star" style={styles.starIcon} fill="orange" />
                  <Text style={styles.ratingText}>
                    {doctor.averageRating !== null &&
                    doctor.averageRating !== undefined
                      ? `${doctor.averageRating.toFixed(1)} (${
                          doctor.reviewCount
                        })`
                      : "0"}
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
    color: "#003366",
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
  buttonText: {
    color: "#fff",
    fontFamily: "Poppins",
  },
  searchInput: {
    margin: 10,
    borderRadius: 5,
  },
  specialtyList: {
    marginBottom: 10,
    maxHeight: 40,
    marginLeft: 5,
  },
  specialtyBadge: {
    borderColor: "#00BFA6",
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginHorizontal: 3,
    marginVertical: 2,
  },
  selectedSpecialtyBadge: {
    backgroundColor: "#00BFA6",
  },
  specialtyText: {
    color: "#00BFA6",
    fontSize: 12,
    fontFamily: "Poppins",
  },
});

export default SearchDoctor;
