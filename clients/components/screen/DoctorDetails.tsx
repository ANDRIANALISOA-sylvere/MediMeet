import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
} from "react-native";
import { Icon, Button } from "@ui-kitten/components";
import {
  format,
  parse,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";
import axios from "../../api/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReviewList from "./ReviewList";
import Toast from "react-native-toast-message";

const CommentInput = ({ value, onChangeText }: any) => {
  const [localComment, setLocalComment] = useState(value);

  return (
    <TextInput
      style={styles.commentInput}
      placeholder="Écrivez votre commentaire ici"
      value={localComment}
      onChangeText={setLocalComment}
      onEndEditing={() => onChangeText(localComment)}
      multiline
    />
  );
};

function DoctorDetails({ route }: any) {
  const { doctor } = route.params;
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    updateAvailableDates(selectedMonth);
    fetchReviews();
  }, [selectedMonth]);

  const showToast = (type: any, text1: any, text2: any) => {
    Toast.show({
      type: type,
      position: "top",
      text1: text1,
      text2: text2,
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
    });
  };

  const handleAddReview = async () => {
    if (newRating === 0 || newComment.trim() === "") {
      showToast(
        "error",
        "Erreur",
        "Veuillez donner une note et écrire un commentaire " + " ❌"
      );
      return;
    }

    const userString = await AsyncStorage.getItem("user");
    if (!userString) {
      Alert.alert("Erreur", "Utilisateur non connecté");
      return;
    }

    const user = JSON.parse(userString);
    const patientId = user._id;

    try {
      const response = await axios.post("/review", {
        doctorId: doctor._id,
        patientId,
        rating: newRating,
        comment: newComment,
      });

      if (response.data.success) {
        showToast(
          "success",
          "Succès",
          "L'avis a été ajouté avec succès" + " 💯"
        );
        setNewRating(0);
        setNewComment("");
        fetchReviews();
      } else {
        showToast(
          "error",
          "Erreur",
          "Impossible d'ajouter votre avis. Veuillez réessayer " + " ❌"
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'avis:", error);
      Alert.alert(
        "Erreur",
        "Une erreur s'est produite. Veuillez réessayer plus tard."
      );
    }
  };

  const updateAvailableDates = (month: Date) => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const daysInMonth = eachDayOfInterval({ start, end });

    const availableDatesInMonth = daysInMonth
      .filter((date) =>
        doctor.availability.some((avail: any) => {
          const availDate = parse(avail.day, "yyyy/MM/dd", new Date());
          return format(date, "yyyy/MM/dd") === format(availDate, "yyyy/MM/dd");
        })
      )
      .map((date) => format(date, "yyyy/MM/dd"));

    setAvailableDates(availableDatesInMonth);
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/reviews?doctorId=${doctor._id}`);
      setReviews(response.data.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleMonthChange = (increment: number) => {
    setSelectedMonth((prevMonth) => {
      const newMonth = new Date(
        prevMonth.setMonth(prevMonth.getMonth() + increment)
      );
      return newMonth;
    });
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const availableTimes = selectedDate
    ? doctor.availability
        .filter((avail: any) => avail.day === selectedDate)
        .map((avail: any) => avail.startTime)
    : [];

  const sendAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      console.error("Date ou heure non sélectionnée");
      return;
    }

    const userString = await AsyncStorage.getItem("user");
    if (!userString) {
      throw new Error("Utilisateur non connecté");
    }

    const user = JSON.parse(userString);
    const patientId = user._id;

    if (!patientId) {
      throw new Error("ID du patient non trouvé");
    }

    const appointmentDate = `${selectedDate} ${selectedTime}`;

    const appointmentData = {
      patientId: patientId,
      doctorId: doctor._id,
      appointmentDate: appointmentDate,
    };

    try {
      const response = await axios.post("/appointment", appointmentData);
      const result = await response.data;
      showToast(
        "success",
        "Succès",
        "Le rendez-vous a été envoyé avec succès" + " 💯"
      );
      setSelectedDate(null);
      console.log("Rendez-vous envoyé avec succès:", result);
    } catch (error) {
      console.error("Erreur lors de l'envoi du rendez-vous:", error);
    }
  };

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/avatar4.jpg")}
          style={styles.avatar}
        />
        <View style={styles.headerText}>
          <Text style={styles.name}>Dr {doctor.name}</Text>
          <Text style={styles.specialty}>{doctor.specialty}</Text>
          <View style={styles.rating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon
                key={star}
                name={
                  star <= Math.round(doctor.averageRating)
                    ? "star"
                    : "star-outline"
                }
                fill={
                  star <= Math.round(doctor.averageRating) ? "orange" : "gray"
                }
                style={styles.starIcon}
              />
            ))}
            <Text style={styles.ratingText}>
              {doctor.averageRating.toFixed(1)} ({doctor.reviewCount})
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.badgeContainer}>
        <View style={[styles.badge, styles.experienceBadge]}>
          <Icon name="clock-outline" fill="#34A853" style={styles.badgeIcon} />
          <Text style={[styles.badgeText, styles.experienceText]}>
            {doctor.experience} ans
          </Text>
        </View>
        <View style={[styles.badge, styles.priceBadge]}>
          <Icon
            name="pricetags-outline"
            fill="#FF9800"
            style={styles.badgeIcon}
          />
          <Text style={[styles.badgeText, styles.priceText]}>
            {doctor.price} Ar
          </Text>
        </View>
        <View style={[styles.badge, styles.locationBadge]}>
          <Icon name="pin-outline" fill="#2196F3" style={styles.badgeIcon} />
          <Text style={[styles.badgeText, styles.locationText]}>
            {doctor.location}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>À propos</Text>
      <Text style={styles.about}>{doctor.about}</Text>

      <Text style={styles.sectionTitle}>Disponibilité</Text>
      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={() => handleMonthChange(-1)}>
          <Icon name="arrow-back" fill="#003366" style={styles.arrowIcon} />
        </TouchableOpacity>
        <Text style={styles.monthText}>
          {format(selectedMonth, "MMMM yyyy")}
        </Text>
        <TouchableOpacity onPress={() => handleMonthChange(1)}>
          <Icon name="arrow-forward" fill="#003366" style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={availableDates}
        keyExtractor={(item) => item}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.dateSlot,
              selectedDate === item && styles.selectedDateSlot,
            ]}
            onPress={() => handleDateSelect(item)}
          >
            <Text
              style={[
                styles.dateSlotText,
                selectedDate === item && styles.selectedDateSlotText,
              ]}
            >
              {format(parse(item, "yyyy/MM/dd", new Date()), "d MMM")}
            </Text>
          </TouchableOpacity>
        )}
      />

      {selectedDate && (
        <>
          <Text style={styles.sectionTitle}>choisir l'heure</Text>
          <FlatList
            data={availableTimes}
            keyExtractor={(item) => item}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.timeSlot,
                  selectedTime === item && styles.selectedTimeSlot,
                ]}
                onPress={() => handleTimeSelect(item)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    selectedTime === item && styles.selectedTimeSlotText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}
      <Button
        style={[
          styles.appointmentButton,
          (!selectedDate || !selectedTime) && styles.disabledButton,
        ]}
        appearance={!selectedDate || !selectedTime ? "outline" : "filled"}
        status={!selectedDate || !selectedTime ? "basic" : "primary"}
        onPress={sendAppointment}
        disabled={!selectedDate || !selectedTime}
      >
        Prendre un rendez-vous
      </Button>

      <Text style={styles.sectionTitle}>Avis des patients</Text>
    </>
  );

  const renderFooter = () => (
    <View style={styles.addReviewContainer}>
      <Text style={styles.addReviewTitle}>Ajouter un avis</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setNewRating(star)}>
            <Icon
              name={star <= newRating ? "star" : "star-outline"}
              fill={star <= newRating ? "orange" : "gray"}
              style={styles.starIcon}
            />
          </TouchableOpacity>
        ))}
      </View>
      <CommentInput value={newComment} onChangeText={setNewComment} />
      <Button style={styles.submitButton} onPress={handleAddReview}>
        Soumettre l'avis
      </Button>
    </View>
  );

  return (
    <>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={reviews}
        renderItem={({ item }) => <ReviewList review={item} />}
        keyExtractor={(item: any) => item._id}
        contentContainerStyle={styles.container}
        ListFooterComponent={renderFooter}
      />
      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  headerText: {
    marginLeft: 20,
  },
  name: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    textTransform: "capitalize",
    color: "#003366",
  },
  specialty: {
    opacity: 0.3,
    fontFamily: "Poppins",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#003366",
  },
  about: {
    opacity: 0.3,
    fontFamily: "Poppins",
    textAlign: "justify",
  },
  monthSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  monthText: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#003366",
  },
  arrowIcon: {
    width: 24,
    height: 24,
  },
  appointmentButton: {
    backgroundColor: "#00BFA6",
    borderColor: "#00BFA6",
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 20,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  starIcon: {
    width: 20,
    height: 20,
  },
  ratingText: {
    marginLeft: 5,
    opacity: 0.3,
    fontFamily: "Poppins",
  },
  appointmentButtonText: {
    color: "white",
    fontFamily: "Poppins-Bold",
  },
  disabledButton: {
    backgroundColor: "#E0E0E0",
    borderColor: "#E0E0E0",
  },
  disabledButtonText: {
    color: "white",
  },
  dateSlot: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#00BFA6",
    marginRight: 10,
  },
  selectedDateSlot: {
    backgroundColor: "#00BFA6",
  },
  dateSlotText: {
    color: "#00BFA6",
  },
  selectedDateSlotText: {
    color: "white",
  },
  timeSlot: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#00BFA6",
    marginRight: 10,
  },
  selectedTimeSlot: {
    backgroundColor: "#00BFA6",
  },
  timeSlotText: {
    color: "#00BFA6",
  },
  selectedTimeSlotText: {
    color: "white",
  },
  badgeContainer: {
    flexDirection: "row",
    gap: 5,
    marginTop: 20,
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontFamily: "Poppins-Bold",
    fontSize: 12,
  },
  experienceBadge: {
    backgroundColor: "#E6F4EA",
  },
  experienceText: {
    color: "#34A853",
  },
  priceBadge: {
    backgroundColor: "#FFF3E0",
  },
  priceText: {
    color: "#FF9800",
  },
  locationBadge: {
    backgroundColor: "#E3F2FD",
  },
  locationText: {
    color: "#2196F3",
  },
  badgeIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  addReviewContainer: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
    margin: -20,
  },
  addReviewTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#003366",
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    minHeight: 100,
    textAlignVertical: "top",
    fontFamily: "Poppins",
    backgroundColor: "#fff",
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: "#00BFA6",
    borderColor: "#00BFA6",
  },
});

export default DoctorDetails;
