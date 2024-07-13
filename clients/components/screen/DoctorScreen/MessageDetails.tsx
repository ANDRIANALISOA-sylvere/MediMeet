import React, { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import io, { Socket } from "socket.io-client";
import { Button, Input, Text } from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../../../api/axios";
import { ImageBackground } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const SOCKET_URL = "http://192.168.43.149:8800";

interface Message {
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface Patient {
  _id: {
    _id: string;
    name: string;
  };
}

interface RouteParams {
  patient: Patient;
  roomId: string;
}

function MessageDetails({ route }: { route: { params: RouteParams } }) {
  const { patient, roomId } = route.params;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const scrollViewRef = useRef<KeyboardAwareScrollView>(null);

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

      const loadMessages = async () => {
        try {
          const response = await axios.get(
            `/messages/${userId}/${patient._id._id}`
          );
          setMessages(response.data);
        } catch (error) {
          console.error("Erreur lors du chargement des messages:", error);
        }
      };

      loadMessages();
      return () => {
        newSocket.disconnect();
      };
    }
  }, [roomId, userId]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current?.scrollToEnd(true);
    }
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() && socket && userId) {
      const messageData: Omit<Message, "timestamp" | "read"> & {
        roomId: string;
      } = {
        senderId: userId,
        receiverId: patient._id._id,
        content: message,
        roomId: roomId,
      };

      socket.emit("sendMessage", messageData);
      setMessage("");
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={
        item.senderId === userId ? styles.sentMessage : styles.receivedMessage
      }
    >
      <Text>{item.content}</Text>
    </View>
  );

  return (
    <ImageBackground
      source={require("../../../assets/images/more-leaves-on-green.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Chat avec {patient._id.name}</Text>
        <KeyboardAwareScrollView
          ref={scrollViewRef}
          style={styles.messageList}
          contentContainerStyle={styles.scrollViewContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd(true)}
        >
          {messages.map((item, index) => (
            <React.Fragment key={item.timestamp + index}>
              {renderMessage({ item })}
            </React.Fragment>
          ))}
        </KeyboardAwareScrollView>
        <View style={styles.inputContainer}>
          <Input
            value={message}
            onChangeText={setMessage}
            placeholder="Tapez votre message..."
            style={styles.input}
          />
          <Button onPress={sendMessage}>Envoyer</Button>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  messageList: {
    flex: 1,
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#ECECEC",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
});

export default MessageDetails;
