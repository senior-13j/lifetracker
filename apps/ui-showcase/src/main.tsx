import React from "react";
import ReactDOM from "react-dom/client";

import "@lifetracker/ui/styles.css";
import "./styles.css";
import { Showcase } from "./Showcase";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Showcase />
  </React.StrictMode>
);
