import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App";
import "./index.css";

// Create root with strict mode for better development experience
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);