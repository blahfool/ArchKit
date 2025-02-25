export interface Theme {
  name: string;
  variant: 'professional' | 'tint' | 'vibrant';
  primary: string;
  appearance: 'light' | 'dark' | 'system';
  radius: number;
  colors: {
    background: string;
    foreground: string;
    muted: string;
    accent: string;
  };
}

export interface ThemeState {
  currentTheme: string;
  setTheme: (theme: string) => void;
}
