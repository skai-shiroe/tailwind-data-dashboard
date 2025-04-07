import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { lazy, Suspense, useEffect, useState } from "react";

// Pages
import Dashboard from "./pages/Dashboard";
import ImportExcel from "./pages/ImportExcel";
import ConsultationContribuables from "./pages/ConsultationContribuables";
import EditionDossier from "./pages/EditionDossier";
import Historique from "./pages/Historique";
import NotFound from "./pages/NotFound";

// Lazy load DevTools for production
const ReactQueryDevtoolsProduction = lazy(() =>
  import("@tanstack/react-query-devtools/production").then((d) => ({
    default: d.ReactQueryDevtools,
  }))
);

const queryClient = new QueryClient();

const App = () => {
  // State for toggling DevTools in production
  const [showDevtools, setShowDevtools] = useState(false);

  // Add global function to toggle DevTools in production
  useEffect(() => {
    // @ts-expect-error - Adding a custom window property
    window.toggleDevtools = () => setShowDevtools((old) => !old);
  }, []);
  return (
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

      {/* DevTools for development - automatically excluded in production */}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />

      {/* DevTools for production - toggled by window.toggleDevtools() */}
      {showDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtoolsProduction />
        </Suspense>
      )}
    </QueryClientProvider>
  );
};

export default App;
