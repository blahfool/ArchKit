import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import { Suspense, lazy } from "react";
import { Logo } from "@/components/Logo";
import { Loader2 } from "lucide-react";

// Lazy load pages
const Home = lazy(() => import("@/pages/Home"));
const Calculator = lazy(() => import("@/pages/Calculator"));
const TermsIndex = lazy(() => import("@/pages/TermsIndex"));
const Assessment = lazy(() => import("@/pages/Assessment"));
const EBook = lazy(() => import("@/pages/EBook"));
const Portfolio = lazy(() => import("@/pages/Portfolio"));
const BuildingCodes = lazy(() => import("@/pages/BuildingCodes"));
const ProfessionalTools = lazy(() => import("@/pages/ProfessionalTools"));
const About = lazy(() => import("@/pages/About"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Components
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
  //useStudyTime(); // Removed as its relevance is unclear without further context.

  return (
    <div className="min-h-screen bg-background text-foreground">
      {location === "/" && (
        <div className="fixed top-4 left-4 z-50">
          <Logo size={40} />
        </div>
      )}
      <div className="fixed top-4 right-4 z-50">
        <ThemeSelect />
      </div>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/calculator" component={Calculator} />
          <Route path="/terms" component={TermsIndex} />
          <Route path="/exam" component={Assessment} />
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