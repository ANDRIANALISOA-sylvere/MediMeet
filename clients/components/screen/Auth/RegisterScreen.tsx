import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { Input, Button, Radio, RadioGroup, Icon } from "@ui-kitten/components";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

function RegisterScreen({ navigation }: any) {
  const [loaded, error] = useFonts({
    Poppins: require("../../../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../../../assets/fonts/Poppins-Bold.ttf"),
  });

  const [isNameFocused, setNameFocused] = useState(false);
  const [isEmailFocused, setEmailFocused] = useState(false);
  const [isPasswordFocused, setPasswordFocused] = useState(false);
  const [isPhoneFocused, setPhoneFocused] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState<number>(0);

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

  const renderPasswordIcon = (props: any) => (
    <Icon
      {...props}
      name={secureTextEntry ? "eye-off" : "eye"}
      fill="#00BFA6"
      onPress={toggleSecureEntry}
    />
  );

  const roles = ["Patient", "Docteur"];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>
      <Text style={{ marginBottom: 10,fontFamily:'Poppins' }}>
        Remplissez les informations ci-dessous
      </Text>
      <Image
        source={require("../../../assets/images/undraw_medicine_b1ol.png")}
        style={styles.illustration}
      />
      <Input
        style={[styles.input, isNameFocused && styles.inputFocus]}
        placeholder="Nom"
        textStyle={styles.inputText}
        onFocus={() => setNameFocused(true)}
        onBlur={() => setNameFocused(false)}
      />
      <Input
        style={[styles.input, isEmailFocused && styles.inputFocus]}
        placeholder="Email"
        textStyle={styles.inputText}
        keyboardType="email-address"
        onFocus={() => setEmailFocused(true)}
        onBlur={() => setEmailFocused(false)}
      />
      <Input
        style={[styles.input, isPasswordFocused && styles.inputFocus]}
        placeholder="Mot de passe"
        textStyle={styles.inputText}
        secureTextEntry={secureTextEntry}
        accessoryRight={renderPasswordIcon}
        onFocus={() => setPasswordFocused(true)}
        onBlur={() => setPasswordFocused(false)}
      />
      <Input
        style={[styles.input, isPhoneFocused && styles.inputFocus]}
        placeholder="Numéro de téléphone"
        textStyle={styles.inputText}
        keyboardType="phone-pad"
        onFocus={() => setPhoneFocused(true)}
        onBlur={() => setPhoneFocused(false)}
      />
      <RadioGroup
        selectedIndex={selectedRoleIndex}
        onChange={(index) => setSelectedRoleIndex(index)}
        style={styles.radioGroup}
      >
        {roles.map((role, index) => (
          <Radio key={index} status="success">
            <Text>{role}</Text>
          </Radio>
        ))}
      </RadioGroup>
      <Button style={styles.loginButton}>
        <Text style={styles.buttonText}>S'inscrire</Text>
      </Button>
      <Text style={styles.signupPrompt}>
        Vous avez déjà un compte ?{" "}
        <Text style={styles.signupLink} onPress={()=>navigation.navigate("Login")}>Connectez-vous</Text>
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
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 15,
  },
  radio: {
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

export default RegisterScreen;
