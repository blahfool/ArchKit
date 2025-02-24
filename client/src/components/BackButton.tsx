import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const [, setLocation] = useLocation();

  return (
    <Button
      variant="ghost"
      onClick={() => setLocation("/")}
      className="fixed bottom-4 left-4"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back
    </Button>
  );
}
