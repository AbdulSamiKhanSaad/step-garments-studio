import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Services from "./pages/Services";
import Process from "./pages/Process";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Auth from "./pages/Auth";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/services" element={<Services />} />
              <Route path="/process" element={<Process />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<CustomerDashboard />} />
              <Route path="/dashboard/quotes" element={<CustomerDashboard />} />
              <Route path="/dashboard/orders" element={<CustomerDashboard />} />
              <Route path="/dashboard/messages" element={<CustomerDashboard />} />
              <Route path="/dashboard/files" element={<CustomerDashboard />} />
              <Route path="/dashboard/invoices" element={<CustomerDashboard />} />
              <Route path="/dashboard/profile" element={<CustomerDashboard />} />
              <Route path="/dashboard/design" element={<CustomerDashboard />} />
              <Route path="/dashboard/factory" element={<CustomerDashboard />} />
              <Route path="/dashboard/samples" element={<CustomerDashboard />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/clients" element={<AdminPanel />} />
              <Route path="/admin/quotes" element={<AdminPanel />} />
              <Route path="/admin/orders" element={<AdminPanel />} />
              <Route path="/admin/messages" element={<AdminPanel />} />
              <Route path="/admin/invoices" element={<AdminPanel />} />
              <Route path="/admin/contacts" element={<AdminPanel />} />
              <Route path="/admin/ticker" element={<AdminPanel />} />
              <Route path="/admin/settings" element={<AdminPanel />} />
              <Route path="/admin/design" element={<AdminPanel />} />
              <Route path="/admin/factory" element={<AdminPanel />} />
              <Route path="/admin/samples" element={<AdminPanel />} />
              <Route path="/admin/techpacks" element={<AdminPanel />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
