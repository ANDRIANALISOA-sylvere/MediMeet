import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Divider, Icon } from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import axios from "../../api/axios";

interface User {
  _id: string;
  name: string;
}

interface Doctor {
  _id: User;
  specialty: string;
  experience: number;
  price: number;
  about: string;
  location: string;
  availability: Array<{ day: string; startTime: string }>;
}

interface Appointment {
  _id: string;
  patientId: string;
  doctorId: Doctor;
  appointmentDate: string;
  status: string;
}

function AppointmentScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, [activeFilter]);

  const fetchAppointments = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      if (!userString) {
        console.error("Utilisateur non connecté");
        return;
      }

      const user = JSON.parse(userString);
      const response = await axios.get<{ appointments: Appointment[] }>(
        `/appointment/patient?patientId=${user._id}${
          activeFilter ? `&status=${activeFilter}` : ""
        }`
      );

      setAppointments(response.data.appointments);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const filterButtons = [
    { label: "Tous", value: null },
    { label: "Terminé", value: "completed" },
    { label: "En attente", value: "pending" },
    { label: "Annulé", value: "canceled" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <Icon name="clock-outline" fill="#FFA500" style={styles.statusIcon} />
        );
      case "canceled":
        return (
          <Icon
            name="close-circle-outline"
            fill="#FF0000"
            style={styles.statusIcon}
          />
        );
      case "completed":
        return (
          <Icon
            name="checkmark-circle-outline"
            fill="#008000"
            style={styles.statusIcon}
          />
        );
      default:
        return (
          <Icon
            name="question-mark-circle-outline"
            fill="#808080"
            style={styles.statusIcon}
          />
        );
    }
  };

  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      {filterButtons.map((button) => (
        <TouchableOpacity
          key={button.label}
          style={[
            styles.filterButton,
            activeFilter === button.value && styles.activeFilterButton,
          ]}
          onPress={() => setActiveFilter(button.value)}
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
    appointmentDate.setHours(appointmentDate.getHours() - 3);
    return (
      <View>
        <View style={styles.appointmentItem}>
          <Image
            source={require("../../assets/images/avatar4.jpg")}
            style={styles.avatar}
          />
          <View style={styles.appointmentDetails}>
            <Text style={styles.doctorName}>Dr {item.doctorId._id.name}</Text>
            <Text style={styles.specialty}>{item.doctorId.specialty}</Text>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>
                {format(appointmentDate, "dd-MM-yyyy HH:mm")}
              </Text>
            </View>
          </View>
          <View style={styles.statusContainer}>
            {getStatusIcon(item.status)}
          </View>
        </View>
        <Divider />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderFilterButtons()}
      <FlatList
        data={appointments}
        renderItem={renderAppointmentItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  doctorName: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
  },
  specialty: {
    fontFamily: "Poppins",
    fontSize: 14,
    opacity: 0.3,
    color: "gray",
    marginBottom: 5,
  },
  badgeContainer: {
    backgroundColor: "#e6fffa",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: "#000",
    fontFamily: "Poppins",
    fontSize: 12,
  },
  appointmentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  appointmentDetails: {
    flex: 1,
    marginLeft: 15,
  },
  statusContainer: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  statusIcon: {
    width: 24,
    height: 24,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  filterButton: {
    paddingVertical: 5,
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
});

export default AppointmentScreen;
