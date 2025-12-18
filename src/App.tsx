import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import Index from "./pages/Index";
import ThreadingModels from "./pages/ThreadingModels";
import Lifecycle from "./pages/Lifecycle";
import Synchronization from "./pages/Synchronization";
import Scheduling from "./pages/Scheduling";
import Simulator from "./pages/Simulator";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/threading-models" element={<ThreadingModels />} />
          <Route path="/lifecycle" element={<Lifecycle />} />
          <Route path="/synchronization" element={<Synchronization />} />
          <Route path="/scheduling" element={<Scheduling />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
