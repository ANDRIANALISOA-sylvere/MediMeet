import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format, isBefore, isToday, isFuture } from "date-fns";
import axios from "../../../api/axios";

interface User {
  _id: string;
  name: string;
}

interface Patient {
  _id: User;
  // Ajoutez d'autres propriétés du patient si nécessaire
}

interface Appointment {
  _id: string;
  patientId: Patient;
  doctorId: string;
  appointmentDate: string;
  status: string;
}

function Appointment() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [activeFilter]);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const userString = await AsyncStorage.getItem("user");
      if (!userString) {
        console.error("Utilisateur non connecté");
        return;
      }

      const user = JSON.parse(userString);
      const response = await axios.get<{ appointments: Appointment[] }>(
        `/appointment/doctor?doctorId=${user._id}${
          activeFilter ? `&status=${activeFilter}` : ""
        }`
      );

      setAppointments(response.data.appointments);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchAppointments().then(() => setRefreshing(false));
  }, [activeFilter]);

  const handleFilterChange = (newFilter: string | null) => {
    setActiveFilter(newFilter);
    setAppointments([]);
  };

  const filterButtons = [
    { label: "Tous", value: null },
    { label: "Terminé", value: "completed" },
    { label: "En attente", value: "pending" },
    { label: "Annulé", value: "canceled" },
  ];

  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      {filterButtons.map((button) => (
        <TouchableOpacity
          key={button.label}
          style={[
            styles.filterButton,
            activeFilter === button.value && styles.activeFilterButton,
          ]}
          onPress={() => handleFilterChange(button.value)}
        >
          <Text
            style={[
              styles.filterButtonText,
              activeFilter === button.value && styles.activeFilterButtonText,
            ]}
          >
            {button.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderAppointmentItem = ({ item }: { item: Appointment }) => {
    const appointmentDate = new Date(item.appointmentDate);
    const formattedTime = format(appointmentDate, "HH:mm");
    const formattedDate = format(appointmentDate, "dd MMM yyyy");

    const getAppointmentStatus = () => {
      if (isToday(appointmentDate)) return "Aujourd'hui";
      if (isBefore(appointmentDate, new Date())) return "Antérieur";
      if (isFuture(appointmentDate)) return "A venir";
      return "";
    };

    const getTranslatedStatus = (status: string) => {
      switch (status.toLowerCase()) {
        case "completed":
          return "Terminé";
        case "canceled":
          return "Annulé";
        case "pending":
          return "En attente";
        default:
          return status;
      }
    };

    return (
      <View style={styles.appointmentItem}>
        <View style={styles.leftColumn}>
          <Image
            source={require("../../assets/images/avatar4.jpg")}
            style={styles.avatar}
          />
        </View>
        <View style={styles.rightColumn}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {getTranslatedStatus(item.status)}
            </Text>
          </View>
          <Text style={styles.appointmentStatus}>{getAppointmentStatus()}</Text>
          <Text style={styles.appointmentDateTime}>
            {formattedDate} à {formattedTime}
          </Text>
          <Text style={styles.patientName}>{item.patientId._id.name}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderFilterButtons()}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00BFA6" />
        </View>
      ) : (
        <FlatList
          data={appointments}
          renderItem={renderAppointmentItem}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  filterButton: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    backgroundColor: "#D3D3D3",
  },
  activeFilterButton: {
    backgroundColor: "#00BFA6",
    borderColor: "#00BFA6",
  },
  filterButtonText: {
    color: "#4A4A4A",
    fontFamily: "Poppins",
  },
  activeFilterButtonText: {
    color: "white",
  },
  appointmentItem: {
    flexDirection: "row",
    marginBottom: 15,
    marginTop: 10,
  },
  leftColumn: {
    width: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  rightColumn: {
    flex: 1,
    backgroundColor: "#E6F4EA",
    borderRadius: 8,
    padding: 10,
    marginLeft: 10,
  },
  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#00BFA6",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 1,
    marginBottom: 5,
  },
  statusText: {
    color: "white",
    fontFamily: "Poppins-Bold",
    fontSize: 12,
  },
  appointmentStatus: {
    color: "#003366",
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    marginBottom: 5,
  },
  appointmentDateTime: {
    fontFamily: "Poppins",
    fontSize: 14,
    color: "#4A4A4A",
    marginBottom: 5,
  },
  patientName: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: "#003366",
  },
});

export default Appointment;