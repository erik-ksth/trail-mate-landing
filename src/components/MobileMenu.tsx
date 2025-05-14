"use client";

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface MobileMenuProps {
     handleScrollTo: (elementId: string) => void;
}

export function MobileMenu({ handleScrollTo }: MobileMenuProps) {
     const [isOpen, setIsOpen] = useState(false);

     // Close menu when clicking outside
     useEffect(() => {
          const handleClickOutside = (event: MouseEvent) => {
               const target = event.target as HTMLElement;
               if (isOpen && !target.closest('#mobile-menu') && !target.closest('#menu-toggle')) {
                    setIsOpen(false);
               }
          };

          document.addEventListener('click', handleClickOutside);
          return () => document.removeEventListener('click', handleClickOutside);
     }, [isOpen]);

     // Prevent scrolling when menu is open
     useEffect(() => {
          if (isOpen) {
               document.body.style.overflow = 'hidden';
          } else {
               document.body.style.overflow = '';
          }

          return () => {
               document.body.style.overflow = '';
          };
     }, [isOpen]);

     const handleNavClick = (elementId: string) => {
          handleScrollTo(elementId);
          setIsOpen(false);
     };

     return (
          <div className="md:hidden">
               <button
                    id="menu-toggle"
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 shadow-sm focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
               >
                    {isOpen ? <X className="h-5 w-5 text-[#3A7D44] dark:text-[#5AAE71]" /> : <Menu className="h-5 w-5 text-[#3A7D44] dark:text-[#5AAE71]" />}
               </button>

               {/* Overlay */}
               <div
                    className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                         }`}
               ></div>

               {/* Drawer */}
               <div
                    id="mobile-menu"
                    className={`fixed top-0 right-0 bottom-0 w-[280px] bg-white dark:bg-[#0F1419] z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                         }`}
               >
                    <div className="flex flex-col h-full p-6">
                         <div className="flex justify-between items-center mb-8">
                              <p className="text-lg font-semibold text-[#3A7D44] dark:text-[#5AAE71]">Menu</p>
                              <button
                                   className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
                                   onClick={() => setIsOpen(false)}
                              >
                                   <X className="h-4 w-4 text-[#3A7D44] dark:text-[#5AAE71]" />
                              </button>
                         </div>

                         <div className="flex flex-col space-y-6">
                              <a
                                   href="#waitlist"
                                   className="text-[#333333] dark:text-white text-lg font-medium hover:text-[#3A7D44] dark:hover:text-[#5AAE71] transition-colors"
                                   onClick={(e) => {
                                        e.preventDefault();
                                        handleNavClick('waitlist');
                                   }}
                              >
                                   Get Early Access
                              </a>
                              <a
                                   href="#features"
                                   className="text-[#333333] dark:text-white text-lg font-medium hover:text-[#3A7D44] dark:hover:text-[#5AAE71] transition-colors"
                                   onClick={(e) => {
                                        e.preventDefault();
                                        handleNavClick('features');
                                   }}
                              >
                                   Features
                              </a>
                              <a
                                   href="#contact"
                                   className="text-[#333333] dark:text-white text-lg font-medium hover:text-[#3A7D44] dark:hover:text-[#5AAE71] transition-colors"
                                   onClick={(e) => {
                                        e.preventDefault();
                                        handleNavClick('contact');
                                   }}
                              >
                                   Contact Us
                              </a>
                         </div>

                         <div className="mt-auto pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                              <p className="text-sm text-gray-500 dark:text-gray-400">Dark Mode</p>
                              <ThemeToggle />
                         </div>
                    </div>
               </div>
          </div>
     );
} 