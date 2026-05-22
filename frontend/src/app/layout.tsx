import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FinPilot AI — AI-Powered Financial Operating System",
  description:
    "Your AI Chartered Accountant, CFO, Auditor, Tax Consultant & Financial Strategist. Automate finances with intelligence.",
  keywords: [
    "AI finance",
    "accounting",
    "tax",
    "CFO",
    "fintech",
    "expense tracker",
    "financial forecasting",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="mesh-gradient" />
        {children}
      </body>
    </html>
  );
}
