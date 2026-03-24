import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProviderBooking from "./pages/ProviderBooking";
import SimpleProviderView from "./pages/SimpleProviderView";
import ServiceBrands from "./pages/ServiceBrands";
import ServiceSearch from "./pages/ServiceSearch";
import DatabaseConsole from "./pages/DatabaseConsole";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Customer Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/service-brands" 
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <ServiceBrands />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/provider-booking" 
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <ProviderBooking />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/simple-provider-view" 
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <SimpleProviderView />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/service-search" 
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <ServiceSearch />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/database-console" 
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DatabaseConsole />
              </ProtectedRoute>
            } 
          />
          
          {/* Provider Routes */}
          <Route 
            path="/provider-dashboard" 
            element={
              <ProtectedRoute allowedRoles={["provider"]}>
                <ProviderDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

