"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const STORAGE_KEY = "theme"

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "system",
  setTheme: () => null,
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system"
    return (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system"
  })

  useEffect(() => {
    const root = document.documentElement
    const applyDark = (isDark: boolean) => root.classList.toggle("dark", isDark)

    if (theme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)")
      applyDark(media.matches)
      const listener = (e: MediaQueryListEvent) => applyDark(e.matches)
      media.addEventListener("change", listener)
      return () => media.removeEventListener("change", listener)
    }

    applyDark(theme === "dark")
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(STORAGE_KEY, newTheme)
    setThemeState(newTheme)
  }

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeProviderContext)
