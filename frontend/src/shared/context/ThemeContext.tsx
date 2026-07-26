import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "light" | "dark";

type ThemeState = {
    theme: Theme;
};

type ThemeContextValues = ThemeState & {
    setTheme: (theme: Theme) => void;
    clearTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValues | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

const THEME_STORAGE_KEY = "theme";

function getStoredTheme(): Theme {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (!storedTheme) return "dark";
    return localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
}

export function ThemeProvider({ children }: ThemeProviderProps) {

    const [theme, setTheme] = useState<Theme>(getStoredTheme);

    useEffect(() => {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    const clearTheme = () => {
        localStorage.removeItem(THEME_STORAGE_KEY);
    }

    const ctx = { theme, setTheme, clearTheme };

    return (
        <ThemeContext.Provider value={ctx}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}