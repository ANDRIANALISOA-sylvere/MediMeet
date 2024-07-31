import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";

interface DefaultAvatarProps {
  name: string;
  width?: number;
  height?: number;
}

function DefaultAvatar({ name, width, height }: DefaultAvatarProps) {
  const initial = name.split(" ")[0][0];

  const randomColor = () => {
    const r = Math.floor(Math.random() * 200);
    const g = Math.floor(Math.random() * 200);
    const b = Math.floor(Math.random() * 200);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const lightenColor = (color: string, percent: number) => {
    const matches = color.match(/\d+/g);
    if (!matches || matches.length !== 3) {
      return "rgb(200, 200, 200)";
    }
    const [r, g, b] = matches.map(Number);
    const newR = Math.min(r + Math.round((255 - r) * (percent / 100)), 255);
    const newG = Math.min(g + Math.round((255 - g) * (percent / 100)), 255);
    const newB = Math.min(b + Math.round((255 - b) * (percent / 100)), 255);
    return `rgb(${newR}, ${newG}, ${newB})`;
  };

  const textColor = randomColor();
  const backgroundColor = lightenColor(textColor, 40);

  // Calcul du style personnalisé pour le conteneur
  const containerStyle: ViewStyle = {
    ...styles.container,
    backgroundColor,
    width: width || styles.container.width,
    height: height || styles.container.height,
    borderRadius: (width || height || styles.container.width) / 2,
  };

  return (
    <View style={containerStyle}>
      <Text style={[styles.initial, { color: textColor }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  initial: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default DefaultAvatar;
