import React from "react";
import "../css/bootstrap-docsie.css";
import "./App.css";
import ShelfSelector from "./components/ShelfSelector";

import { UserProvider } from "./context/UserState";

function App() {
  return (
    <UserProvider>
      <div className="App">
        <ShelfSelector />
      </div>
    </UserProvider>
  );
}

export default App;
