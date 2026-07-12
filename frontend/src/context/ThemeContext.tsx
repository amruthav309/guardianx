import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

export const ThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const [theme, setTheme] = useState<Theme>(() => {
    return (
      (localStorage.getItem("guardianx_theme") as Theme) ||
      "dark"
    );
  });

  useEffect(() => {
    localStorage.setItem("guardianx_theme", theme);

    document.documentElement.className = theme;
  }, [theme]);

  const toggleTheme = () => {

    setTheme((prev) =>
      prev === "dark" ? "light" : "dark"
    );

  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () =>
  useContext(ThemeContext);