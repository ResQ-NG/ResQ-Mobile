import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LIGHT_THEME_TOKENS, DARK_THEME_TOKENS } from "@/theme/colorMode";

type ThemeMode = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

/**
 * ThemeColorsLight identifies colors for the light theme, ThemeColorsDark for dark.
 * For ThemeContextType.colors, we want it to always exactly match one of those objects.
 */
interface ThemeContextType {
  /** Current theme mode setting (light, dark, or system) */
  themeMode: ThemeMode;
  /** Resolved theme based on mode and system preference */
  theme: ResolvedTheme;
  /** Whether dark mode is active */
  isDark: boolean;
  /** Theme-aware colors for inline styles */
  colors: typeof LIGHT_THEME_TOKENS;
  /** Set theme mode */
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  /** Toggle between light and dark (ignores system) */
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "@resq_theme_mode";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useSystemColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
          setThemeModeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.warn("Failed to load theme preference:", error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, []);

  // Save theme preference when it changes
  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.warn("Failed to save theme preference:", error);
    }
  }, []);

  // Resolve the actual theme based on mode and system preference
  const theme: ResolvedTheme = useMemo(() => {
    if (themeMode === "system") {
      return systemColorScheme === "dark" ? "dark" : "light";
    }
    return themeMode;
  }, [themeMode, systemColorScheme]);

  const isDark = theme === "dark";

  // Fix: .colors type always matches either .light or .dark
  const colors = useMemo(
    () => (isDark ? DARK_THEME_TOKENS : LIGHT_THEME_TOKENS),
    [isDark]
  ) as typeof LIGHT_THEME_TOKENS;

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    setThemeMode(isDark ? "light" : "dark");
  }, [isDark, setThemeMode]);

  const value = useMemo(
    () => ({
      themeMode,
      theme,
      isDark,
      colors,
      setThemeMode,
      toggleTheme,
    }),
    [themeMode, theme, isDark, colors, setThemeMode, toggleTheme]
  );

  // Don't render until theme is loaded to prevent flash
  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Export a hook for components that just need to know if dark mode is active
export function useIsDark() {
  const { isDark } = useTheme();
  return isDark;
}

/**
 * Hook to get theme-aware colors for inline styles.
 *
 * @example
 * const colors = useThemeColors();
 * <View style={{ backgroundColor: colors.screenBackground }} />
 *
 * // Instead of:
 * const { isDark } = useTheme();
 * <View style={{ backgroundColor: isDark ? "#141414" : "#F7F7F7" }} />
 */
export function useThemeColors(): typeof LIGHT_THEME_TOKENS {
  const { colors } = useTheme();
  return colors;
}
