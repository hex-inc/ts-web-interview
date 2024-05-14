import * as React from "react";
import "./styles.css";
import Notebook from "./Notebook";

export default function App() {
  return (
      <div className="app">
        <div className="notebook-container">
          <h2>Notebook 1</h2>
          <Notebook />
        </div>
        <div className="notebook-container">
          <h2>Notebook 2</h2>
          <Notebook />
        </div>
      </div>
  );
}
