"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
     theme: Theme;
     toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Fix for hydration mismatch - don't run useEffect on server
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ?
     React.useLayoutEffect :
     () => { };

export function ThemeProvider({ children }: { children: React.ReactNode }) {
     const [theme, setTheme] = useState<Theme>('light');
     const [mounted, setMounted] = useState(false);

     // Load theme from localStorage on mount
     useIsomorphicLayoutEffect(() => {
          const savedTheme = localStorage.getItem('theme') as Theme;
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

          if (savedTheme) {
               setTheme(savedTheme);
               document.documentElement.classList.toggle('dark', savedTheme === 'dark');
          } else if (prefersDark) {
               setTheme('dark');
               document.documentElement.classList.add('dark');
          }

          setMounted(true);
     }, []);

     // Ensure we don't render anything that relies on theme before client-side hydration
     useEffect(() => {
          setMounted(true);
     }, []);

     const toggleTheme = () => {
          const newTheme = theme === 'light' ? 'dark' : 'light';
          setTheme(newTheme);
          localStorage.setItem('theme', newTheme);
          document.documentElement.classList.toggle('dark', newTheme === 'dark');
     };

     // Skip rendering children until after hydration to prevent hydration mismatch
     if (!mounted) {
          return <div style={{ visibility: 'hidden' }}>{children}</div>;
     }

     return (
          <ThemeContext.Provider value={{ theme, toggleTheme }}>
               {children}
          </ThemeContext.Provider>
     );
}

export function useTheme() {
     const context = useContext(ThemeContext);
     if (context === undefined) {
          throw new Error('useTheme must be used within a ThemeProvider');
     }
     return context;
} 