"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface TutorialContextType {
  hasForgedIdentity: boolean;
  isTutorialMode: boolean;
  unlockedPhaseIndex: number;
  setHasForgedIdentity: (val: boolean) => void;
  setTutorialMode: (val: boolean) => void;
  completePhase: (index: number) => void;
  skipTutorial: () => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [hasForgedIdentity, setHasForgedIdentityState] = useState(false);
  const [isTutorialMode, setIsTutorialMode] = useState(true);
  const [unlockedPhaseIndex, setUnlockedPhaseIndex] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const savedIdentity = localStorage.getItem("forge_identity_prompt");
    const savedTutorialMode = localStorage.getItem("is_tutorial_mode");
    const savedPhaseIndex = localStorage.getItem("unlocked_phase_index");

    if (savedIdentity) setHasForgedIdentityState(true);
    if (savedTutorialMode === "false") setIsTutorialMode(false);
    if (savedPhaseIndex) setUnlockedPhaseIndex(parseInt(savedPhaseIndex));
  }, []);

  const setHasForgedIdentity = (val: boolean) => {
    setHasForgedIdentityState(val);
    if (!val) localStorage.removeItem("forge_identity_prompt");
  };

  const setTutorialMode = (val: boolean) => {
    setIsTutorialMode(val);
    localStorage.setItem("is_tutorial_mode", val.toString());
  };

  const completePhase = (index: number) => {
    if (index >= unlockedPhaseIndex) {
      const nextIndex = index + 1;
      setUnlockedPhaseIndex(nextIndex);
      localStorage.setItem("unlocked_phase_index", nextIndex.toString());
    }
  };

  const skipTutorial = () => {
    setIsTutorialMode(false);
    setHasForgedIdentityState(true);
    setUnlockedPhaseIndex(14); // Unlock all
    localStorage.setItem("is_tutorial_mode", "false");
    localStorage.setItem("unlocked_phase_index", "14");
    if (!localStorage.getItem("forge_identity_prompt")) {
      localStorage.setItem("forge_identity_prompt", "Senior Architect Identity (Skipped Tutorial)");
    }
  };

  return (
    <TutorialContext.Provider value={{ 
      hasForgedIdentity, 
      isTutorialMode, 
      unlockedPhaseIndex, 
      setHasForgedIdentity, 
      setTutorialMode, 
      completePhase,
      skipTutorial
    }}>
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (!context) throw new Error("useTutorial must be used within a TutorialProvider");
  return context;
}

export function ForgeGatekeeper({ children }: { children: React.ReactNode }) {
  const { hasForgedIdentity, isTutorialMode, unlockedPhaseIndex } = useTutorial();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // ADMIN BYPASS: Oriundo Admin skips all gates
    const isAdmin = localStorage.getItem("user_role") === "ORIUNDO_ADMIN";
    if (isAdmin) return;

    // If trying to access a phase but has no identity
    if (pathname.startsWith("/phase") && !hasForgedIdentity) {
      router.push("/forge");
    }

    // If in tutorial mode and trying to access a locked phase
    if (isTutorialMode && pathname.startsWith("/phase")) {
      const phaseId = pathname.split("/").pop();
    }
  }, [hasForgedIdentity, isTutorialMode, pathname, router]);

  return <>{children}</>;
}
