
import AppLayout from "@/components/layout/AppLayout";
import LoanEligibilityCalculator from "@/components/calculators/LoanEligibilityCalculator";

const LoanEligibilityPage = () => {
  return (
    <AppLayout>
      <LoanEligibilityCalculator />
    </AppLayout>
  );
};

export default LoanEligibilityPage;
