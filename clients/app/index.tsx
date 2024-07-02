import React, { useEffect } from "react";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import MainNavigation from "@/components/navigation/MainNavigation";

const App = (): React.ReactElement => {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <MainNavigation></MainNavigation>
      </ApplicationProvider>
    </>
  );
};

export default App;
