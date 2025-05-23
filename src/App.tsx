
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PhysicsOptimization from "./pages/PhysicsOptimization";
import ConsumptionAnalytics from "./pages/ConsumptionAnalytics";
import RiceProduction from "./pages/RiceProduction";

// Create a client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/rice-production" element={<RiceProduction />} />
          <Route path="/physics" element={<PhysicsOptimization />} />
          <Route path="/analytics" element={<ConsumptionAnalytics />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
      <Sonner position="top-right" closeButton={true} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
