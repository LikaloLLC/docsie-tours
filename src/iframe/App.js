import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import ManagerPanel from "./components/ManagerPanel";

import { StepProvider } from "./context/StepState";

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
