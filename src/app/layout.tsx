import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ContractLens AI — Understand Every Contract Before You Sign",
  description:
    "AI-powered contract review assistant that translates dense legal agreements into plain English, flags risky clauses, audits missing protections, and generates safer counter-proposals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark font-scale-normal">
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
