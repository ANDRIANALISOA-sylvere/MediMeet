import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Icon, Button } from "@ui-kitten/components";
import {
  format,
  parse,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";

function DoctorDetails({ route }: any) {
  const { doctor } = route.params;
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  useEffect(() => {
    updateAvailableDates(selectedMonth);
  }, [selectedMonth]);

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/avatar4.jpg")}
          style={styles.avatar}
        />
        <View style={styles.headerText}>
          <Text style={styles.name}>Dr {doctor.name}</Text>
          <Text style={styles.specialty}>{doctor.specialty}</Text>
          <View style={styles.rating}>
            <Icon name="star" fill="#FFD700" style={styles.starIcon} />
            <Text style={styles.ratingText}>
              {doctor.averageRating.toFixed(1)} ({doctor.reviewCount})
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>À propos</Text>
      <Text style={styles.about}>{doctor.about}</Text>

      <Text style={styles.sectionTitle}>Disponibilité</Text>
      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={() => handleMonthChange(-1)}>
          <Icon name="arrow-back" fill="#000" style={styles.arrowIcon} />
        </TouchableOpacity>
        <Text style={styles.monthText}>
          {format(selectedMonth, "MMMM yyyy")}
        </Text>
        <TouchableOpacity onPress={() => handleMonthChange(1)}>
          <Icon name="arrow-forward" fill="#000" style={styles.arrowIcon} />
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
          <Text style={styles.sectionTitle}>
            choisir l'heure
            {/* Horaires disponibles pour le{" "}
            {format(
              parse(selectedDate, "yyyy/MM/dd", new Date()),
              "dd/MM/yyyy"
            )} */}
          </Text>
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
        onPress={() =>
          console.log("Prendre un rendez-vous", selectedDate, selectedTime)
        }
        disabled={!selectedDate || !selectedTime}
      >
        Prendre un rendez-vous
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  specialty: {
    opacity: 0.3,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginTop: 20,
    marginBottom: 10,
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
});

export default DoctorDetails;
