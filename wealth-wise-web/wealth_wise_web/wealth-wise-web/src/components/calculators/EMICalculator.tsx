
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import SliderInput from "./SliderInput";
import ResultCard from "./ResultCard";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [results, setResults] = useState({
    emi: 0,
    totalInterest: 0,
    totalPayment: 0,
  });

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  const percentFormatter = (value: number) => `${value}%`;

  useEffect(() => {
    // Convert interest rate from annual to monthly
    const monthlyInterestRate = interestRate / 12 / 100;
    const totalMonths = loanTenure * 12;
    
    // EMI formula: [P x R x (1+R)^N]/[(1+R)^N-1]
    const emi = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths) / 
               (Math.pow(1 + monthlyInterestRate, totalMonths) - 1);
    
    const totalPayment = emi * totalMonths;
    const totalInterest = totalPayment - loanAmount;
    
    setResults({
      emi,
      totalInterest,
      totalPayment,
    });
  }, [loanAmount, interestRate, loanTenure]);

  const chartData = [
    { name: "Principal", value: loanAmount, color: "#8B5CF6" },
    { name: "Interest", value: results.totalInterest, color: "#0EA5E9" },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">EMI Calculator</h1>
      <p className="text-muted-foreground mb-8">
        Calculate your Equated Monthly Installment (EMI) and total interest payments for home loans, car loans, personal loans, and more.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="calculator-card">
            <CardHeader>
              <CardTitle className="text-xl">Loan Details</CardTitle>
              <CardDescription>Adjust the values to calculate your EMI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SliderInput
                label="Loan Amount"
                value={loanAmount}
                onChange={setLoanAmount}
                min={100000}
                max={10000000}
                step={50000}
                prefix="₹"
                formatter={(value) => value.toLocaleString("en-IN")}
              />
              
              <SliderInput
                label="Interest Rate (% per annum)"
                value={interestRate}
                onChange={setInterestRate}
                min={5}
                max={20}
                step={0.1}
                suffix="%"
                formatter={percentFormatter}
              />
              
              <SliderInput
                label="Loan Tenure (Years)"
                value={loanTenure}
                onChange={setLoanTenure}
                min={1}
                max={30}
                step={1}
                suffix=" years"
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="calculator-card">
            <CardHeader>
              <CardTitle className="text-xl">EMI Results</CardTitle>
              <CardDescription>Your loan repayment details over {loanTenure} years</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <ResultCard
                  title="Monthly EMI"
                  value={formatter.format(results.emi)}
                  subtitle="Payment per month"
                  icon={<CreditCard size={20} />}
                  className="bg-primary/10"
                />
                
                <ResultCard
                  title="Total Interest"
                  value={formatter.format(results.totalInterest)}
                  subtitle={`${interestRate}% for ${loanTenure} years`}
                  className="bg-primary/5"
                />
                
                <ResultCard
                  title="Total Payment"
                  value={formatter.format(results.totalPayment)}
                  subtitle="Principal + Interest"
                />
              </div>
              
              <div className="h-[300px] mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [formatter.format(value), "Amount"]}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value, entry, index) => (
                        <span className="text-sm">{value}</span>
                      )}
                      wrapperStyle={{
                        paddingTop: "10px"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;
