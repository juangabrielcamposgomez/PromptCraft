import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import MissionGuide from "../components/MissionGuide";
import { TutorialProvider, ForgeGatekeeper } from "../context/TutorialContext";
import { TokenomicsProvider } from "../context/TokenomicsContext";
import TutorialSystem from "../components/TutorialSystem";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

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
  title: "PromptCraft Academy | SDLC & AI Prompt Engineering Mastery",
  description: "Master the Software Development Life Cycle through AI-assisted prompt engineering. The ultimate training ground for modern developers.",
  keywords: ["SDLC", "AI", "Prompt Engineering", "Software Engineering", "Mentor", "Next.js", "React"],
  authors: [{ name: "The Forge Team" }],
  openGraph: {
    title: "PromptCraft Academy | Master the SDLC",
    description: "The professional training ground for AI-powered software development.",
    url: "https://promptcraft-academy.vercel.app",
    siteName: "PromptCraft Academy",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PromptCraft Academy Dashboard",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptCraft Academy",
    description: "Master the SDLC with AI",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactNode {
  return (
    <html lang="es" className="dark">
      <body className={cn(inter.variable, outfit.variable, "font-sans antialiased")}>
        <TokenomicsProvider>
          <TutorialProvider>
            <ForgeGatekeeper>
              <CopilotKit runtimeUrl="/api/copilotkit">
                <CopilotSidebar
                  instructions={"Eres el Mentor de La Fragua (The Forge). Ayudas a los usuarios a masterizar el SDLC y la ingeniería de prompts. Tienes acceso al estado actual del hito y puedes ayudar a refinarlo."}
                  defaultOpen={false}
                  labels={{
                    title: "Mentor de La Fragua",
                    initial: "Hola, soy tu mentor técnico. ¿En qué parte del SDLC necesitas ayuda hoy?",
                  }}
                >
                  <div className="flex min-h-screen bg-[#050505] text-[#D7D3C2] selection:bg-primary/30 selection:text-white">
                    <Sidebar />
                    <main className="flex-1 lg:ml-72 min-h-screen p-4 md:p-8 overflow-x-hidden">
                      {children}
                    </main>
                    <MissionGuide />
                    <TutorialSystem />
                  </div>
                </CopilotSidebar>
              </CopilotKit>
            </ForgeGatekeeper>
          </TutorialProvider>
        </TokenomicsProvider>
      </body>
    </html>
  );
}
