import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Text, List, Spinner } from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../../../api/axios";

interface User {
  _id: string;
}

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

const Patient: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      if (!userString) {
        throw new Error("User data not found");
      }

      const user: User = JSON.parse(userString);
      const doctorId = user._id;

      const response = await axios.get(`/doctor/patients?doctorId=${doctorId}`);
      setPatients(response.data.patients);
      setError(null);
    } catch (err) {
      setError("Failed to fetch patients");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPatients();
  }, [fetchPatients]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderPatientItem = ({ item }: { item: Patient }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => toggleExpand(item._id._id)}>
        <Text style={styles.nameText}>{item._id.name}</Text>
      </TouchableOpacity>
      {expandedId === item._id._id && (
        <View style={styles.expandedContent}>
          <Text style={styles.infoText}>Email: {item._id.email}</Text>
          <Text style={styles.infoText}>
            Date de naissance: {new Date(item.dateOfBirth).toLocaleDateString()}
          </Text>
          <Text style={styles.infoText}>Genre: {item.gender}</Text>
          <Text style={styles.infoText}>Adresse: {item.address}</Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Spinner />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text status="danger">{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <List
        data={patients}
        renderItem={renderPatientItem}
        keyExtractor={(item) => item._id._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  nameText: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    textTransform: "capitalize",
  },
  expandedContent: {
    marginTop: 8,
    backgroundColor: "#fff",
  },
  infoText: {
    fontFamily: "Poppins",
    marginBottom: 4,
    padding: 10,
  },
});

export default Patient;
