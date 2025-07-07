"use client";

import { createContext, useContext } from "react";

type SalonProps = {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

const SalonContext = createContext<SalonProps | null>(null);

export const useSalon = () => {
  const context = useContext(SalonContext);

  if (!context) {
    throw new Error("useSalon must be used within a SalonProvider");
  }

  return context;
};

type SalonProviderProps = {
  children: React.ReactNode;
  salon: SalonProps;
};

export const SalonProvider = ({ children, salon }: SalonProviderProps) => {
  return (
    <SalonContext.Provider value={salon}>{children}</SalonContext.Provider>
  );
};
