import React, { useEffect } from "react";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import AppNavigation from "../components/navigation/AppNavigation";

const App = (): React.ReactElement => {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <AppNavigation></AppNavigation>
      </ApplicationProvider>
    </>
  );
};

export default App;
