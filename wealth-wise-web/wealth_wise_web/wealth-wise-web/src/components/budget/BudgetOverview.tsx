
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, BanknoteIcon, PiggyBankIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { BudgetData } from "@/hooks/use-budget-data";
import { Progress } from "@/components/ui/progress";

interface BudgetOverviewProps {
  data: BudgetData;
}

const BudgetOverview = ({ data }: BudgetOverviewProps) => {
  const { totalIncome, totalExpenses } = data;
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <TrendingUpIcon className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{totalIncome.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingDownIcon className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{totalExpenses.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
          <BanknoteIcon className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₹{balance.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            {balance >= 0 ? 'You are saving money' : 'You are in deficit'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
          <PiggyBankIcon className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{savingsRate.toFixed(1)}%</div>
          <Progress value={savingsRate} className="mt-2" />
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetOverview;
