import React from "react";
import { Navigate } from "react-router-dom";

interface BudgetPrivateRouteProps {
  children: JSX.Element;
}

const BudgetPrivateRoute = ({ children }: BudgetPrivateRouteProps) => {
  const isBudgetUser = localStorage.getItem("isBudgetUser") === "true";
  return isBudgetUser ? children : <Navigate to="/budget-signin" replace />;
};

export default BudgetPrivateRoute;
