import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import CollectionStories from "./pages/CollectionStories";
import Collections from "./pages/Collections";
import BrandCollection from "./pages/BrandCollection";
import WatchDetail from "./pages/WatchDetail";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminWatches from "./pages/AdminWatches";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/stories" component={CollectionStories} />
      <Route path="/collections" component={Collections} />
      <Route path="/collection/:slug" component={BrandCollection} />
      <Route path="/watch/:slug" component={WatchDetail} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/watches" component={AdminWatches} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
