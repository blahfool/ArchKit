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

    const root = document.documentElement;
    const { colors } = theme;

    // Apply colors
    root.style.setProperty("--background", colors.background);
    root.style.setProperty("--foreground", colors.foreground);
    root.style.setProperty("--muted", colors.muted);
    root.style.setProperty("--accent", colors.accent);
    root.style.setProperty("--primary", theme.primary);
    root.style.setProperty("--radius", `${theme.radius}rem`);
    root.style.setProperty("--gradient", colors.gradient);

    // Generate and apply texture
    const textureUrl = generateTexture(theme);
    document.body.style.background = `${colors.gradient}, url(${textureUrl})`;
    document.body.style.backgroundSize = 'cover, 100px 100px';
    document.body.style.backgroundBlendMode = 'normal, overlay';

    // Set theme variant and radius
    root.setAttribute('data-theme', theme.variant);
    root.setAttribute('data-radius', theme.radius.toString());

    // Toggle dark mode class based on theme appearance
    root.classList.toggle('dark', theme.appearance === 'dark');

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