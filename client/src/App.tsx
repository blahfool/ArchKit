import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import { useEffect } from "react";
import { syncFromServer } from "./lib/offlineStorage";
import Home from "@/pages/Home";
import Calculator from "@/pages/Calculator";
import TermsIndex from "@/pages/TermsIndex";
import ArMeasure from "@/pages/ArMeasure";
import ExamGenerator from "@/pages/ExamGenerator";
import EBook from "@/pages/EBook";
import About from "@/pages/About";
import NotFound from "@/pages/not-found";
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
    <div className="min-h-screen bg-background">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/calculator" component={Calculator} />
        <Route path="/terms" component={TermsIndex} />
        <Route path="/ar" component={ArMeasure} />
        <Route path="/exam" component={ExamGenerator} />
        <Route path="/ebook" component={EBook} />
        <Route path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
      <OfflineIndicator />
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;