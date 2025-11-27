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
import AdminDebug from "./pages/AdminDebug";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "@/components/ProtectedRoute";

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
            
            {/* Project-specific routes - all require member access */}
            <Route path="/:projectSlug" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/:projectSlug/program" element={
              <ProtectedRoute>
                <Program />
              </ProtectedRoute>
            } />
            <Route path="/:projectSlug/registration" element={
              <ProtectedRoute>
                <Registration />
              </ProtectedRoute>
            } />
            <Route path="/:projectSlug/registration/check" element={
              <ProtectedRoute>
                <RegistrationCheck />
              </ProtectedRoute>
            } />
            <Route path="/:projectSlug/registration/verify" element={
              <ProtectedRoute>
                <RegistrationVerify />
              </ProtectedRoute>
            } />
            <Route path="/:projectSlug/location" element={
              <ProtectedRoute>
                <Location />
              </ProtectedRoute>
            } />
            <Route path="/:projectSlug/admin" element={
              <ProtectedRoute requireAdmin>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/:projectSlug/admin/debug" element={
              <ProtectedRoute requireAdmin>
                <AdminDebug />
              </ProtectedRoute>
            } />
            
            {/* Root path - Admin login page */}
            <Route path="/" element={<Index />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
