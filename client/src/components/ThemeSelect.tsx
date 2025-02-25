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

    // Update theme CSS variables
    const root = document.documentElement;
    const { colors } = theme;

    root.style.setProperty("--background", colors.background);
    root.style.setProperty("--foreground", colors.foreground);
    root.style.setProperty("--muted", colors.muted);
    root.style.setProperty("--accent", colors.accent);
    root.style.setProperty("--primary", theme.primary);
    root.style.setProperty("--radius", `${theme.radius}rem`);
    root.style.setProperty("--gradient", colors.gradient);

    // Apply background gradient
    document.body.style.background = colors.gradient;

    // Update theme.json values through data attributes
    root.setAttribute('data-theme', theme.variant);
    root.setAttribute('data-radius', theme.radius.toString());

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