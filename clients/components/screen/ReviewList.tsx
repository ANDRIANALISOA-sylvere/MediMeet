import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Icon } from "@ui-kitten/components";
import DefaultAvatar from "./DefaultAvatar";

interface Review {
  _id: string;
  doctorId: {
    _id: string;
    specialty: string;
    experience: number;
    price: number;
    about: string;
    location: string;
    availability: Array<{ day: string; startTime: string }>;
    createdAt: string;
    updatedAt: string;
  };
  patientId: {
    name: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    createdAt: string;
    updatedAt: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface ReviewListProps {
  review: Review;
}

const ReviewList: React.FC<ReviewListProps> = ({ review }) => (
  <View style={styles.reviewContainer}>
    <View style={styles.headerContainer}>
      <View style={styles.userInfo}>
        {review.patientId.avatar ? (
          <Image
            source={{ uri: review.patientId.avatar }}
            style={styles.avatar}
          />
        ) : (
          <View style={{ marginRight: 10 }}>
            <DefaultAvatar
              name={review.patientId.name}
              width={40}
              height={40}
            ></DefaultAvatar>
          </View>
        )}

        <Text style={styles.userName}>{review.patientId.name}</Text>
      </View>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name={star <= review.rating ? "star" : "star-outline"}
            fill={star <= review.rating ? "orange" : "gray"}
            style={styles.starIcon}
          />
        ))}
      </View>
    </View>
    <Text style={styles.comment}>{review.comment}</Text>
  </View>
);

const styles = StyleSheet.create({
  reviewContainer: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    marginBottom: 10,
    borderRadius: 2,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: "#003366",
    textTransform: "capitalize",
  },
  ratingContainer: {
    flexDirection: "row",
  },
  starIcon: {
    width: 20,
    height: 20,
  },
  comment: {
    fontFamily: "Poppins",
    fontSize: 14,
    color: "#333",
  },
});

export default ReviewList;
