
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PiggyBank, Percent, CalendarClock } from "lucide-react";
import SliderInput from "./SliderInput";
import ResultCard from "./ResultCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const FDRDCalculator = () => {
  // Common state
  const [depositType, setDepositType] = useState("fd");
  
  // FD calculator state
  const [fdPrincipal, setFdPrincipal] = useState(100000);
  const [fdInterestRate, setFdInterestRate] = useState(7.5);
  const [fdTenureYears, setFdTenureYears] = useState(5);
  const [fdTenureMonths, setFdTenureMonths] = useState(0);
  const [fdCompounding, setFdCompounding] = useState("quarterly");
  
  // RD calculator state
  const [rdMonthlyDeposit, setRdMonthlyDeposit] = useState(10000);
  const [rdInterestRate, setRdInterestRate] = useState(7);
  const [rdTenureYears, setRdTenureYears] = useState(3);
  
  // Results
  const [fdResults, setFdResults] = useState({
    maturityAmount: 0,
    totalInterest: 0,
    annualInterest: 0,
    chartData: [] as any[],
  });
  
  const [rdResults, setRdResults] = useState({
    maturityAmount: 0,
    totalDeposit: 0,
    totalInterest: 0,
    chartData: [] as any[],
  });

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  const percentFormatter = (value: number) => `${value}%`;
  
  // Calculate FD maturity amount
  useEffect(() => {
    const totalMonths = fdTenureYears * 12 + fdTenureMonths;
    const tenureInYears = totalMonths / 12;
    
    let compoundFrequency = 1; // annual
    if (fdCompounding === "quarterly") compoundFrequency = 4;
    else if (fdCompounding === "monthly") compoundFrequency = 12;
    else if (fdCompounding === "half-yearly") compoundFrequency = 2;
    
    // A = P(1 + r/n)^(nt)
    const r = fdInterestRate / 100;
    const n = compoundFrequency;
    const t = tenureInYears;
    
    const maturityAmount = fdPrincipal * Math.pow(1 + r/n, n*t);
    const totalInterest = maturityAmount - fdPrincipal;
    const annualInterest = fdPrincipal * (Math.pow(1 + r/n, n) - 1);
    
    // Generate chart data - yearly points
    const chartData = [];
    chartData.push({
      year: 0,
      amount: fdPrincipal,
      interest: 0,
      type: "Principal"
    });
    
    for (let year = 1; year <= Math.ceil(tenureInYears); year++) {
      const timeInYears = Math.min(year, tenureInYears);
      const currentAmount = fdPrincipal * Math.pow(1 + r/n, n*timeInYears);
      const currentInterest = currentAmount - fdPrincipal;
      
      chartData.push({
        year,
        amount: currentAmount,
        interest: currentInterest,
        type: "Interest"
      });
    }
    
    setFdResults({
      maturityAmount,
      totalInterest,
      annualInterest,
      chartData,
    });
  }, [fdPrincipal, fdInterestRate, fdTenureYears, fdTenureMonths, fdCompounding]);
  
  // Calculate RD maturity amount
  useEffect(() => {
    const months = rdTenureYears * 12;
    const rate = rdInterestRate / 100 / 4; // quarterly compounding
    const totalDeposit = rdMonthlyDeposit * months;
    
    // Formula for RD: P * (((1 + r)^n - 1) / r) * (1 + r)
    // where P is monthly installment, r is rate, n is number of quarters
    
    let maturityAmount = 0;
    
    // For each deposit, calculate its individual future value
    for (let m = 0; m < months; m++) {
      const remainingQuarters = Math.ceil((months - m) / 3);
      const futureValue = rdMonthlyDeposit * Math.pow(1 + rate, remainingQuarters);
      maturityAmount += futureValue;
    }
    
    const totalInterest = maturityAmount - totalDeposit;
    
    // Generate chart data - yearly points
    const chartData = [];
    
    for (let year = 0; year <= rdTenureYears; year++) {
      const currentMonths = year * 12;
      const currentDeposit = rdMonthlyDeposit * currentMonths;
      
      let currentMaturity = 0;
      for (let m = 0; m < currentMonths; m++) {
        const remainingQuarters = Math.ceil((currentMonths - m) / 3);
        const futureValue = rdMonthlyDeposit * Math.pow(1 + rate, remainingQuarters);
        currentMaturity += futureValue;
      }
      
      const currentInterest = currentMaturity - currentDeposit;
      
      chartData.push({
        year,
        deposit: currentDeposit,
        interest: currentInterest,
        total: currentMaturity
      });
    }
    
    setRdResults({
      maturityAmount,
      totalDeposit,
      totalInterest,
      chartData,
    });
  }, [rdMonthlyDeposit, rdInterestRate, rdTenureYears]);

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">FD/RD Calculator</h1>
      <p className="text-muted-foreground mb-8">
        Calculate the maturity amount and interest earned on your Fixed Deposits and Recurring Deposits.
      </p>
      
      <Tabs defaultValue="fd" value={depositType} onValueChange={setDepositType} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="fd">Fixed Deposit</TabsTrigger>
          <TabsTrigger value="rd">Recurring Deposit</TabsTrigger>
        </TabsList>
        
        <TabsContent value="fd" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card className="calculator-card">
                <CardHeader>
                  <CardTitle className="text-xl">Fixed Deposit Details</CardTitle>
                  <CardDescription>Calculate your FD returns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <SliderInput
                    label="Principal Amount"
                    value={fdPrincipal}
                    onChange={setFdPrincipal}
                    min={1000}
                    max={5000000}
                    step={1000}
                    prefix="₹"
                    formatter={(value) => value.toLocaleString("en-IN")}
                  />
                  
                  <SliderInput
                    label="Interest Rate"
                    value={fdInterestRate}
                    onChange={setFdInterestRate}
                    min={4}
                    max={10}
                    step={0.1}
                    suffix="%"
                    formatter={percentFormatter}
                  />
                  
                  <SliderInput
                    label="Tenure (Years)"
                    value={fdTenureYears}
                    onChange={setFdTenureYears}
                    min={0}
                    max={10}
                    step={1}
                    suffix=" years"
                  />
                  
                  <SliderInput
                    label="Tenure (Months)"
                    value={fdTenureMonths}
                    onChange={setFdTenureMonths}
                    min={0}
                    max={11}
                    step={1}
                    suffix=" months"
                  />
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Compounding Frequency
                    </label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={fdCompounding}
                      onChange={(e) => setFdCompounding(e.target.value)}
                    >
                      <option value="quarterly">Quarterly</option>
                      <option value="monthly">Monthly</option>
                      <option value="half-yearly">Half-Yearly</option>
                      <option value="annually">Annually</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Card className="calculator-card">
                <CardHeader>
                  <CardTitle className="text-xl">FD Results</CardTitle>
                  <CardDescription>
                    Maturity amount after {fdTenureYears} years {fdTenureMonths} months at {fdInterestRate}% interest
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <ResultCard
                      title="Principal Amount"
                      value={formatter.format(fdPrincipal)}
                      subtitle="Initial investment"
                      icon={<PiggyBank size={20} />}
                    />
                    
                    <ResultCard
                      title="Interest Earned"
                      value={formatter.format(fdResults.totalInterest)}
                      subtitle={`${(fdInterestRate).toFixed(1)}% ${fdCompounding} compounding`}
                      icon={<Percent size={20} />}
                      className="bg-primary/5"
                    />
                    
                    <ResultCard
                      title="Maturity Amount"
                      value={formatter.format(fdResults.maturityAmount)}
                      subtitle={`After ${fdTenureYears}y ${fdTenureMonths}m`}
                      icon={<CalendarClock size={20} />}
                      className="bg-primary/10"
                    />
                  </div>
                  
                  <div className="h-[300px] mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={fdResults.chartData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottomRight', offset: -10 }} />
                        <YAxis
                          tickFormatter={(value) => {
                            if (value >= 10000000) return `${(value / 10000000).toFixed(1)}Cr`;
                            if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
                            return value;
                          }}
                        />
                        <Tooltip
                          formatter={(value: number) => [formatter.format(value), ""]}
                          contentStyle={{
                            borderRadius: "8px",
                            border: "none",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Bar 
                          name="Principal" 
                          dataKey="amount" 
                          fill="#8B5CF6"
                          radius={[4, 4, 0, 0]}
                        >
                          {fdResults.chartData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={index === 0 ? "#8B5CF6" : "#0EA5E9"} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="rd" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card className="calculator-card">
                <CardHeader>
                  <CardTitle className="text-xl">Recurring Deposit Details</CardTitle>
                  <CardDescription>Calculate your RD returns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <SliderInput
                    label="Monthly Deposit"
                    value={rdMonthlyDeposit}
                    onChange={setRdMonthlyDeposit}
                    min={500}
                    max={100000}
                    step={500}
                    prefix="₹"
                    formatter={(value) => value.toLocaleString("en-IN")}
                  />
                  
                  <SliderInput
                    label="Interest Rate"
                    value={rdInterestRate}
                    onChange={setRdInterestRate}
                    min={4}
                    max={9}
                    step={0.1}
                    suffix="%"
                    formatter={percentFormatter}
                  />
                  
                  <SliderInput
                    label="Tenure (Years)"
                    value={rdTenureYears}
                    onChange={setRdTenureYears}
                    min={1}
                    max={10}
                    step={1}
                    suffix=" years"
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Card className="calculator-card">
                <CardHeader>
                  <CardTitle className="text-xl">RD Results</CardTitle>
                  <CardDescription>
                    Maturity amount after {rdTenureYears} years at {rdInterestRate}% interest
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <ResultCard
                      title="Total Deposit"
                      value={formatter.format(rdResults.totalDeposit)}
                      subtitle={`₹${rdMonthlyDeposit.toLocaleString()} × ${rdTenureYears * 12} months`}
                      icon={<PiggyBank size={20} />}
                    />
                    
                    <ResultCard
                      title="Interest Earned"
                      value={formatter.format(rdResults.totalInterest)}
                      subtitle={`${rdInterestRate}% quarterly compounding`}
                      icon={<Percent size={20} />}
                      className="bg-primary/5"
                    />
                    
                    <ResultCard
                      title="Maturity Amount"
                      value={formatter.format(rdResults.maturityAmount)}
                      subtitle={`After ${rdTenureYears} years`}
                      icon={<CalendarClock size={20} />}
                      className="bg-primary/10"
                    />
                  </div>
                  
                  <div className="h-[300px] mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={rdResults.chartData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottomRight', offset: -10 }} />
                        <YAxis
                          tickFormatter={(value) => {
                            if (value >= 10000000) return `${(value / 10000000).toFixed(1)}Cr`;
                            if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
                            return value;
                          }}
                        />
                        <Tooltip
                          formatter={(value: number) => [formatter.format(value), ""]}
                          contentStyle={{
                            borderRadius: "8px",
                            border: "none",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Bar name="Total Deposit" dataKey="deposit" stackId="a" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                        <Bar name="Interest Earned" dataKey="interest" stackId="a" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FDRDCalculator;
