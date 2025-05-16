
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BudgetGoal } from "@/hooks/use-budget-data";

interface AddBudgetGoalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGoal: (goal: Omit<BudgetGoal, "id">) => void;
  categories: string[];
}

const AddBudgetGoalDialog = ({
  isOpen,
  onClose,
  onAddGoal,
  categories,
}: AddBudgetGoalDialogProps) => {
  const [name, setName] = useState<string>("");
  const [targetAmount, setTargetAmount] = useState<string>("");
  const [currentAmount, setCurrentAmount] = useState<string>("0");
  const [category, setCategory] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const targetValue = parseFloat(targetAmount);
    const currentValue = parseFloat(currentAmount);
    
    if (isNaN(targetValue) || targetValue <= 0) {
      alert("Please enter a valid target amount");
      return;
    }
    
    if (isNaN(currentValue) || currentValue < 0) {
      alert("Please enter a valid current amount");
      return;
    }
    
    if (currentValue > targetValue) {
      alert("Current amount cannot be greater than target amount");
      return;
    }
    
    if (!category) {
      alert("Please select a category");
      return;
    }
    
    onAddGoal({
      name,
      targetAmount: targetValue,
      currentAmount: currentValue,
      category,
    });
    
    // Reset form
    setName("");
    setTargetAmount("");
    setCurrentAmount("0");
    setCategory("");
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Budget Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Goal Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.g., Emergency Fund, New Car"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="targetAmount">Target Amount (₹)</Label>
            <Input
              id="targetAmount"
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="Enter target amount"
              min="1"
              step="0.01"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currentAmount">Current Amount (₹)</Label>
            <Input
              id="currentAmount"
              type="number"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
              placeholder="Enter current amount (if any)"
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Goal</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBudgetGoalDialog;
