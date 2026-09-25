import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ContractLens AI — Understand Every Contract Before You Sign",
  description:
    "AI-powered contract review assistant that translates dense legal agreements into plain English, flags risky clauses, audits missing protections, and generates safer counter-proposals.",
  keywords: ["contract review", "legal AI", "contract translator", "plain english legal", "clause risk analyzer"],
  authors: [{ name: "ContractLens AI Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark font-scale-normal">
      <body className="bg-slate-950 text-slate-100 min-h-screen selection:bg-blue-600 selection:text-white">
        {/* Skip to Main Content Link for Keyboard Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-2xl focus:ring-2 focus:ring-white outline-none"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
