import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { AccessGate } from "./components/AccessGate";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AdminPainel from "./pages/admin/AdminPainel";
import CadastroParticipacao from "./pages/CadastroParticipacao";
import ExpertPainel from "./pages/expert/ExpertPainel";
import LancadorPainel from "./pages/lancador/LancadorPainel";
import { isModoOperacaoAdmin, isModoVisualizacaoAdmin } from "./lib/painelPreview";
function Router() {
  const modoVisualizacao = isModoVisualizacaoAdmin(window.location.pathname, window.location.search);
  const modoOperacaoAdmin = isModoOperacaoAdmin(window.location.pathname, window.location.search);
  const navegarComoAdmin = (papel: "admin" | "expert" | "lancador") => {
    window.location.href = papel === "admin" ? "/painel/admin" : `/painel/${papel}?operacao=admin`;
  };

  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/cadastro"} component={CadastroParticipacao} />
      <Route path={"/painel/admin"}>
        {() => <AccessGate requiredRole="admin"><AdminPainel onTrocarPapel={navegarComoAdmin} /></AccessGate>}
      </Route>
      <Route path={"/painel/expert"}>
        {() => <AccessGate requiredRole="expert" allowAdminPreview={modoVisualizacao || modoOperacaoAdmin}><ExpertPainel modoVisualizacao={modoVisualizacao} modoOperacaoAdmin={modoOperacaoAdmin} onTrocarPapel={navegarComoAdmin} /></AccessGate>}
      </Route>
      <Route path={"/painel/lancador"}>
        {() => <AccessGate requiredRole="lancador" allowAdminPreview={modoVisualizacao || modoOperacaoAdmin}><LancadorPainel modoVisualizacao={modoVisualizacao} modoOperacaoAdmin={modoOperacaoAdmin} onTrocarPapel={navegarComoAdmin} /></AccessGate>}
      </Route>
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster position="bottom-right" richColors />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
