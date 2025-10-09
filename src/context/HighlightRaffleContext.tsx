"use client";
import { createContext, useContext, useState } from "react";

interface HighlightContextType {
  highlightId: number | null;
  setHighlightId: (id: number | null) => void;
}

const HighlightRaffleContext = createContext<HighlightContextType>({
  highlightId: null,
  setHighlightId: () => {},
});

export const HighlightRaffleProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [highlightId, setHighlightId] = useState<number | null>(null);
  return (
    <HighlightRaffleContext.Provider value={{ highlightId, setHighlightId }}>
      {children}
    </HighlightRaffleContext.Provider>
  );
};

export const useHighlightRaffle = () => useContext(HighlightRaffleContext);
