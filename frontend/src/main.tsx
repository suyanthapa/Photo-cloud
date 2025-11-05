import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import clarity from "@microsoft/clarity";

const projectId = import.meta.env.VITE_CLARITY_PROJECT_ID;
// Only use init (not start)
clarity.init(projectId);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
