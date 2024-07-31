import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Image,
} from "react-native";
import { Text, List, Spinner, Icon } from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../../../api/axios";
import DefaultAvatar from "../DefaultAvatar";

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
  avatar: string;
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

  const renderPatientItem = ({ item }: { item: Patient }) => {
    const isExpanded = expandedId === item._id._id;
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          onPress={() => toggleExpand(item._id._id)}
          style={styles.headerContainer}
        >
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          ) : (
            <View style={{ marginRight: 10 }}>
              <DefaultAvatar name={item._id.name} width={50} height={50} />
            </View>
          )}
          <Text style={styles.nameText}>{item._id.name}</Text>
          <Icon
            name={isExpanded ? "arrow-up" : "arrow-down"}
            fill="#BDBDBD"
            style={styles.icon}
          />
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.expandedContent}>
            <Text style={styles.infoText}>Email: {item._id.email}</Text>
            <Text style={styles.infoText}>
              Date de naissance:{" "}
              {new Date(item.dateOfBirth).toLocaleDateString()}
            </Text>
            <Text style={styles.infoText}>Genre: {item.gender}</Text>
            <Text style={styles.infoText}>Adresse: {item.address}</Text>
          </View>
        )}
      </View>
    );
  };

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
    backgroundColor: "#f0f0f0",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#BDBDBD",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.01,
    shadowRadius: 1,
    elevation: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  nameText: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    textTransform: "capitalize",
    flex: 1,
  },
  expandedContent: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  infoText: {
    fontFamily: "Poppins",
    marginBottom: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default Patient;
