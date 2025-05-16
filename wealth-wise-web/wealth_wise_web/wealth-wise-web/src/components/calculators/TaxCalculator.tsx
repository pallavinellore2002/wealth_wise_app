
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ResultCard from "./ResultCard";
import { HelpCircle, Calculator } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

// Define tax slabs for different regimes and categories
const taxSlabs = {
  old: {
    general: [
      { limit: 250000, rate: 0 },
      { limit: 500000, rate: 5 },
      { limit: 1000000, rate: 20 },
      { limit: Infinity, rate: 30 }
    ],
    senior: [
      { limit: 300000, rate: 0 },
      { limit: 500000, rate: 5 },
      { limit: 1000000, rate: 20 },
      { limit: Infinity, rate: 30 }
    ],
    superSenior: [
      { limit: 500000, rate: 0 },
      { limit: 1000000, rate: 20 },
      { limit: Infinity, rate: 30 }
    ]
  },
  new: {
    general: [
      { limit: 300000, rate: 0 },
      { limit: 600000, rate: 5 },
      { limit: 900000, rate: 10 },
      { limit: 1200000, rate: 15 },
      { limit: 1500000, rate: 20 },
      { limit: Infinity, rate: 30 }
    ],
    senior: [
      { limit: 300000, rate: 0 },
      { limit: 600000, rate: 5 },
      { limit: 900000, rate: 10 },
      { limit: 1200000, rate: 15 },
      { limit: 1500000, rate: 20 },
      { limit: Infinity, rate: 30 }
    ],
    superSenior: [
      { limit: 300000, rate: 0 },
      { limit: 600000, rate: 5 },
      { limit: 900000, rate: 10 },
      { limit: 1200000, rate: 15 },
      { limit: 1500000, rate: 20 },
      { limit: Infinity, rate: 30 }
    ]
  }
};

// Surcharge rates based on income
const surchargeRates = [
  { limit: 5000000, rate: 0 },
  { limit: 10000000, rate: 10 },
  { limit: 20000000, rate: 15 },
  { limit: 50000000, rate: 25 },
  { limit: Infinity, rate: 37 }
];

const TaxCalculator = () => {
  const [assessmentYear, setAssessmentYear] = useState("2025-26");
  const [taxPayer, setTaxPayer] = useState("Individual");
  const [newRegime, setNewRegime] = useState("Yes");
  const [ageCategory, setAgeCategory] = useState("Less than 60 years");
  const [residentialStatus, setResidentialStatus] = useState("Resident");
  const [netTaxableIncome, setNetTaxableIncome] = useState<number | string>("");
  
  const [results, setResults] = useState({
    incomeTax: 0,
    surcharge: 0,
    educationCess: 0,
    totalTaxLiability: 0
  });

  // Format number as Indian currency (with commas)
  const formatIndianCurrency = (num: number): string => {
    const numStr = num.toString();
    let lastThree = numStr.substring(numStr.length - 3);
    const otherNumbers = numStr.substring(0, numStr.length - 3);
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }
    const res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return res;
  };

  // Calculate tax based on input values
  const calculateTax = () => {
    if (!netTaxableIncome) {
      setResults({
        incomeTax: 0,
        surcharge: 0,
        educationCess: 0,
        totalTaxLiability: 0
      });
      return;
    }

    const income = typeof netTaxableIncome === 'string' 
      ? parseFloat(netTaxableIncome.replace(/,/g, '')) 
      : netTaxableIncome;
    
    // Determine which tax regime and category to use
    const regime = newRegime === "Yes" ? "new" : "old";
    let category = "general";
    
    if (ageCategory === "Between 60 and 80 years") {
      category = "senior";
    } else if (ageCategory === "Above 80 years") {
      category = "superSenior";
    }
    
    // Calculate base income tax
    const slabs = taxSlabs[regime][category];
    let remainingIncome = income;
    let incomeTax = 0;
    
    for (const slab of slabs) {
      if (remainingIncome <= 0) break;
      
      const taxableInThisSlab = Math.min(remainingIncome, slab.limit - (slabs.indexOf(slab) === 0 ? 0 : slabs[slabs.indexOf(slab) - 1].limit));
      incomeTax += taxableInThisSlab * (slab.rate / 100);
      remainingIncome -= taxableInThisSlab;
    }
    
    // Calculate surcharge
    let surchargeRate = 0;
    for (const rate of surchargeRates) {
      if (income <= rate.limit) {
        surchargeRate = rate.rate;
        break;
      }
    }
    
    const surcharge = incomeTax * (surchargeRate / 100);
    
    // Calculate education cess (4% of income tax + surcharge)
    const educationCess = (incomeTax + surcharge) * 0.04;
    
    // Calculate total tax liability
    const totalTaxLiability = incomeTax + surcharge + educationCess;
    
    setResults({
      incomeTax: Math.round(incomeTax),
      surcharge: Math.round(surcharge),
      educationCess: Math.round(educationCess),
      totalTaxLiability: Math.round(totalTaxLiability)
    });
  };

  // Calculate tax whenever input values change
  useEffect(() => {
    calculateTax();
  }, [netTaxableIncome, newRegime, ageCategory, taxPayer, residentialStatus]);

  // Handle input change for net taxable income
  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    if (value === '') {
      setNetTaxableIncome('');
    } else {
      setNetTaxableIncome(parseInt(value, 10));
    }
  };

  // Reset all form values
  const handleReset = () => {
    setAssessmentYear("2025-26");
    setTaxPayer("Individual");
    setNewRegime("Yes");
    setAgeCategory("Less than 60 years");
    setResidentialStatus("Resident");
    setNetTaxableIncome("");
    setResults({
      incomeTax: 0,
      surcharge: 0,
      educationCess: 0,
      totalTaxLiability: 0
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">TAX CALCULATOR</h1>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <Card className="calculator-card">
          <CardContent className="pt-6">
            {/* Assessment Year */}
            <div className="flex justify-between items-center py-4 border-b">
              <div className="font-medium">Assessment Year</div>
              <Select value={assessmentYear} onValueChange={setAssessmentYear}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-24">2023-24</SelectItem>
                  <SelectItem value="2024-25">2024-25</SelectItem>
                  <SelectItem value="2025-26">2025-26</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Tax Payer */}
            <div className="flex justify-between items-center py-4 border-b">
              <div className="font-medium">Tax Payer</div>
              <Select value={taxPayer} onValueChange={setTaxPayer}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Individual">Individual</SelectItem>
                  <SelectItem value="HUF">HUF</SelectItem>
                  <SelectItem value="AOPs/BOI">AOPs/BOI</SelectItem>
                  <SelectItem value="Domestic Company">Domestic Company</SelectItem>
                  <SelectItem value="Foreign Company">Foreign Company</SelectItem>
                  <SelectItem value="Firms">Firms</SelectItem>
                  <SelectItem value="LLP">LLP</SelectItem>
                  <SelectItem value="Co-operative Society">Co-operative Society</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Whether opting out new tax regime */}
            <div className="flex justify-between items-center py-4 border-b">
              <div className="font-medium flex items-center gap-2">
                Whether opting out new tax regime of section <span className="text-blue-600">115BAC</span> (1A) ?
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <HelpCircle className="h-4 w-4" />
                      <span className="sr-only">Help</span>
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-sm">
                      Section 115BAC provides an option for individuals and HUFs to pay tax at concessional rates with certain conditions.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Select value={newRegime} onValueChange={setNewRegime}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Category (Age) */}
            <div className="flex justify-between items-center py-4 border-b">
              <div className="font-medium">Category (Age)</div>
              <Select value={ageCategory} onValueChange={setAgeCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select age" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Less than 60 years">Less than 60 years</SelectItem>
                  <SelectItem value="Between 60 and 80 years">Between 60 and 80 years</SelectItem>
                  <SelectItem value="Above 80 years">Above 80 years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Residential Status */}
            <div className="flex justify-between items-center py-4 border-b">
              <div className="font-medium">Residential Status</div>
              <Select value={residentialStatus} onValueChange={setResidentialStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Resident">Resident</SelectItem>
                  <SelectItem value="Non-Resident">Non-Resident</SelectItem>
                  <SelectItem value="Not Ordinarily Resident">Not Ordinarily Resident</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Net Taxable Income */}
            <div className="flex justify-between items-center py-4 border-b">
              <div className="font-medium">Net Taxable Income</div>
              <Input
                type="text"
                value={typeof netTaxableIncome === 'number' ? formatIndianCurrency(netTaxableIncome) : netTaxableIncome}
                onChange={handleIncomeChange}
                className="w-[180px] text-right"
                placeholder="e.g., 10,00,000"
              />
            </div>
            
            {/* Income Tax after relief u/s 87A */}
            <div className="flex justify-between items-center py-4 border-b">
              <div className="font-medium flex items-center gap-2">
                Income Tax after relief u/s <span className="text-blue-600">87A</span>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <HelpCircle className="h-4 w-4" />
                      <span className="sr-only">Help</span>
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-sm">
                      Section 87A provides a rebate of income tax to resident individuals whose total income does not exceed a specified limit.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <div className="w-[180px] bg-gray-100 py-2 px-3 rounded-md text-right">
                {formatIndianCurrency(results.incomeTax)}
              </div>
            </div>
            
            {/* Surcharge */}
            <div className="flex justify-between items-center py-4 border-b">
              <div className="font-medium">Surcharge</div>
              <div className="w-[180px] bg-gray-100 py-2 px-3 rounded-md text-right">
                {formatIndianCurrency(results.surcharge)}
              </div>
            </div>
            
            {/* Health and Education Cess */}
            <div className="flex justify-between items-center py-4 border-b">
              <div className="font-medium">Health and Education Cess</div>
              <div className="w-[180px] bg-gray-100 py-2 px-3 rounded-md text-right">
                {formatIndianCurrency(results.educationCess)}
              </div>
            </div>
            
            {/* Total Tax Liability */}
            <div className="flex justify-between items-center py-4">
              <div className="font-medium font-bold">Total Tax Liability</div>
              <div className="w-[180px] bg-gray-100 py-2 px-3 rounded-md text-right font-bold">
                {formatIndianCurrency(results.totalTaxLiability)}
              </div>
            </div>
            
            {/* Reset Button */}
            <div className="flex justify-center mt-6">
              <Button
                variant="secondary"
                onClick={handleReset}
                className="px-8"
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaxCalculator;
