import React from "react";
import "../css/bootstrap-docsie.css";
import "./App.css";
import ManagerPanel from "./components/ManagerPanel";

import { StepProvider } from "./context/StepState";

/* global chrome */
function App() {
  return (
    <StepProvider>
      <div className="App">
        <ManagerPanel></ManagerPanel>
      </div>
    </StepProvider>
  );
}

export default App;
