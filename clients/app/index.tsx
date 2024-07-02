import React from "react";
import {
  Input,
  ApplicationProvider,
  Text,
  Button,
  Layout,
  IconRegistry,
  Icon,
} from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { StyleSheet } from "react-native";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import SplashScreen from "@/components/screen/SplashScreen";

const App = (): React.ReactElement => {
  const [value, setValue] = React.useState("");

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <SplashScreen></SplashScreen>
      </ApplicationProvider>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  button: {
    margin: 2,
  },
});

export default App;
