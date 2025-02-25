import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import { useEffect, Suspense, lazy } from "react";
import { syncFromServer } from "./lib/offlineStorage";
import { Logo } from "@/components/Logo";
import { Loader2 } from "lucide-react";
import { useStudyTime } from "@/hooks/useStudyTime"; // Added import

// Lazy load pages
const Home = lazy(() => import("@/pages/Home"));
const Calculator = lazy(() => import("@/pages/Calculator"));
const TermsIndex = lazy(() => import("@/pages/TermsIndex"));
const ArMeasure = lazy(() => import("@/pages/ArMeasure"));
const Assessment = lazy(() => import("@/pages/Assessment"));
const Progress = lazy(() => import("@/pages/Progress"));
const EBook = lazy(() => import("@/pages/EBook"));
const Portfolio = lazy(() => import("@/pages/Portfolio"));
const BuildingCodes = lazy(() => import("@/pages/BuildingCodes"));
const ProfessionalTools = lazy(() => import("@/pages/ProfessionalTools"));
const About = lazy(() => import("@/pages/About"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Components
import ThemeToggle from "@/components/ThemeToggle";
import ThemeSelect from "@/components/ThemeSelect";
import OfflineIndicator from "@/components/OfflineIndicator";

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex items-center gap-2 text-muted-foreground">
      <Loader2 className="h-6 w-6 animate-spin" />
      <span>Loading...</span>
    </div>
  </div>
);

function Router() {
  const [location] = useLocation();

  // Add study time tracking
  useStudyTime();

  useEffect(() => {
    if (navigator.onLine) {
      syncFromServer().catch(error => {
        console.error('Failed to sync from server:', error);
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {location === "/" && (
        <div className="fixed top-4 left-4 z-50">
          <Logo size={40} />
        </div>
      )}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <ThemeSelect />
        <ThemeToggle />
      </div>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/calculator" component={Calculator} />
          <Route path="/terms" component={TermsIndex} />
          <Route path="/ar" component={ArMeasure} />
          <Route path="/exam" component={Assessment} />
          <Route path="/progress" component={Progress} />
          <Route path="/ebook" component={EBook} />
          <Route path="/portfolio" component={Portfolio} />
          <Route path="/codes" component={BuildingCodes} />
          <Route path="/professional" component={ProfessionalTools} />
          <Route path="/about" component={About} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
      <OfflineIndicator />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}