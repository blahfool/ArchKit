import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import Home from "@/pages/Home";
import Calculator from "@/pages/Calculator";
import TermsIndex from "@/pages/TermsIndex";
import ArMeasure from "@/pages/ArMeasure";
import ExamGenerator from "@/pages/ExamGenerator";
import About from "@/pages/About";
import NotFound from "@/pages/not-found";
import ThemeToggle from "@/components/ThemeToggle";

function Router() {
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
        <Route path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
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