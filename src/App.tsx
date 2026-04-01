import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Survey from "./pages/Survey.tsx";
import Admin from "./pages/Admin.tsx";
import AdminEditor from "./pages/AdminEditor.tsx";
import Distribute from "./pages/Distribute.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/fsb-career-diagnostic">
        <Routes>
          <Route path="/" element={<Navigate to="/survey" replace />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/editor" element={<AdminEditor />} />
          <Route path="/distribute" element={<Distribute />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
