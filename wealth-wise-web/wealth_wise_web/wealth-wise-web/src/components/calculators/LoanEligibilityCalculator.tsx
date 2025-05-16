
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import ResultCard from "./ResultCard";
import { Building, CreditCard, Home, HandCoins, ExternalLink, IndianRupee, Percent } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const LoanEligibilityCalculator = () => {
  const [loanType, setLoanType] = useState("home");
  const [monthlyIncome, setMonthlyIncome] = useState(50000);
  const [existingEMIs, setExistingEMIs] = useState(10000);
  const [creditScore, setCreditScore] = useState(750);
  const [age, setAge] = useState(35);
  const [employmentType, setEmploymentType] = useState("salaried");
  const [eligible, setEligible] = useState(false);
  const [eligibility, setEligibility] = useState({
    maxLoanAmount: 0,
    maxEMI: 0,
    interestRate: 0,
    tenure: 0
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleCalculate = () => {
    // Calculate Eligibility Logic
    const foir = employmentType === "salaried" ? 0.5 : 0.65; // Fixed Obligation to Income Ratio
    const availableEMI = Math.max(0, monthlyIncome * foir - existingEMIs);
    
    let interestRate = 0;
    let tenure = 0;
    let maxLoanAmount = 0;
    
    // Interest rates based on loan type and credit score
    if (loanType === "home") {
      interestRate = creditScore > 750 ? 8.5 : creditScore > 650 ? 9.5 : 10.5;
      tenure = 20;
    } else if (loanType === "personal") {
      interestRate = creditScore > 750 ? 10.5 : creditScore > 650 ? 12 : 14;
      tenure = 5;
    } else if (loanType === "business") {
      interestRate = creditScore > 750 ? 11 : creditScore > 650 ? 13 : 15;
      tenure = 7;
    } else if (loanType === "car") {
      interestRate = creditScore > 750 ? 9 : creditScore > 650 ? 10 : 11.5;
      tenure = 7;
    }
    
    // Age constraints
    if (age + tenure > 60 && employmentType === "salaried") {
      tenure = Math.max(1, 60 - age);
    }
    
    // Max loan amount calculation using EMI formula reverse calculation
    // EMI = P * r * (1+r)^n / ((1+r)^n - 1)
    // Solving for P (Principal)
    const monthlyRate = interestRate / 12 / 100;
    const tenureMonths = tenure * 12;
    const denominator = monthlyRate * Math.pow(1 + monthlyRate, tenureMonths);
    const numerator = Math.pow(1 + monthlyRate, tenureMonths) - 1;
    maxLoanAmount = availableEMI * (numerator / denominator);
    
    // Round to nearest lakh
    maxLoanAmount = Math.floor(maxLoanAmount / 100000) * 100000;
    
    setEligibility({
      maxLoanAmount,
      maxEMI: availableEMI,
      interestRate,
      tenure
    });
    
    setEligible(maxLoanAmount > 0);
    
    if (maxLoanAmount > 0) {
      toast({
        title: "Calculation Complete",
        description: `You are eligible for a loan of ${formatCurrency(maxLoanAmount)}`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Not Eligible",
        description: "Based on your current financial profile, you may not be eligible for this loan.",
      });
    }
  };

  // Bank and NBFC affiliate links
  const loanProviders = {
    home: [
      { name: "SBI Home Loans", url: "https://homeloans.sbi" },
      { name: "HDFC Home Loans", url: "https://www.hdfc.com/home-loans" },
      { name: "ICICI Bank Home Loans", url: "https://www.icicibank.com/personal-banking/loans/home-loan" },
      { name: "LIC Housing Finance", url: "https://www.lichousing.com" },
      { name: "PNB Housing", url: "https://www.pnbhousing.com" }
    ],
    personal: [
      { name: "HDFC Bank", url: "https://www.hdfcbank.com/personal/borrow/popular-loans/personal-loan" },
      { name: "ICICI Bank", url: "https://www.icicibank.com/personal-banking/loans/personal-loan" },
      { name: "Bajaj Finserv", url: "https://www.bajajfinserv.in/personal-loan" },
      { name: "Axis Bank", url: "https://www.axisbank.com/retail/loans/personal-loan" },
      { name: "IDFC FIRST Bank", url: "https://www.idfcfirstbank.com/personal-banking/loans/personal-loan" }
    ],
    business: [
      { name: "SBI MSME Loans", url: "https://www.sbi.co.in/web/business/sme" },
      { name: "HDFC Business Loans", url: "https://www.hdfcbank.com/business-banking/business-loan" },
      { name: "Bajaj Finserv", url: "https://www.bajajfinserv.in/business-loan" },
      { name: "ICICI Bank", url: "https://www.icicibank.com/business-banking/loans/business-loan" },
      { name: "Tata Capital", url: "https://www.tatacapital.com/business-loan" }
    ],
    car: [
      { name: "HDFC Car Loans", url: "https://www.hdfcbank.com/personal/borrow/popular-loans/car-loan" },
      { name: "ICICI Bank", url: "https://www.icicibank.com/personal-banking/loans/car-loan" },
      { name: "Axis Bank", url: "https://www.axisbank.com/retail/loans/car-loan" },
      { name: "SBI Car Loans", url: "https://www.sbi.co.in/web/personal-banking/loans/auto-loans/car-loan" },
      { name: "Kotak Mahindra Bank", url: "https://www.kotak.com/en/personal-banking/loans/car-loan.html" }
    ]
  };

  // Map loan types to icons
  const loanTypeIcons = {
    home: <Home className="h-5 w-5" />,
    personal: <HandCoins className="h-5 w-5" />,
    business: <Building className="h-5 w-5" />,
    car: <CreditCard className="h-5 w-5" />
  };
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Loan Eligibility Calculator</h1>
      <p className="text-muted-foreground mb-8">
        Check how much loan you are eligible for based on your income, credit score, and existing obligations.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Enter Your Details</CardTitle>
              <CardDescription>Provide information to check your loan eligibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loanType">Loan Type</Label>
                <Select
                  value={loanType}
                  onValueChange={(value) => setLoanType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Loan Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home Loan</SelectItem>
                    <SelectItem value="personal">Personal Loan</SelectItem>
                    <SelectItem value="business">Business Loan</SelectItem>
                    <SelectItem value="car">Car Loan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">Monthly Income (₹)</Label>
                <div className="flex items-center">
                  <span className="mr-2">₹</span>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="existingEMIs">Existing EMIs (₹)</Label>
                <div className="flex items-center">
                  <span className="mr-2">₹</span>
                  <Input
                    id="existingEMIs"
                    type="number"
                    value={existingEMIs}
                    onChange={(e) => setExistingEMIs(Number(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="creditScore">Credit Score (300-900)</Label>
                <Input
                  id="creditScore"
                  type="number"
                  min="300"
                  max="900"
                  value={creditScore}
                  onChange={(e) => setCreditScore(Number(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="age">Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  min="18"
                  max="75"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="employmentType">Employment Type</Label>
                <Select
                  value={employmentType}
                  onValueChange={(value) => setEmploymentType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Employment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salaried">Salaried</SelectItem>
                    <SelectItem value="self-employed">Self-Employed</SelectItem>
                    <SelectItem value="business">Business Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="w-full mt-4" onClick={handleCalculate}>
                Calculate Eligibility
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Loan Eligibility Results</CardTitle>
              <CardDescription>Based on your financial profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <ResultCard
                  title="Maximum Loan Amount"
                  value={formatCurrency(eligibility.maxLoanAmount)}
                  icon={<IndianRupee size={20} />}
                  className={eligible ? "bg-primary/10" : "bg-muted"}
                />
                
                <ResultCard
                  title="Available Monthly EMI"
                  value={formatCurrency(eligibility.maxEMI)}
                  subtitle="Based on 50-65% of income"
                  className={eligible ? "bg-primary/5" : "bg-muted"}
                />
                
                <ResultCard
                  title="Estimated Interest Rate"
                  value={`${eligibility.interestRate.toFixed(2)}%`}
                  subtitle="Based on your credit score"
                  icon={<Percent size={20} />}
                  className={eligible ? "" : "bg-muted"}
                />
                
                <ResultCard
                  title="Loan Tenure"
                  value={`${eligibility.tenure} years`}
                  subtitle="Maximum eligible tenure"
                  className={eligible ? "" : "bg-muted"}
                />
              </div>
              
              <Separator className="my-6" />
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Apply with Top Lenders</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {loanProviders[loanType as keyof typeof loanProviders]?.map((provider, index) => (
                    <a
                      key={index}
                      href={provider.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-md border hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {loanTypeIcons[loanType as keyof typeof loanTypeIcons]}
                        <span>{provider.name}</span>
                      </div>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Note: Application eligibility is subject to the lender's criteria and verification. 
                  Interest rates may vary based on individual profile assessment.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoanEligibilityCalculator;
