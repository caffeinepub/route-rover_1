import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Destination, DESTINATIONS } from '../data/destinations';

interface OriginLocation {
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface DestinationContextType {
  selectedDestination: Destination | null;
  setSelectedDestination: (destination: Destination | null) => void;
  origin: OriginLocation | null;
  setOrigin: (origin: OriginLocation | null) => void;
}

const DestinationContext = createContext<DestinationContextType | undefined>(undefined);

export function DestinationProvider({ children }: { children: ReactNode }) {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(DESTINATIONS[0]);
  const [origin, setOrigin] = useState<OriginLocation | null>(null);

  return (
    <DestinationContext.Provider
      value={{
        selectedDestination,
        setSelectedDestination,
        origin,
        setOrigin,
      }}
    >
      {children}
    </DestinationContext.Provider>
  );
}

export function useDestination() {
  const context = useContext(DestinationContext);
  if (context === undefined) {
    throw new Error('useDestination must be used within a DestinationProvider');
  }
  return context;
}
