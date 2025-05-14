import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '../lib/theme-context';

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrailMate - Explore Nature Sustainably",
  description: "TrailMate helps you discover eco-friendly trails and plan sustainable outdoor adventures.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${openSans.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
