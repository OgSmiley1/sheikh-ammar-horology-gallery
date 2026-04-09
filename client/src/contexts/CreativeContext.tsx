import React, { createContext, useContext, useState, useEffect } from "react";

type CreativeMode = "classic" | "cinematic";

interface CreativeContextType {
  mode: CreativeMode;
  isCinematic: boolean;
  toggleMode: () => void;
}

const CreativeContext = createContext<CreativeContextType | undefined>(undefined);

const STORAGE_KEY = "sheikh-ammar-creative-mode";

export function CreativeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<CreativeMode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored === "cinematic" ? "cinematic" : "classic") as CreativeMode;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
    document.documentElement.classList.toggle("cinematic", mode === "cinematic");
  }, [mode]);

  const toggleMode = () => setMode((prev) => (prev === "classic" ? "cinematic" : "classic"));

  return (
    <CreativeContext.Provider value={{ mode, isCinematic: mode === "cinematic", toggleMode }}>
      {children}
    </CreativeContext.Provider>
  );
}

export function useCreative() {
  const context = useContext(CreativeContext);
  if (!context) {
    throw new Error("useCreative must be used within CreativeProvider");
  }
  return context;
}
