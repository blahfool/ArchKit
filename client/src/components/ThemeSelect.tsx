import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { architecturalThemes } from "@/lib/themes";
import { generateTexture } from "@/lib/textureGenerator";
import { useToast } from "@/hooks/use-toast";

export default function ThemeSelect() {
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("theme") || "modern");
  const { toast } = useToast();

  const applyTheme = (themeName: string) => {
    const theme = architecturalThemes[themeName];
    if (!theme) return;

    // Update theme CSS variables
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    const { colors } = theme;

    // Get the appropriate color set based on dark mode
    const colorSet = isDark ? colors.dark : colors;

    // Apply colors
    root.style.setProperty("--background", colorSet.background);
    root.style.setProperty("--foreground", colorSet.foreground);
    root.style.setProperty("--muted", colorSet.muted);
    root.style.setProperty("--accent", colorSet.accent);
    root.style.setProperty("--primary", theme.primary);
    root.style.setProperty("--radius", `${theme.radius}rem`);
    root.style.setProperty("--gradient", colorSet.gradient);

    // Generate and apply texture with current theme
    const textureUrl = generateTexture(theme);
    document.body.style.background = `${colorSet.gradient}, url(${textureUrl})`;
    document.body.style.backgroundSize = 'cover, 100px 100px';
    document.body.style.backgroundBlendMode = 'normal, overlay';

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

  // Listen for dark mode changes
  useEffect(() => {
    const darkModeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          applyTheme(currentTheme); // Reapply current theme with new dark/light mode
        }
      });
    });

    darkModeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => darkModeObserver.disconnect();
  }, [currentTheme]);

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