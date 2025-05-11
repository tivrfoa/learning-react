import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./Gemini2.5Pro";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);