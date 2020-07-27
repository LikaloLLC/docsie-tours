import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
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
