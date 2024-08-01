import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Linking,
  Image,
} from "react-native";
import io, { Socket } from "socket.io-client";
import { Button, Icon, Input, Text } from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../../../api/axios";
import { ImageBackground } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as DocumentPicker from "expo-document-picker";

const SOCKET_URL = "http://192.168.43.149:8800";

interface Message {
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachment?: {
    type: "pdf" | "docx" | "image";
    url: string;
  };
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

  const openFile = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Erreur lors de l'ouverture du fichier:", error);
      Alert.alert("Erreur", "Impossible d'ouvrir le fichier");
    }
  };

  const sendMessage = async (
    content: string,
    attachment?: { type: "pdf" | "docx" | "image"; url: string }
  ) => {
    if ((content.trim() || attachment) && socket && userId) {
      const messageData: Omit<Message, "timestamp" | "read"> & {
        roomId: string;
      } = {
        senderId: userId,
        receiverId: patient._id._id,
        content: content,
        roomId: roomId,
        attachment: attachment,
      };

      socket.emit("sendMessage", messageData);
      setMessage("");
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "image/*",
        ],
      });

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const fileExtension = file.name.split(".").pop()?.toLowerCase();
        let fileType: "pdf" | "docx" | "image";

        if (fileExtension === "pdf") {
          fileType = "pdf";
        } else if (fileExtension === "docx") {
          fileType = "docx";
        } else {
          fileType = "image";
        }

        const formData = new FormData();
        formData.append("file", {
          uri: file.uri,
          type: file.mimeType,
          name: file.name,
        } as any);

        const response = await axios.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data && response.data.url) {
          sendMessage("", { type: fileType, url: response.data.url });
        }
      }
    } catch (error) {
      console.error("Erreur lors de la sélection du fichier:", error);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={
        item.senderId === userId ? styles.sentMessage : styles.receivedMessage
      }
    >
      {item.content && <Text>{item.content}</Text>}
      {item.attachment?.url &&
        (item.attachment.type === "image" ? (
          <Image
            source={{ uri: item.attachment.url }}
            style={styles.attachmentImage}
          />
        ) : (
          <TouchableOpacity
            onPress={() => {
              if (item.attachment?.url) {
                openFile(item.attachment.url);
              }
            }}
            style={styles.pdfContainer}
          >
            <Icon
              name="file-text-outline"
              fill="#FF0000"
              style={styles.pdfIcon}
            />
            <Text style={styles.pdfText}>
              {item.attachment.url.split("/").pop() || "Document PDF"}
            </Text>
          </TouchableOpacity>
        ))}
    </View>
  );

  return (
    <ImageBackground
      source={require("../../../assets/images/double-bubble-outline.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{patient._id.name}</Text>
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
      </View>
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={pickDocument} style={styles.attachButton}>
          <Icon
            name="file-add-outline"
            fill="white"
            style={styles.attachIcon}
          />
        </TouchableOpacity>
        <Input
          value={message}
          onChangeText={setMessage}
          placeholder="Message"
          style={styles.input}
          textStyle={styles.inputText}
        />
        <Button
          onPress={() => sendMessage(message)}
          style={styles.sendButton}
          accessoryLeft={<Icon name="paper-plane-outline" fill="white" />}
          status="control"
        />
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
    marginBottom: 20,
    fontFamily: "Poppins-Bold",
    color: "#003366",
    textTransform: "capitalize",
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
    alignItems: "center",
    padding: 5,
    backgroundColor: "#35b2a2",
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderRadius: 15,
    borderColor: "white",
    borderWidth: 1,
  },
  inputText: {
    paddingHorizontal: 2,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#00BFA6",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  attachButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  attachIcon: {
    width: 24,
    height: 24,
  },
  attachmentImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginTop: 10,
  },
  pdfContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  pdfIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  pdfText: {
    color: "black",
    fontFamily: "Poppins",
    textDecorationLine: "underline",
  },
});

export default MessageDetails;
