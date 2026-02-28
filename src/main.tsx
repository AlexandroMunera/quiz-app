import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { QuizProvider } from "@/context/QuizContext";
import { ThemeProvider } from "@/context/ThemeContext";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <ThemeProvider>
          <QuizProvider>
            <App />
          </QuizProvider>
        </ThemeProvider>
      </AuthProvider>
    </HashRouter>
  </StrictMode>
);
