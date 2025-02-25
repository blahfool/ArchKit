import { type Theme } from "@/types/theme";

export const architecturalThemes: Record<string, Theme> = {
  modern: {
    name: "Modern",
    variant: "professional",
    primary: "hsl(220 40% 20%)",
    appearance: "light",
    radius: 0.5,
    colors: {
      background: "hsl(220 20% 97%)",
      foreground: "hsl(220 40% 20%)",
      muted: "hsl(220 20% 94%)",
      accent: "hsl(220 40% 40%)",
      gradient: "linear-gradient(135deg, hsl(220 30% 96%), hsl(220 30% 98%))"
    }
  }
};