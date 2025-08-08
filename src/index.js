import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import React from "react";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  process.env.REACT_APP_STATUS === "development" ? (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  ) : (
    <App />
  )
);
reportWebVitals();
