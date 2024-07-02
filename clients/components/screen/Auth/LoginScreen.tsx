import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, Alert } from "react-native";
import { Input, Button, Icon } from "@ui-kitten/components";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../../../api/axios";

function LoginScreen({ navigation }: any) {
  const [loaded, error] = useFonts({
    Poppins: require("../../../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../../../assets/fonts/Poppins-Bold.ttf"),
  });

  const [isEmailFocused, setEmailFocused] = useState(false);
  const [isPasswordFocused, setPasswordFocused] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('/login', { email, password });
      const { token, user } = response.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      navigation.navigate('MainNavigation');
      setEmail("");
      setPassword("");
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };

  const renderEmailIcon = (props: any) => (
    <Icon {...props} name="email-outline" fill="#00BFA6" />
  );

  const renderPasswordIcon = (props: any) => (
    <Icon
      {...props}
      name={secureTextEntry ? "eye-off" : "eye"}
      fill="#00BFA6"
      onPress={toggleSecureEntry}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue</Text>
      <Text style={{ marginBottom: 10, fontFamily: "Poppins" }}>
        Entrer vos identifiants ci-dessous !
      </Text>
      <Image
        source={require("../../../assets/images/undraw_doctor_kw5l.png")}
        style={styles.illustration}
      />
      <Input
        style={[styles.input, isEmailFocused && styles.inputFocus]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        textStyle={styles.inputText}
        keyboardType="email-address"
        accessoryRight={renderEmailIcon}
        onFocus={() => setEmailFocused(true)}
        onBlur={() => setEmailFocused(false)}
      />
      <Input
        style={[styles.input, isPasswordFocused && styles.inputFocus]}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        textStyle={styles.inputText}
        secureTextEntry={secureTextEntry}
        accessoryRight={renderPasswordIcon}
        onFocus={() => setPasswordFocused(true)}
        onBlur={() => setPasswordFocused(false)}
      />
      <Button style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </Button>
      <Text style={styles.signupPrompt}>
        Vous n'avez pas de compte ?{" "}
        <Text style={styles.signupLink} onPress={() => navigation.navigate("Register")}>Inscrivez-vous</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  illustration: {
    width: 300,
    height: 200,
    resizeMode: "contain",
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
  },
  input: {
    width: "100%",
    marginBottom: 15,
    borderColor: "#e0e0e0",
  },
  inputFocus: {
    borderColor: "#00BFA6",
  },
  inputText: {
    fontFamily: "Poppins",
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#00BFA6",
    borderColor: "#00BFA6",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
  },
  signupPrompt: {
    marginTop: 20,
    fontFamily: "Poppins",
    fontSize: 14,
  },
  signupLink: {
    color: "#00BFA6",
    fontFamily: "Poppins-Bold",
  },
});

export default LoginScreen;
