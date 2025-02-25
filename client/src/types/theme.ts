export interface Theme {
  name: string;
  variant: 'professional' | 'tint' | 'vibrant';
  primary: string;
  appearance: 'light' | 'dark';
  radius: number;
  colors: {
    background: string;
    foreground: string;
    muted: string;
    accent: string;
    gradient: string;
  };
}

export interface ThemeState {
  currentTheme: string;
  setTheme: (theme: string) => void;
}