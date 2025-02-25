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
      gradient: "linear-gradient(135deg, hsl(220 30% 96%), hsl(220 30% 98%))",
      dark: {
        background: "hsl(220 20% 8%)",
        foreground: "hsl(220 40% 98%)",
        muted: "hsl(220 20% 12%)",
        accent: "hsl(220 40% 70%)",
        gradient: "linear-gradient(135deg, hsl(220 30% 12%), hsl(220 30% 8%))"
      }
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
      gradient: "linear-gradient(45deg, hsl(0 0% 93%), hsl(0 0% 97%))",
      dark: {
        background: "hsl(0 0% 10%)",
        foreground: "hsl(0 0% 90%)",
        muted: "hsl(0 0% 15%)",
        accent: "hsl(0 0% 70%)",
        gradient: "linear-gradient(45deg, hsl(0 0% 13%), hsl(0 0% 8%))"
      }
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
      gradient: "linear-gradient(135deg, hsl(30 30% 96%), hsl(30 20% 98%))",
      dark: {
        background: "hsl(30 20% 8%)",
        foreground: "hsl(30 20% 90%)",
        muted: "hsl(30 20% 12%)",
        accent: "hsl(30 30% 60%)",
        gradient: "linear-gradient(135deg, hsl(30 30% 12%), hsl(30 20% 8%))"
      }
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
      gradient: "linear-gradient(45deg, hsl(200 20% 96%), hsl(200 30% 98%))",
      dark: {
        background: "hsl(200 20% 8%)",
        foreground: "hsl(200 30% 90%)",
        muted: "hsl(200 20% 12%)",
        accent: "hsl(200 30% 60%)",
        gradient: "linear-gradient(45deg, hsl(200 20% 12%), hsl(200 30% 8%))"
      }
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
      gradient: "linear-gradient(135deg, hsl(25 30% 96%), hsl(25 20% 98%))",
      dark: {
        background: "hsl(25 30% 8%)",
        foreground: "hsl(25 30% 90%)",
        muted: "hsl(25 20% 12%)",
        accent: "hsl(25 30% 60%)",
        gradient: "linear-gradient(135deg, hsl(25 30% 12%), hsl(25 20% 8%))"
      }
    }
  }
};