
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import SliderInput from "./SliderInput";
import ResultCard from "./ResultCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";

const SIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [years, setYears] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [results, setResults] = useState({
    totalInvestment: 0,
    estimatedReturns: 0,
    totalValue: 0,
  });
  
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  const percentFormatter = (value: number) => `${value}%`;

  useEffect(() => {
    const principal = monthlyInvestment * 12 * years;
    const months = years * 12;
    const monthlyRate = expectedReturn / 100 / 12;
    
    // SIP formula: P × {[(1 + r)^n - 1] / r} × (1 + r)
    const amount = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    
    setResults({
      totalInvestment: principal,
      estimatedReturns: amount - principal,
      totalValue: amount,
    });
  }, [monthlyInvestment, years, expectedReturn]);

  const chartData = [
    {
      name: "Investment",
      value: results.totalInvestment,
      fill: "#8B5CF6", // Purple
    },
    {
      name: "Returns",
      value: results.estimatedReturns,
      fill: "#0EA5E9", // Blue
    },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">SIP Calculator</h1>
      <p className="text-muted-foreground mb-8">
        Calculate the future value of your Systematic Investment Plan (SIP) based on your monthly investment amount, 
        time period, and expected annual returns.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="calculator-card">
            <CardHeader>
              <CardTitle className="text-xl">Input Parameters</CardTitle>
              <CardDescription>Adjust the values to see how your investment grows over time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SliderInput
                label="Monthly Investment"
                value={monthlyInvestment}
                onChange={setMonthlyInvestment}
                min={500}
                max={100000}
                step={500}
                prefix="₹"
                formatter={(value) => value.toLocaleString("en-IN")}
              />
              
              <SliderInput
                label="Time Period (Years)"
                value={years}
                onChange={setYears}
                min={1}
                max={30}
                step={1}
                suffix=" years"
              />
              
              <SliderInput
                label="Expected Annual Returns"
                value={expectedReturn}
                onChange={setExpectedReturn}
                min={1}
                max={30}
                step={0.5}
                suffix="%"
                formatter={percentFormatter}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="calculator-card">
            <CardHeader>
              <CardTitle className="text-xl">SIP Results</CardTitle>
              <CardDescription>Estimated growth of your investment over {years} years</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <ResultCard
                  title="Total Investment"
                  value={formatter.format(results.totalInvestment)}
                  subtitle={`₹${monthlyInvestment.toLocaleString()} × ${years * 12} months`}
                />
                
                <ResultCard
                  title="Estimated Returns"
                  value={formatter.format(results.estimatedReturns)}
                  subtitle={`At ${expectedReturn}% per annum`}
                  className="bg-primary/5"
                />
                
                <ResultCard
                  title="Total Value"
                  value={formatter.format(results.totalValue)}
                  subtitle="Investment + Returns"
                  icon={<TrendingUp size={20} />}
                  className="bg-primary/10"
                />
              </div>
              
              <div className="h-[300px] mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 10,
                    }}
                  >
                    <XAxis type="number" hide />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      width={100}
                    />
                    <Tooltip 
                      formatter={(value: number) => [formatter.format(value), "Amount"]}
                      contentStyle={{ 
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                      <LabelList 
                        dataKey="value" 
                        position="insideRight" 
                        fill="#FFFFFF" 
                        formatter={(value: number) => formatter.format(value)} 
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SIPCalculator;
