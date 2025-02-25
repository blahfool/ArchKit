import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import { useEffect } from "react";
import { syncFromServer } from "./lib/offlineStorage";

// Pages
import Home from "@/pages/Home";
import Calculator from "@/pages/Calculator";
import TermsIndex from "@/pages/TermsIndex";
import ArMeasure from "@/pages/ArMeasure";
import ExamGenerator from "@/pages/ExamGenerator";
import Progress from "@/pages/Progress";
import EBook from "@/pages/EBook";
import About from "@/pages/About";
import NotFound from "@/pages/not-found";

// Components
import ThemeToggle from "@/components/ThemeToggle";
import OfflineIndicator from "@/components/OfflineIndicator";

function Router() {
  useEffect(() => {
    // Initial sync when app loads and is online
    if (navigator.onLine) {
      syncFromServer();
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/calculator" component={Calculator} />
        <Route path="/terms" component={TermsIndex} />
        <Route path="/ar" component={ArMeasure} />
        <Route path="/exam" component={ExamGenerator} />
        <Route path="/progress" component={Progress} />
        <Route path="/ebook" component={EBook} />
        <Route path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
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