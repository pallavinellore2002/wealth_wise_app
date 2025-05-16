import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { BudgetAuthProvider } from "./contexts/BudgetAuthContext";
createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
    <BrowserRouter>
      <BudgetAuthProvider>
        <App />
      </BudgetAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
