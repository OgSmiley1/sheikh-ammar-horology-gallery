import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { Suspense, lazy } from "react";
import { motion, useReducedMotion } from "framer-motion";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationContainer } from "./components/NotificationBanner";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Breadcrumb } from "./components/Breadcrumb";
import { LegacyAdminHandoff } from "./components/LegacyAdminHandoff";

// Eagerly load critical pages
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminLoginMvp from "./pages/AdminLoginMvp";
import AdminDashboardMvp from "./pages/AdminDashboardMvp";

// Lazy load all other pages
const About = lazy(() => import("./pages/About"));
const Top10Watches = lazy(() => import("./pages/Top10Watches"));
const Compare = lazy(() => import("./pages/Compare"));
const Stories = lazy(() => import("./pages/Stories"));
const VirtualTour = lazy(() => import("./pages/VirtualTour"));
const AdvancedSearch = lazy(() => import("./pages/AdvancedSearch"));
const Timeline = lazy(() => import("./pages/Timeline"));
const Collection = lazy(() => import("./pages/Collection"));
const BrandCollection = lazy(() => import("./pages/BrandCollection"));
const WatchDetail = lazy(() => import("./pages/WatchDetail"));
const SheikhGallery = lazy(() => import("./pages/SheikhGallery"));
const ConstellationOfTime = lazy(() => import("./pages/ConstellationOfTime"));
const Contact = lazy(() => import("./pages/Contact"));
const HorologyDiscovery = lazy(() => import("./pages/HorologyDiscovery"));

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse">
        <div className="h-12 w-12 bg-gradient-to-r from-gold-500 to-gold-600 rounded-full"></div>
      </div>
    </div>
  );
}

function RouteTransition({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      key={location}
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Router() {
  return (
    <>
      <Breadcrumb />
      <RouteTransition>
        <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/admin/login"} component={AdminLogin} />
        <Route path={"/admin/login-mvp"} component={AdminLoginMvp} />
        <Route path={"/admin/dashboard-mvp"} component={AdminDashboardMvp} />
        
        {/* Lazy-loaded public pages */}
        <Route path={"/about"}>
          {() => (
            <Suspense fallback={<PageLoader />}>
              <About />
            </Suspense>
          )}
        </Route>
        <Route path={"/top10"}>
          {() => (
            <Suspense fallback={<PageLoader />}>
              <Top10Watches />
            </Suspense>
          )}
        </Route>
        <Route path="/collection">
          {() => (
            <Suspense fallback={<PageLoader />}>
              <Collection />
            </Suspense>
          )}
        </Route>
        <Route path="/stories">
          {() => (
            <Suspense fallback={<PageLoader />}>
              <Stories />
            </Suspense>
          )}
        </Route>
        <Route path="/collections">
          {() => (
            <Suspense fallback={<PageLoader />}>
              <Collection />
            </Suspense>
          )}
        </Route>
        <Route path="/collection/:slug">
          {() => (
            <Suspense fallback={<PageLoader />}>
              <BrandCollection />
            </Suspense>
          )}
        </Route>
        <Route path="/watch/:slug">
          {() => (
            <Suspense fallback={<PageLoader />}>
              <WatchDetail />
            </Suspense>
          )}
        </Route>
        <Route path="/compare">
          {() => (
            <Suspense fallback={<PageLoader />}>
              <Compare />
            </Suspense>
          )}
        </Route>
        <Route path="/virtual-tour">
          {() => (
            <Suspense fallback={<PageLoader />}>
              <VirtualTour />
            </Suspense>
          )}
        </Route>
        <Route path="/advanced-search">
          {() => (
            <Suspense fallback={<PageLoader />}>
              <AdvancedSearch />
            </Suspense>
          )}
        </Route>
        <Route path="/timeline">
          {() => (
            <Suspense fallback={<PageLoader />}>
              <Timeline />
            </Suspense>
          )}
        </Route>
        <Route path="/sheikh-gallery">
          {() => (
            <Suspense fallback={<PageLoader />}>
              <SheikhGallery />
            </Suspense>
          )}
        </Route>
        <Route path="/constellation">
          {() => (
            <Suspense fallback={<PageLoader />}>
              <ConstellationOfTime />
            </Suspense>
          )}
        </Route>
        <Route path="/contact">
          {() => (
            <Suspense fallback={<PageLoader />}>
              <Contact />
            </Suspense>
          )}
        </Route>
        <Route path="/discovery">
          {() => (
            <Suspense fallback={<PageLoader />}>
              <HorologyDiscovery />
            </Suspense>
          )}
        </Route>

        {/* Lazy-loaded admin pages */}
        <Route path="/admin/dashboard" component={LegacyAdminHandoff} />
        <Route path="/admin/watches" component={LegacyAdminHandoff} />
        <Route path="/admin/subscribers" component={LegacyAdminHandoff} />
        <Route path="/admin/chatgpt" component={LegacyAdminHandoff} />

        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
        </Switch>
      </RouteTransition>
      <NotificationContainer />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
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
