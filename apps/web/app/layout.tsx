import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";
export const dynamic = 'force-dynamic';

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "PromptCraft Academy | SDLC Mastering",
  description: "Master the SDLC with AI-powered prompt engineering",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactNode {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-background text-foreground antialiased`}>
        <div className="flex flex-col lg:flex-row">
          <Sidebar />
          {/* Mobile Header */}
          <div className="lg:hidden h-16 glass border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-40">
            <h1 className="font-display text-xl font-bold text-primary tracking-tighter">PromptCraft</h1>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
               <span className="text-[10px] font-bold text-primary">JD</span>
            </div>
          </div>
          <main className="flex-1 lg:ml-72 min-h-screen p-4 md:p-8 overflow-x-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
