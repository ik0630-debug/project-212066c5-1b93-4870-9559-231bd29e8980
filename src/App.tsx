import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Program from "./pages/Program";
import Registration from "./pages/Registration";
import RegistrationCheck from "./pages/RegistrationCheck";
import RegistrationVerify from "./pages/RegistrationVerify";
import Location from "./pages/Location";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/projects" element={<Projects />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Project-specific routes */}
            <Route path="/:projectSlug" element={<Index />} />
            <Route path="/:projectSlug/program" element={<Program />} />
            <Route path="/:projectSlug/registration" element={<Registration />} />
            <Route path="/:projectSlug/registration/check" element={<RegistrationCheck />} />
            <Route path="/:projectSlug/registration/verify" element={<RegistrationVerify />} />
            <Route path="/:projectSlug/location" element={<Location />} />
            <Route path="/:projectSlug/admin" element={<Admin />} />
            
            {/* Redirect root to projects list */}
            <Route path="/" element={<Projects />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
