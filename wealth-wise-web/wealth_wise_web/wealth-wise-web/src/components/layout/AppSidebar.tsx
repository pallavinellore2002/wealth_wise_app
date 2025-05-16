
import { 
  Calculator, 
  DollarSign, 
  Percent, 
  Home, 
  PiggyBank, 
  TrendingUp, 
  CreditCard,
  GraduationCap,
  WalletIcon,
  ArrowDownFromLine,
  X,
  Building,
  HandCoins,
  LayoutDashboard,
  Receipt
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";

const calculators = [
  {
    title: "SIP Calculator",
    path: "/calculators/sip",
    icon: TrendingUp,
  },
  {
    title: "EMI Calculator",
    path: "/calculators/emi",
    icon: CreditCard,
  },
  {
    title: "Retirement Calculator",
    path: "/calculators/retirement",
    icon: GraduationCap,
  },
  {
    title: "Mutual Fund Lumpsum",
    path: "/calculators/mutual-fund",
    icon: WalletIcon,
  },
  {
    title: "SWP Calculator",
    path: "/calculators/swp",
    icon: ArrowDownFromLine,
    disabled: false,
  },
  {
    title: "FD/RD Calculator",
    path: "/calculators/fd-rd",
    icon: PiggyBank,
    disabled: false,
  },
  {
    title: "Loan Eligibility",
    path: "/calculators/loan-eligibility",
    icon: HandCoins,
    disabled: false,
  },
  {
    title: "Tax Saving Calculator",
    path: "/calculators/tax",
    icon: Percent,
    disabled: false,
  },
];

const budgetingItems = [
  {
    title: "Budget Dashboard",
    path: "/budget",
    icon: LayoutDashboard,
    disabled: false,
  }
];

const AppSidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();
  
  // Close mobile navigation when clicking a link
  const handleMobileClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };
  
  return (
    <Sidebar>
      <SidebarHeader className="py-6">
        <Link to="/" className="flex items-center gap-2 px-4" onClick={handleMobileClick}>
          <Calculator className="h-6 w-6 text-finance-purple" />
          <span className="font-bold text-xl">WealthWise</span>
        </Link>
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-6" 
            onClick={() => setOpenMobile(false)}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/"} onClick={handleMobileClick}>
                  <Link to="/">
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Budgeting & Expenses</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {budgetingItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    disabled={item.disabled}
                    isActive={location.pathname === item.path}
                    onClick={handleMobileClick}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Financial Calculators</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {calculators.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    disabled={item.disabled}
                    isActive={location.pathname === item.path}
                    className={item.disabled ? "cursor-not-allowed opacity-50" : ""}
                    onClick={handleMobileClick}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 py-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} WealthWise
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
