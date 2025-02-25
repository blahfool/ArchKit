import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { architecturalThemes } from "@/lib/themes";
import { useToast } from "@/hooks/use-toast";

export default function ThemeSelect() {
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("theme") || "modern");
  const { toast } = useToast();

  const applyTheme = (themeName: string) => {
    const theme = architecturalThemes[themeName];
    if (!theme) return;

    // Update theme.json values through CSS variables
    document.documentElement.style.setProperty("--background", theme.colors.background);
    document.documentElement.style.setProperty("--foreground", theme.colors.foreground);
    document.documentElement.style.setProperty("--muted", theme.colors.muted);
    document.documentElement.style.setProperty("--accent", theme.colors.accent);
    document.documentElement.style.setProperty("--primary", theme.primary);
    document.documentElement.style.setProperty("--radius", `${theme.radius}rem`);

    localStorage.setItem("theme", themeName);
    setCurrentTheme(themeName);

    toast({
      title: "Theme Updated",
      description: `Switched to ${theme.name} theme`,
    });
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && architecturalThemes[savedTheme]) {
      applyTheme(savedTheme);
    }
  }, []);

  return (
    <Select value={currentTheme} onValueChange={applyTheme}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select theme" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(architecturalThemes).map(([key, theme]) => (
          <SelectItem key={key} value={key}>
            {theme.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
