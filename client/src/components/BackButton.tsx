import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const [, setLocation] = useLocation();

  return (
    <Button
      variant="secondary"
      onClick={() => setLocation("/")}
      className="fixed bottom-6 left-6 shadow-lg bg-background/80 backdrop-blur-sm h-12 px-5 active:scale-95 touch-manipulation"
    >
      <ArrowLeft className="h-5 w-5 mr-2" />
      Back to Home
    </Button>
  );
}