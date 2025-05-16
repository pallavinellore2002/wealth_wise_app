
import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

const MobileMenuButton = () => {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="fixed top-4 right-4 z-40" 
      onClick={toggleSidebar}
    >
      <Menu className="h-6 w-6" />
      <span className="sr-only">Toggle menu</span>
    </Button>
  );
};

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          <MobileMenuButton />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
