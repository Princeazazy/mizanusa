import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClientSelect from "./pages/ClientSelect";
import ClientDashboard from "./pages/ClientDashboard";
import Index from "./pages/Index";
import DefioreIndex from "./pages/DefioreIndex";
import Auth from "./pages/Auth";
import ClientPortal from "./pages/ClientPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ClientSelect />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/clients" element={<ClientDashboard />} />
          <Route path="/cvs" element={<Index />} />
          <Route path="/defiore" element={<DefioreIndex />} />
          <Route path="/client-portal" element={<ClientPortal />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
