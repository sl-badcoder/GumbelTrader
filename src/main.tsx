import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import { AuthProvider } from "./features/auth/AuthContext";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
