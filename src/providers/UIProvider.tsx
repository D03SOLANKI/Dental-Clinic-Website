"use client";

import React, { createContext, useContext, useState } from "react";

interface UIContextType {
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isAdminSidebarOpen: boolean;
  setAdminSidebarOpen: (open: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdminSidebarOpen, setAdminSidebarOpen] = useState(true);

  return (
    <UIContext.Provider
      value={{
        isMobileMenuOpen,
        setMobileMenuOpen,
        isAdminSidebarOpen,
        setAdminSidebarOpen,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}
