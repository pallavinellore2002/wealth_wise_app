
import { useState, useEffect } from "react";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  category: string;
  description: string;
  type: TransactionType;
}

export interface BudgetGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
}

export interface BudgetData {
  transactions: Transaction[];
  budgetGoals: BudgetGoal[];
  totalIncome: number;
  totalExpenses: number;
}

// Sample categories for expenses
export const expenseCategories = [
  "Housing",
  "Food",
  "Transportation",
  "Utilities",
  "Healthcare",
  "Entertainment",
  "Shopping",
  "Personal Care",
  "Education",
  "Debt Payments",
  "Savings",
  "Investments",
  "Gifts & Donations",
  "Travel",
  "Other"
];

// Sample categories for income
export const incomeCategories = [
  "Salary",
  "Freelance",
  "Business",
  "Investments",
  "Rental",
  "Gifts",
  "Other"
];

const STORAGE_KEY = "budget_data";

const INITIAL_DATA: BudgetData = {
  transactions: [
    {
      id: "t1",
      date: new Date(2024, 3, 1),
      amount: 45000,
      category: "Salary",
      description: "Monthly salary",
      type: "income"
    },
    {
      id: "t2",
      date: new Date(2024, 3, 2),
      amount: 12000,
      category: "Housing",
      description: "Rent payment",
      type: "expense"
    },
    {
      id: "t3",
      date: new Date(2024, 3, 3),
      amount: 5000,
      category: "Food",
      description: "Grocery shopping",
      type: "expense"
    },
    {
      id: "t4",
      date: new Date(2024, 3, 5),
      amount: 2000,
      category: "Transportation",
      description: "Fuel",
      type: "expense"
    },
    {
      id: "t5",
      date: new Date(2024, 3, 8),
      amount: 3000,
      category: "Entertainment",
      description: "Movie and dinner",
      type: "expense"
    },
    {
      id: "t6",
      date: new Date(2024, 3, 15),
      amount: 8000,
      category: "Investments",
      description: "Stock purchase",
      type: "expense"
    },
  ],
  budgetGoals: [
    {
      id: "g1",
      name: "Emergency Fund",
      targetAmount: 100000,
      currentAmount: 50000,
      category: "Savings"
    },
    {
      id: "g2",
      name: "Vacation",
      targetAmount: 60000,
      currentAmount: 20000,
      category: "Travel"
    }
  ],
  totalIncome: 45000,
  totalExpenses: 30000
};

export function useBudgetData() {
  const [data, setData] = useState<BudgetData>(INITIAL_DATA);

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        
        // Convert string dates back to Date objects
        parsedData.transactions = parsedData.transactions.map((t: any) => ({
          ...t,
          date: new Date(t.date)
        }));
        
        setData(parsedData);
      } catch (error) {
        console.error("Error parsing stored budget data:", error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Calculate totals when data changes
  useEffect(() => {
    const totalIncome = data.transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = data.transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    
    if (totalIncome !== data.totalIncome || totalExpenses !== data.totalExpenses) {
      setData(prev => ({
        ...prev,
        totalIncome,
        totalExpenses
      }));
    }
  }, [data.transactions]);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: `t${Date.now()}`
    };
    
    setData(prev => ({
      ...prev,
      transactions: [...prev.transactions, newTransaction]
    }));
  };

  const addBudgetGoal = (goal: Omit<BudgetGoal, "id">) => {
    const newGoal = {
      ...goal,
      id: `g${Date.now()}`
    };
    
    setData(prev => ({
      ...prev,
      budgetGoals: [...prev.budgetGoals, newGoal]
    }));
  };

  const updateBudgetGoal = (goalId: string, updates: Partial<BudgetGoal>) => {
    setData(prev => ({
      ...prev,
      budgetGoals: prev.budgetGoals.map(goal => 
        goal.id === goalId ? { ...goal, ...updates } : goal
      )
    }));
  };

  const resetData = () => {
    setData(INITIAL_DATA);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    data,
    addTransaction,
    addBudgetGoal,
    updateBudgetGoal,
    resetData
  };
}
