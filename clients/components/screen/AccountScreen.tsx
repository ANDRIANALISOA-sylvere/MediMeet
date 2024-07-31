import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icon, Divider } from "@ui-kitten/components";

function AccountScreen({ navigation }: any) {
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("ProfilePatient")}
        style={styles.menuItem}
      >
        <Icon name="person" fill="#00BFA6" style={styles.icon} />
        <Text style={styles.text}>Mon profil</Text>
        <Icon
          name="arrow-ios-forward"
          fill="#8e8e8e"
          style={styles.arrowIcon}
        />
      </TouchableOpacity>
      <Divider />
      <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
        <Icon name="log-out" fill="red" style={styles.icon} />
        <Text style={styles.logout}>Se déconnecter</Text>
        <Icon
          name="arrow-ios-forward"
          fill="#8e8e8e"
          style={styles.arrowIcon}
        />
      </TouchableOpacity>
      <Divider />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  text: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Poppins",
  },
  arrowIcon: {
    width: 24,
    height: 24,
  },
  logout: {
    flex: 1,
    fontFamily: "Poppins-Bold",
    color: "red",
  },
});

export default AccountScreen;
