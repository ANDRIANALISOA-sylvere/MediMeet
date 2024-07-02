import React, { useEffect } from "react";
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
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import SplashScreen from "@/components/screen/SplashScreen";
import HomeScreen from "@/components/screen/HomeScreen";
import LoginScreen from "@/components/screen/Auth/LoginScreen";

const App = (): React.ReactElement => {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <LoginScreen></LoginScreen>
      </ApplicationProvider>
    </>
  );
};

export default App;
