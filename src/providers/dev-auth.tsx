'use client';

import React, { createContext, useContext, useState } from 'react';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import type { Identity } from '@dfinity/agent';
import type { Principal } from '@dfinity/principal';

interface DevAuthContextType {
  isAuthenticated: boolean;
  identity: Identity | null;
  principal?: Principal;
  login: () => void;
  logout: () => void;
}

const DevAuthContext = createContext<DevAuthContextType | undefined>(undefined);

// O Provedor que irá gerenciar o estado da nossa identidade local
export const DevAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [identity, setIdentity] = useState<Identity | null>(null);

  // A função de "login" agora simplesmente gera uma nova identidade aleatória
  const login = () => {
    const newIdentity = Ed25519KeyIdentity.generate();
    setIdentity(newIdentity);
  };

  // O logout simplesmente limpa a identidade
  const logout = () => {
    setIdentity(null);
  };

  const isAuthenticated = !!identity;
  const principal = identity?.getPrincipal();

  return (
    <DevAuthContext.Provider value={{ isAuthenticated, identity, principal, login, logout }}>
      {children}
    </DevAuthContext.Provider>
  );
};

// Hook customizado para usar nosso novo contexto
export const useDevAuth = () => {
  const context = useContext(DevAuthContext);
  if (context === undefined) {
    throw new Error('useDevAuth deve ser usado dentro de um DevAuthProvider');
  }
  return context;
};