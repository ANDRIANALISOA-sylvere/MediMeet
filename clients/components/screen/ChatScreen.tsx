import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import axios from "../../api/axios";
import { Divider, Input, Icon } from "@ui-kitten/components";

interface Doctor {
  _id: {
    _id: string;
    name: string;
    email: string;
    role: string;
    phone: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
  specialty: string;
  experience: number;
  price: number;
  about: string;
  location: string;
  availability: Array<{
    day: string;
    startTime: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

function ChatScreen() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get<{ doctors: Doctor[] }>("/doctors");
      setDoctors(response.data.doctors);
      setLoading(false);
    } catch (err) {
      setError("Une erreur est survenue lors du chargement des docteurs");
      setLoading(false);
    }
  };

  const SearchIcon = (props: any) => <Icon {...props} name="search-outline" />;

  const renderDoctorItem = ({ item }: { item: Doctor }) => (
    <View style={styles.doctorItem}>
      <Image
        source={require("../../assets/images/docteur.webp")}
        style={styles.avatar}
      />
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>Dr. {item._id.name}</Text>
        <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
      </View>
    </View>
  );

  if (loading) {
    return <Text>Chargement...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={{ padding: 10 }}>
        <Text style={styles.header}>Messages</Text>
        <Input
          placeholder="Rechercher un docteur..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          accessoryLeft={SearchIcon}
          style={styles.searchInput}
        />
      </View>
      <FlatList
        data={doctors}
        renderItem={renderDoctorItem}
        keyExtractor={(item) => item._id._id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: "Poppins-Bold",
  },
  doctorItem: {
    flexDirection: "row",
    padding: 10,
    marginBottom: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    textTransform: "capitalize",
    color: "#003366",
  },
  doctorSpecialty: {
    fontSize: 14,
    opacity: 0.4,
    fontFamily: "Poppins",
    color: "#003366",
  },
  doctorLocation: {
    fontSize: 12,
    color: "#999",
  },
  searchInput: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    borderColor: "#f0f0f0",
    borderRadius: 5,
  },
});
export default ChatScreen;
