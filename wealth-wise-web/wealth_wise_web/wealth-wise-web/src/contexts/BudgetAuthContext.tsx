import React, { createContext, useState, useContext, ReactNode } from "react";

interface BudgetAuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const BudgetAuthContext = createContext<BudgetAuthContextType | undefined>(undefined);

export const BudgetAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("budgetAuth") === "true";
  });

  const login = () => {
    setIsLoggedIn(true);
    localStorage.setItem("budgetAuth", "true");
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("budgetAuth");
  };

  return (
    <BudgetAuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </BudgetAuthContext.Provider>
  );
};

export const useBudgetAuth = () => {
  const context = useContext(BudgetAuthContext);
  if (!context) {
    throw new Error("useBudgetAuth must be used within a BudgetAuthProvider");
  }
  return context;
};
