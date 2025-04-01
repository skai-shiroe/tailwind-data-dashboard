
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";

// Pages
import Dashboard from "./pages/Dashboard";
import ImportExcel from "./pages/ImportExcel";
import ConsultationContribuables from "./pages/ConsultationContribuables";
import EditionDossier from "./pages/EditionDossier";
import Historique from "./pages/Historique";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/importation" element={<ImportExcel />} />
            <Route path="/consultation" element={<ConsultationContribuables />} />
            <Route path="/edition" element={<EditionDossier />} />
            <Route path="/edition/:id" element={<EditionDossier />} />
            <Route path="/historique" element={<Historique />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
