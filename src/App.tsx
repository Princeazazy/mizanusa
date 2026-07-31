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
import ResetPassword from "./pages/ResetPassword";
import ClientPortal from "./pages/ClientPortal";
import MarketingHome from "./pages/MarketingHome";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import QuotePage from "./pages/QuotePage";
import NotFound from "./pages/NotFound";

import { ErrorBoundary } from "./components/ErrorBoundary";
import { useAuth } from "./hooks/useAuth";
import { useClientAuth } from "./hooks/useClientAuth";

const queryClient = new QueryClient();

const RouteLoading = () => (
  <div className="min-h-screen futuristic-bg" aria-busy="true" aria-label="Loading">
    <div className="light-beam light-beam-left" />
    <div className="light-beam light-beam-right" />
    <div className="mx-auto max-w-[1600px] px-6 py-8 sm:px-8">
      <div className="h-10 w-40 animate-pulse rounded-lg bg-white/[0.05]" />
      <div className="mt-8 h-9 w-64 animate-pulse rounded-lg bg-white/[0.05]" />
      <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-white/[0.04]" />
      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="h-[300px] animate-pulse rounded-2xl bg-white/[0.04] lg:col-span-2" />
        <div className="h-[300px] animate-pulse rounded-2xl bg-white/[0.04]" />
      </div>
    </div>
  </div>
);


const AccountantRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading: accountantLoading } = useAuth();
  const { isAuthenticated: isClientAuthenticated, loading: clientLoading } = useClientAuth();

  if (accountantLoading || clientLoading) return <RouteLoading />;
  if (isClientAuthenticated) return <Navigate to="/client-portal" replace />;
  if (!user) return <Navigate to="/auth?role=bookkeeper" replace />;
  // Federated (Google/Apple) identities are client-side only — never practice access.
  if (isOAuthIdentity(user.app_metadata) || !isAccountantEmail(user.email)) {
    return <Navigate to="/auth?role=client" replace />;
  }

  return <>{children}</>;
};

const ClientRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading: accountantLoading } = useAuth();
  const { isAuthenticated: isClientAuthenticated, loading: clientLoading } = useClientAuth();

  if (accountantLoading || clientLoading) return <RouteLoading />;
  if (isClientAuthenticated) return <>{children}</>;
  if (user && !isOAuthIdentity(user.app_metadata) && isAccountantEmail(user.email)) {
    return <Navigate to="/clients" replace />;
  }

  return <Navigate to="/auth?role=client" replace />;
};

const AuthRoute = () => {
  const { user, loading: accountantLoading } = useAuth();
  const { isAuthenticated: isClientAuthenticated, loading: clientLoading } = useClientAuth();

  if (accountantLoading || clientLoading) return <RouteLoading />;
  if (isClientAuthenticated) return <Navigate to="/client-portal" replace />;
  if (user && !isOAuthIdentity(user.app_metadata) && isAccountantEmail(user.email)) {
    return <Navigate to="/clients" replace />;
  }

  // OAuth identities stay here so the EIN company-linking step can run.
  return <Auth />;
};


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>

          <Route path="/" element={<MarketingHome />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/quote" element={<QuotePage />} />
          <Route path="/contact" element={<Navigate to="/quote" replace />} />
          <Route path="/auth" element={<AuthRoute />} />
          <Route path="/reset-password" element={<ResetPassword />} />


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
        </ErrorBoundary>
      </BrowserRouter>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
