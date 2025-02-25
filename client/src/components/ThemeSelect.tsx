import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ThemeSelect() {
  const [isDark, setIsDark] = useState(localStorage.getItem("appearance") === "dark");
  const { toast } = useToast();

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    const root = document.documentElement;
    root.classList.toggle('dark', newIsDark);

    localStorage.setItem("appearance", newIsDark ? "dark" : "light");

    toast({
      title: "Theme Updated",
      description: `Switched to ${newIsDark ? 'dark' : 'light'} mode`,
    });
  };

  useEffect(() => {
    const savedAppearance = localStorage.getItem("appearance");
    if (savedAppearance) {
      setIsDark(savedAppearance === "dark");
      document.documentElement.classList.toggle('dark', savedAppearance === "dark");
    }
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9"
    >
      {isDark ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}