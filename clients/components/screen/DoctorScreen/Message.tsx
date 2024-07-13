import React, { useState, useEffect } from "react";
import { Text, View, FlatList, StyleSheet, Image } from "react-native";
import axios from "../../../api/axios";
import { Input, Icon } from "@ui-kitten/components";
import io, { Socket } from "socket.io-client";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SOCKET_URL = "http://192.168.43.149:8800";

interface Patient {
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
  dateOfBirth: string;
  gender: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

function Message({ navigation }: any) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setUserId(user._id);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'userId:", error);
      }
    };

    fetchUserId();
    fetchPatients();
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get<{ patients: Patient[] }>("/patients");
      setPatients(response.data.patients);
      setLoading(false);
    } catch (err) {
      setError("Une erreur est survenue lors du chargement des patients");
      setLoading(false);
    }
  };

  const handlePatientPress = (patient: Patient) => {
    if (socket && userId) {
      const participantIds = [userId, patient._id._id].sort();
      const roomId = participantIds.join("_");

      socket.emit("join", roomId);

      navigation.navigate("MessageDetails", { patient, roomId });
    } else {
      console.error(
        "La connexion socket n'est pas établie ou l'userId n'est pas disponible"
      );
    }
  };

  const SearchIcon = (props: any) => <Icon {...props} name="search-outline" />;

  const renderPatientItem = ({ item }: { item: Patient }) => (
    <TouchableOpacity onPress={() => handlePatientPress(item)}>
      <View style={styles.patientItem}>
        <Image
          source={require("../../../assets/images/avatar4.jpg")}
          style={styles.avatar}
        />
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{item._id.name}</Text>
          <Text style={styles.patientDetails}>
            {item.gender}, {item.address}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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
          placeholder="Rechercher un patient..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          accessoryLeft={SearchIcon}
          style={styles.searchInput}
        />
      </View>
      <FlatList
        data={patients}
        renderItem={renderPatientItem}
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
  patientItem: {
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
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    textTransform: "capitalize",
    color: "#003366",
  },
  patientDetails: {
    fontSize: 14,
    opacity: 0.4,
    fontFamily: "Poppins",
    color: "#003366",
  },
  searchInput: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    borderColor: "#f0f0f0",
    borderRadius: 5,
  },
});

export default Message;
