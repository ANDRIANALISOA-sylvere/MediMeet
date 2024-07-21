import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Image,
  RefreshControl,
} from "react-native";
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
  };
  dateOfBirth: string;
  gender: string;
  address: string;
}

interface User {
  _id: string;
}

function Message({ navigation }: any) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      if (!userString) {
        throw new Error("User data not found");
      }

      const user: User = JSON.parse(userString);
      setUserId(user._id);

      const response = await axios.get(`/doctor/patients?doctorId=${user._id}`);
      setPatients(response.data.patients);
      setError("");
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      setError("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

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
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={patients}
          renderItem={renderPatientItem}
          keyExtractor={(item) => item._id._id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#003366"]}
            />
          }
          ListEmptyComponent={
            <Text style={styles.noPatients}>Aucun patient trouvé.</Text>
          }
        />
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontFamily: "Poppins",
    fontSize: 16,
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    fontFamily: "Poppins",
    fontSize: 16,
    color: "red",
  },
  noPatients: {
    textAlign: "center",
    marginTop: 20,
    fontFamily: "Poppins",
    fontSize: 16,
    color: "#666",
  },
});

export default Message;
