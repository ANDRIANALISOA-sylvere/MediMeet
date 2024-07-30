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
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { parseISO, isToday, isBefore, isFuture } from "date-fns";
import { toZonedTime, format } from "date-fns-tz";
import axios from "../../../api/axios";
import { Button, Icon } from "@ui-kitten/components";

interface User {
  _id: string;
  name: string;
}

interface Patient {
  _id: User;
  name: string;
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

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

  const handleAppointmentAction = async (action: "confirm" | "cancel") => {
    if (!selectedAppointment) return;

    try {
      let response;
      if (action === "confirm") {
        response = await axios.post(
          `/appointment/complete?id=${selectedAppointment._id}`
        );
      } else if (action === "cancel") {
        response = await axios.post(
          `/appointment/cancel?id=${selectedAppointment._id}`
        );
      }

      if (response && response.status === 200) {
        setModalVisible(false);
        await fetchAppointments();
      } else {
        console.error("La mise à jour du rendez-vous a échoué");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rendez-vous:", error);
    }
  };

  const filterButtons = [
    { label: "Tous", value: null },
    { label: "Terminé", value: "completed" },
    { label: "En attente", value: "pending" },
    { label: "Annulé", value: "cancelled" },
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return { text: "#34A853", background: "rgba(52, 168, 83, 0.1)" };
      case "cancelled":
        return { text: "#FF3B30", background: "rgba(255, 59, 48, 0.1)" };
      case "pending":
        return { text: "#FFA000", background: "rgba(255, 160, 0, 0.1)" };
      default:
        return { text: "#00BFA6", background: "rgba(0, 191, 166, 0.1)" };
    }
  };

  const renderAppointmentItem = ({ item }: { item: Appointment }) => {
    const utcDate = parseISO(item.appointmentDate);

    // Convertissez la date UTC en date locale
    const appointmentDate = toZonedTime(utcDate, "UTC");

    // Formatez la date et l'heure
    const formattedTime = format(appointmentDate, "HH:mm", { timeZone: "UTC" });
    const formattedDate = format(appointmentDate, "dd MMM yyyy", {
      timeZone: "UTC",
    });

    const getAppointmentStatus = () => {
      const now = new Date();
      if (isToday(appointmentDate)) return "Aujourd'hui";
      if (isBefore(appointmentDate, now)) return "Antérieur";
      if (isFuture(appointmentDate)) return "A venir";
      return "";
    };

    const getTranslatedStatus = (status: string) => {
      switch (status.toLowerCase()) {
        case "completed":
          return "Terminé";
        case "cancelled":
          return "Annulé";
        case "pending":
          return "En attente";
        default:
          return status;
      }
    };

    const statusColors = getStatusColor(item.status);

    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedAppointment(item);
          setModalVisible(true);
        }}
      >
        <View style={styles.appointmentItem}>
          <View style={styles.leftColumn}>
            <Image
              source={require("../../../assets/images/avatar4.jpg")}
              style={styles.avatar}
            />
          </View>
          <View style={styles.rightColumn}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.appointmentStatus}>
                {getAppointmentStatus()}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusColors.background },
                ]}
              >
                <Text style={[styles.statusText, { color: statusColors.text }]}>
                  {getTranslatedStatus(item.status)}
                </Text>
              </View>
            </View>
            <Text style={styles.appointmentDateTime}>
              {formattedDate} à {formattedTime}
            </Text>
            <Text style={styles.patientName}>{item.patientId.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setModalVisible(false)}
            >
              <Icon name="close-outline" fill="#000" style={styles.icon} />
            </TouchableOpacity>
            <View style={styles.iconContainer}>
              <Icon
                name="calendar-outline"
                fill="#00BFA6"
                style={styles.modalIcon}
              />
            </View>
            <Text style={styles.modalText}>Gestion du rendez-vous</Text>
            <Text style={styles.modalDescription}>
              Vous pouvez confirmer ou annuler ce rendez-vous. Veuillez choisir
              l'action appropriée.
            </Text>
            <View style={styles.modalButtons}>
              <Button
                status="success"
                size="small"
                onPress={() => handleAppointmentAction("confirm")}
              >
                Confirmer
              </Button>
              <Button
                status="danger"
                size="small"
                onPress={() => handleAppointmentAction("cancel")}
              >
                Annuler
              </Button>
            </View>
          </View>
        </View>
      </Modal>
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
    marginTop: 5,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
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
    borderRadius: 8,
    padding: 10,
    marginLeft: 10,
  },
  statusBadge: {
    alignSelf: "flex-start",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 5,
  },
  statusText: {
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonConfirm: {
    backgroundColor: "#00BFA6",
  },
  buttonCancel: {
    backgroundColor: "#FF3B30",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    marginTop: 20,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  closeButton: {
    marginTop: 20,
  },
  modalView: {
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: "relative",
    width: "80%",
  },
  closeIcon: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1,
  },
  icon: {
    width: 24,
    height: 24,
  },
  iconContainer: {
    backgroundColor: "rgba(0, 191, 166, 0.1)",
    borderRadius: 50,
    padding: 15,
    marginBottom: 20,
  },
  modalIcon: {
    width: 40,
    height: 40,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "Poppins-Bold",
    fontSize: 18,
  },
  modalDescription: {
    fontFamily: "Poppins",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
});

export default Appointment;
