import React from "react";
import { createRoot } from "react-dom/client";
import DndClassPersonalityTest from "../dnd_class_personality_test_v_3.jsx";
import { initAnalytics } from "./analytics.mjs";
import "./styles.css";

initAnalytics();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DndClassPersonalityTest />
  </React.StrictMode>,
);
