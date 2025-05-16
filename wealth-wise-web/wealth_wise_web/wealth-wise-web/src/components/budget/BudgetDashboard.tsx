
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BudgetOverview from "./BudgetOverview";
import ExpenseTracker from "./ExpenseTracker";
import BudgetGoals from "./BudgetGoals";
import SpendingCategories from "./SpendingCategories";
import { PlusCircle } from "lucide-react";
import { useBudgetData } from "@/hooks/use-budget-data";
import AddTransactionDialog from "./AddTransactionDialog";

const BudgetDashboard = () => {
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const { 
    data, 
    addTransaction,
    addBudgetGoal,
    updateBudgetGoal,
    resetData
  } = useBudgetData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budget Dashboard</h1>
          <p className="text-muted-foreground">
            Track your expenses, manage budgets, and reach your financial goals
          </p>
        </div>
        <Button 
          className="flex items-center gap-2" 
          onClick={() => setIsAddTransactionOpen(true)}
        >
          <PlusCircle className="h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <BudgetOverview data={data} />

      <Tabs defaultValue="expenses">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="goals">Budget Goals</TabsTrigger>
        </TabsList>
        <TabsContent value="expenses" className="space-y-4 pt-4">
          <ExpenseTracker transactions={data.transactions} />
        </TabsContent>
        <TabsContent value="categories" className="space-y-4 pt-4">
          <SpendingCategories transactions={data.transactions} />
        </TabsContent>
        <TabsContent value="goals" className="space-y-4 pt-4">
          <BudgetGoals 
            goals={data.budgetGoals} 
            onAddGoal={addBudgetGoal}
            onUpdateGoal={updateBudgetGoal}
          />
        </TabsContent>
      </Tabs>

      <AddTransactionDialog 
        isOpen={isAddTransactionOpen} 
        onClose={() => setIsAddTransactionOpen(false)} 
        onAddTransaction={addTransaction}
      />
    </div>
  );
};

export default BudgetDashboard;
