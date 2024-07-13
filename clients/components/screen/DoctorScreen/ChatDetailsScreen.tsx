import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import io, { Socket } from "socket.io-client";
import { Input, Text } from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SOCKET_URL = "http://192.168.43.149:8800";
interface Message {
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}
interface Doctor {
  _id: {
    _id: string;
    name: string;
  };
}

interface RouteParams {
  doctor: Doctor;
  roomId: string;
}

function ChatDetailsScreen({ route }: { route: { params: RouteParams } }) {
  const { doctor, roomId } = route.params;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setUserId(user._id);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'userId:", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      const newSocket = io(SOCKET_URL);
      setSocket(newSocket);

      newSocket.emit("join", roomId);

      newSocket.on("message", (newMessage: Message) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [roomId, userId]);

  const sendMessage = () => {
    if (message.trim() && socket && userId) {
      const messageData: Omit<Message, "timestamp" | "read"> & {
        roomId: string;
      } = {
        senderId: userId,
        receiverId: doctor._id._id,
        content: message,
        roomId: roomId,
      };

      socket.emit("sendMessage", messageData);
      setMessage("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat avec Dr. {doctor._id.name}</Text>
      {messages.map((msg, index) => (
        <Text key={index}>{msg.content}</Text>
      ))}
      <Input
        value={message}
        onChangeText={setMessage}
        placeholder="Tapez votre message..."
        onSubmitEditing={sendMessage}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    marginTop: 20,
  },
});

export default ChatDetailsScreen;
