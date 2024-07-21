import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, StyleSheet, RefreshControl } from "react-native";
import { Text, Card, List, ListItem, Spinner } from "@ui-kitten/components";
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

  const renderPatientItem = ({ item }: { item: Patient }) => (
    <Card style={{ margin: 8 }}>
      <Text style={{ fontFamily: "Poppins-Bold" }}>{item._id.name}</Text>
      <Text style={styles.fond}>Email: {item._id.email}</Text>
      <Text style={styles.fond}>
        Date de naissance: {new Date(item.dateOfBirth).toLocaleDateString()}
      </Text>
      <Text style={styles.fond}>Genre: {item.gender}</Text>
      <Text style={styles.fond}>Adresse: {item.address}</Text>
    </Card>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Spinner />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text status="danger">{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
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
  fond: {
    fontFamily: "Poppins",
  },
});

export default Patient;