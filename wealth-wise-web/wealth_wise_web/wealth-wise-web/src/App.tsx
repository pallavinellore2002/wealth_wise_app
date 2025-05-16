import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import PrivateRoute from "./components/PrivateRoute";
import BudgetSignin from "./pages/BudgetSignin";
import BudgetSignup from "./pages/BudgetSignup";
import BudgetDashboardPage from "./pages/budget/BudgetDashboardPage";
import { useBudgetAuth } from "./contexts/BudgetAuthContext";

// Calculators
import SIPCalculatorPage from "./pages/calculators/SIPCalculatorPage";
import EMICalculatorPage from "./pages/calculators/EMICalculatorPage";
import RetirementCalculatorPage from "./pages/calculators/RetirementCalculatorPage";
import MutualFundCalculatorPage from "./pages/calculators/MutualFundCalculatorPage";
import SWPCalculatorPage from "./pages/calculators/SWPCalculatorPage";
import FDRDCalculatorPage from "./pages/calculators/FDRDCalculatorPage";
import TaxCalculatorPage from "./pages/calculators/TaxCalculatorPage";
import LoanEligibilityPage from "./pages/calculators/LoanEligibilityPage";

const FDCalculatorPage = () => <p>I am serving from FD calculator page</p>;

const queryClient = new QueryClient();

const App: React.FC = () => {
  const { isLoggedIn } = useBudgetAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Signup />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/budget-signup" element={<BudgetSignup />} />
          <Route path="/budget-signin" element={<BudgetSignin />} />
          <Route path="/budget" element={isLoggedIn ? <BudgetDashboardPage /> : <Navigate to="/budget-signup" />} />
          <Route path="/home" element={<PrivateRoute><Index /></PrivateRoute>} />
          <Route path="*" element={<NotFound />} />

          {/* Calculator Routes */}
          <Route path="/calculators/sip" element={<SIPCalculatorPage />} />
          <Route path="/calculators/emi" element={<EMICalculatorPage />} />
          <Route path="/calculators/retirement" element={<RetirementCalculatorPage />} />
          <Route path="/calculators/mutual-fund" element={<MutualFundCalculatorPage />} />
          <Route path="/calculators/swp" element={<SWPCalculatorPage />} />
          <Route path="/calculators/fd-rd" element={<FDRDCalculatorPage />} />
          <Route path="/calculators/fd-calculator" element={<FDCalculatorPage />} />
          <Route path="/calculators/tax" element={<TaxCalculatorPage />} />
          <Route path="/calculators/loan-eligibility" element={<LoanEligibilityPage />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
