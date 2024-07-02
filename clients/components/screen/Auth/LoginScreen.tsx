import React, { useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { Input, Button } from "@ui-kitten/components";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

function LoginScreen() {
  const [loaded, error] = useFonts({
    Poppins: require("../../../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../../../assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue</Text>
      <Text style={{ marginBottom: 10 }}>
        Entrer vos identifiants ci-dessous
      </Text>
      <Image
        source={require("../../../assets/images/undraw_doctor_kw5l.png")}
        style={styles.illustration}
      />
      <Input
        style={styles.input}
        placeholder="Email"
        textStyle={styles.inputText}
        keyboardType="email-address"
      />
      <Input
        style={styles.input}
        placeholder="Mot de passe"
        textStyle={styles.inputText}
        secureTextEntry={true}
      />
      <Button style={styles.loginButton}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </Button>
      <Text style={styles.signupPrompt}>
        Vous n'avez pas de compte ?{" "}
        <Text style={styles.signupLink}>Inscrivez-vous</Text>
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
