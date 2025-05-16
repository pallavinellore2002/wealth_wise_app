
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlusCircle } from "lucide-react";
import { BudgetGoal, expenseCategories } from "@/hooks/use-budget-data";
import AddBudgetGoalDialog from "./AddBudgetGoalDialog";

interface BudgetGoalsProps {
  goals: BudgetGoal[];
  onAddGoal: (goal: Omit<BudgetGoal, "id">) => void;
  onUpdateGoal: (goalId: string, updates: Partial<BudgetGoal>) => void;
}

const BudgetGoals = ({ goals, onAddGoal, onUpdateGoal }: BudgetGoalsProps) => {
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Budget Goals</h3>
        <Button 
          variant="outline"
          size="sm"
          onClick={() => setIsAddGoalOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          New Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-8 text-center">
          <p className="text-muted-foreground mb-4">You don't have any budget goals yet.</p>
          <Button onClick={() => setIsAddGoalOpen(true)}>Create your first goal</Button>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => {
            const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
            
            return (
              <Card key={goal.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{goal.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{progressPercentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={progressPercentage} />
                  
                  <div className="flex justify-between items-baseline">
                    <div className="text-xl font-bold">₹{goal.currentAmount.toLocaleString()}</div>
                    <div className="text-muted-foreground">of ₹{goal.targetAmount.toLocaleString()}</div>
                  </div>
                  
                  <div className="text-sm">
                    <span className="text-muted-foreground">Category: </span> 
                    <span>{goal.category}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const amount = parseFloat(window.prompt("Enter additional amount:", "1000") || "0");
                      if (!isNaN(amount) && amount > 0) {
                        onUpdateGoal(goal.id, {
                          currentAmount: goal.currentAmount + amount
                        });
                      }
                    }}
                  >
                    Add Funds
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      const reset = window.confirm("Do you want to reset progress for this goal?");
                      if (reset) {
                        onUpdateGoal(goal.id, { currentAmount: 0 });
                      }
                    }}
                  >
                    Reset
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      <AddBudgetGoalDialog 
        isOpen={isAddGoalOpen}
        onClose={() => setIsAddGoalOpen(false)}
        onAddGoal={onAddGoal}
        categories={expenseCategories}
      />
    </div>
  );
};

export default BudgetGoals;
