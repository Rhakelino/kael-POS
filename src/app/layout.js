import { Inter } from "next/font/google";
import "./globals.css";
import AppShell from "../components/AppShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "POS Dashboard",
  description: "Modern Cafe POS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <style>{`.material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .active-icon { font-variation-settings: 'FILL' 1; }`}</style>
      </head>
      <body suppressHydrationWarning className={`${inter.variable} antialiased font-display bg-background-light text-slate-900`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
