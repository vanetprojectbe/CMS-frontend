import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { ThemeProvider } from "next-themes";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import Index from "./pages/Index";
import LiveMap from "./pages/LiveMap";
import IncidentLogs from "./pages/IncidentLogs";
import UserManagement from "./pages/UserManagement";
import AuditLogs from "./pages/AuditLogs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <SidebarInset className="flex-1">
                <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4">
                  <SidebarTrigger />
                  <div className="ml-auto">
                    <ThemeToggle />
                  </div>
                </header>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/live-map" element={<LiveMap />} />
                <Route path="/incident-logs" element={<IncidentLogs />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/audit-logs" element={<AuditLogs />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
