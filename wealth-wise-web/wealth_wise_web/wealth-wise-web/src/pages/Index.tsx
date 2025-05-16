
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, TrendingUp, CreditCard, GraduationCap, WalletIcon, HandCoins } from "lucide-react";
import { Link } from "react-router-dom";

const calculators = [
  {
    title: "SIP Calculator",
    description: "Calculate the future value of your systematic investments.",
    icon: <TrendingUp className="h-10 w-10 text-finance-purple" />,
    path: "/calculators/sip",
    color: "bg-purple-50",
  },
  {
    title: "EMI Calculator",
    description: "Estimate your loan EMI and total interest payments.",
    icon: <CreditCard className="h-10 w-10 text-finance-blue" />,
    path: "/calculators/emi",
    color: "bg-blue-50",
  },
  {
    title: "Retirement Calculator",
    description: "Plan for retirement by estimating your required corpus.",
    icon: <GraduationCap className="h-10 w-10 text-finance-purple" />,
    path: "/calculators/retirement",
    color: "bg-purple-50",
  },
  {
    title: "Mutual Fund Lumpsum",
    description: "Calculate returns on your one-time mutual fund investments.",
    icon: <WalletIcon className="h-10 w-10 text-finance-blue" />,
    path: "/calculators/mutual-fund",
    color: "bg-blue-50",
  },
  {
    title: "Loan Eligibility",
    description: "Check how much loan you are eligible for based on your profile.",
    icon: <HandCoins className="h-10 w-10 text-finance-purple" />,
    path: "/calculators/loan-eligibility",
    color: "bg-purple-50",
  },
  {
    title: "FD Calcultor",
    description: "Check how much loan you are eligible for based on your profile.",
    icon: <HandCoins className="h-10 w-10 text-finance-purple" />,
    path: "/calculators/fd-calculator",
    color: "bg-purple-50",
  }
];

const Index = () => {
  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="flex justify-center mb-6">
            <Calculator className="h-16 w-16 text-finance-purple" />
          </div>
          <h1 className="text-4xl font-bold mb-4">WealthWise Financial Calculators</h1>
          <p className="text-xl text-muted-foreground">
            Powerful financial calculators to help you make smarter money decisions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {calculators.map((calculator) => (
            <Card key={calculator.title} className={`overflow-hidden hover:shadow-lg transition-all border-0 ${calculator.color}`}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  {calculator.icon}
                  <div>
                    <CardTitle className="text-xl">{calculator.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">{calculator.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full mt-2">
                  <Link to={calculator.path}>
                    Open Calculator
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Why Use WealthWise?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="p-6">
              <div className="font-bold text-lg mb-2">Accurate Calculations</div>
              <p className="text-muted-foreground">Our calculators use industry-standard formulas to provide precise results.</p>
            </div>
            <div className="p-6">
              <div className="font-bold text-lg mb-2">Easy to Use</div>
              <p className="text-muted-foreground">Simple, intuitive interfaces that make financial planning accessible to everyone.</p>
            </div>
            <div className="p-6">
              <div className="font-bold text-lg mb-2">Visual Results</div>
              <p className="text-muted-foreground">Clear charts and visualizations help you understand your financial progress.</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
