"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { TOKENOMICS_CONFIG, ModelId } from "../lib/tokenomics.config";

interface TokenomicsContextType {
  credits: number;
  hourlyUsage: number;
  selectedModel: ModelId;
  setSelectedModel: (id: ModelId) => void;
  deductCredits: (tokens: number) => void;
  isOutOfCredits: boolean;
  isHourlyLimited: boolean;
}

const TokenomicsContext = createContext<TokenomicsContextType | undefined>(undefined);

export function TokenomicsProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState(TOKENOMICS_CONFIG.FREE_TIER_QUOTA);
  const [hourlyUsage, setHourlyUsage] = useState(0);
  const [selectedModel, setSelectedModel] = useState<ModelId>("gemini-1.5-flash");

  useEffect(() => {
    const savedCredits = localStorage.getItem("pc_credits");
    if (savedCredits) setCredits(parseInt(savedCredits));
    
    // Reset hourly usage logic (simplified for demo)
    const lastReset = localStorage.getItem("pc_last_reset");
    const now = Date.now();
    if (lastReset && now - parseInt(lastReset) > 3600000) {
      setHourlyUsage(0);
      localStorage.setItem("pc_last_reset", now.toString());
    } else if (!lastReset) {
      localStorage.setItem("pc_last_reset", now.toString());
    }
  }, []);

  const deductCredits = (tokens: number) => {
    const model = TOKENOMICS_CONFIG.MODELS.find(m => m.id === selectedModel);
    const multiplier = model?.multiplier || 1.0;
    const cost = Math.ceil(tokens * multiplier);
    
    const newCredits = Math.max(0, credits - cost);
    setCredits(newCredits);
    setHourlyUsage(prev => prev + cost);
    
    localStorage.setItem("pc_credits", newCredits.toString());
  };

  const isOutOfCredits = credits <= 0;
  const isHourlyLimited = hourlyUsage >= TOKENOMICS_CONFIG.HOURLY_LIMIT;

  return (
    <TokenomicsContext.Provider value={{ 
      credits, 
      hourlyUsage, 
      selectedModel, 
      setSelectedModel, 
      deductCredits,
      isOutOfCredits,
      isHourlyLimited
    }}>
      {children}
    </TokenomicsContext.Provider>
  );
}

export function useTokenomics() {
  const context = useContext(TokenomicsContext);
  if (!context) throw new Error("useTokenomics must be used within a TokenomicsProvider");
  return context;
}
