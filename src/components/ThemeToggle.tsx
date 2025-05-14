"use client";

import { useTheme } from '../lib/theme-context';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

// Inner component that uses the theme hook
function ThemeToggleButton() {
     const { theme, toggleTheme } = useTheme();

     return (
          <button
               onClick={toggleTheme}
               className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
               aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
               {theme === 'dark' ? (
                    <Sun className="h-5 w-5 text-amber-400" />
               ) : (
                    <Moon className="h-5 w-5 text-[#3A7D44]" />
               )}
          </button>
     );
}

// Main component with client-side only rendering
export function ThemeToggle() {
     const [mounted, setMounted] = useState(false);

     useEffect(() => {
          setMounted(true);
     }, []);

     // Return placeholder during SSR and first render
     if (!mounted) {
          return (
               <button
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 opacity-0"
                    aria-hidden="true"
               >
                    <span className="sr-only">Theme toggle placeholder</span>
               </button>
          );
     }

     // Only render the actual toggle on the client after hydration
     return <ThemeToggleButton />;
} 