import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ClientDashboard from "./pages/ClientDashboard";
import Index from "./pages/Index";
import DefioreIndex from "./pages/DefioreIndex";
import Auth from "./pages/Auth";
import ClientPortal from "./pages/ClientPortal";
import NotFound from "./pages/NotFound";
import { useAuth } from "./hooks/useAuth";
import { useClientAuth } from "./hooks/useClientAuth";

const queryClient = new QueryClient();

const RouteLoading = () => (
  <div className="min-h-screen flex items-center justify-center futuristic-bg">
    <p className="text-muted-foreground text-sm">Loading...</p>
  </div>
);

const AccountantRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading: accountantLoading } = useAuth();
  const { isAuthenticated: isClientAuthenticated, loading: clientLoading } = useClientAuth();

  if (accountantLoading || clientLoading) return <RouteLoading />;
  if (isClientAuthenticated) return <Navigate to="/client-portal" replace />;
  if (!user) return <Navigate to="/auth" replace />;

  return <>{children}</>;
};

const ClientRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading: accountantLoading } = useAuth();
  const { isAuthenticated: isClientAuthenticated, loading: clientLoading } = useClientAuth();

  if (accountantLoading || clientLoading) return <RouteLoading />;
  if (isClientAuthenticated) return <>{children}</>;
  if (user) return <Navigate to="/clients" replace />;

  return <Navigate to="/auth" replace />;
};

const AuthRoute = () => {
  const { user, loading: accountantLoading } = useAuth();
  const { isAuthenticated: isClientAuthenticated, loading: clientLoading } = useClientAuth();

  if (accountantLoading || clientLoading) return <RouteLoading />;
  if (isClientAuthenticated) return <Navigate to="/client-portal" replace />;
  if (user) return <Navigate to="/clients" replace />;

  return <Auth />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthRoute />} />
          <Route path="/auth" element={<AuthRoute />} />

          <Route
            path="/clients"
            element={
              <AccountantRoute>
                <ClientDashboard />
              </AccountantRoute>
            }
          />
          <Route
            path="/cvs"
            element={
              <AccountantRoute>
                <Index />
              </AccountantRoute>
            }
          />
          <Route
            path="/defiore"
            element={
              <AccountantRoute>
                <DefioreIndex />
              </AccountantRoute>
            }
          />

          <Route
            path="/client-portal"
            element={
              <ClientRoute>
                <ClientPortal />
              </ClientRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
