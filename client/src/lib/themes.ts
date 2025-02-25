import { type Theme } from "@/types/theme";

export const architecturalThemes: Record<string, Theme> = {
  modern: {
    name: "Modern",
    variant: "professional",
    primary: "hsl(220 40% 20%)",
    appearance: "system",
    radius: 0.5,
    colors: {
      background: "hsl(220 20% 97%)",
      foreground: "hsl(220 40% 20%)",
      muted: "hsl(220 20% 94%)",
      accent: "hsl(220 40% 40%)",
    }
  },
  brutalist: {
    name: "Brutalist",
    variant: "professional",
    primary: "hsl(0 0% 20%)",
    appearance: "system",
    radius: 0,
    colors: {
      background: "hsl(0 0% 95%)",
      foreground: "hsl(0 0% 20%)",
      muted: "hsl(0 0% 90%)",
      accent: "hsl(0 0% 40%)",
    }
  },
  warmMinimal: {
    name: "Warm Minimal",
    variant: "professional",
    primary: "hsl(30 20% 30%)",
    appearance: "system",
    radius: 0.75,
    colors: {
      background: "hsl(30 20% 97%)",
      foreground: "hsl(30 20% 20%)",
      muted: "hsl(30 20% 94%)",
      accent: "hsl(30 30% 40%)",
    }
  },
  industrial: {
    name: "Industrial",
    variant: "professional",
    primary: "hsl(200 30% 25%)",
    appearance: "system",
    radius: 0.25,
    colors: {
      background: "hsl(200 20% 98%)",
      foreground: "hsl(200 30% 20%)",
      muted: "hsl(200 20% 94%)",
      accent: "hsl(200 30% 45%)",
    }
  },
  earthen: {
    name: "Earthen",
    variant: "professional",
    primary: "hsl(25 30% 35%)",
    appearance: "system",
    radius: 0.5,
    colors: {
      background: "hsl(25 30% 97%)",
      foreground: "hsl(25 30% 25%)",
      muted: "hsl(25 20% 94%)",
      accent: "hsl(25 30% 45%)",
    }
  }
};