import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const [, setLocation] = useLocation();

  return (
    <Button
      variant="secondary"
      onClick={() => setLocation("/")}
      className="fixed bottom-6 left-6 shadow-lg bg-background/80 backdrop-blur-sm"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Home
    </Button>
  );
}