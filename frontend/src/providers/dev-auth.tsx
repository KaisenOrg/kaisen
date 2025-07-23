import { createContext, useContext, useEffect, useState } from "react";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import type { Identity } from "@dfinity/agent";
import type { Principal } from "@dfinity/principal";

const LOCAL_STORAGE_KEY = "kaizen-dev-auth";

interface DevAuthContextType {
  isAuthenticated: boolean;
  identity: Identity | null;
  principal?: Principal;
  login: () => void;
  logout: () => void;
}

const DevAuthContext = createContext<DevAuthContextType | undefined>(undefined);

const loadIdentity = (): Identity | null => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      return Ed25519KeyIdentity.fromParsedJson(JSON.parse(stored));
    } catch {
      console.warn("Erro ao carregar identidade do localStorage");
      return null;
    }
  }
  return null;
};

const saveIdentity = (identity: Ed25519KeyIdentity) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(identity.toJSON()));
};

export const DevAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [identity, setIdentity] = useState<Identity | null>(null);

  const isAuthenticated = !!identity;
  const principal = identity?.getPrincipal();

  const login = () => {
    const savedIdentity = loadIdentity();
    if (savedIdentity) {
      setIdentity(savedIdentity);
      return;
    }

    if (!identity) {
      const newIdentity = Ed25519KeyIdentity.generate();
      saveIdentity(newIdentity);
      setIdentity(newIdentity);
    }
  };

  const logout = () => {
    setIdentity(null);
  };

  useEffect(() => {
    const savedIdentity = loadIdentity();
    if (savedIdentity) {
      setIdentity(savedIdentity);
    }
  }, []);

  return (
    <DevAuthContext.Provider value={{ isAuthenticated, identity, principal, login, logout }}>
      {children}
    </DevAuthContext.Provider>
  );
};

export const useDevAuth = () => {
  const ctx = useContext(DevAuthContext);
  if (!ctx) throw new Error("useDevAuth precisa ser usado dentro do DevAuthProvider");
  return ctx;
};
