import { createContext, useContext, useEffect, useState } from 'react'
import { Ed25519KeyIdentity } from '@dfinity/identity'
import type { Principal } from '@dfinity/principal'
import type { Identity } from '@dfinity/agent'
import { loadIdentity, saveIdentity } from '@/storage'

interface DevAuthContextType {
  isAuthenticated: boolean
  identity?: Identity
  principal?: Principal
  login: () => void
  logout: () => void
}

const DevAuthContext = createContext<DevAuthContextType | undefined>(undefined)

export const DevAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [identity, setIdentity] = useState<Identity | undefined>(undefined)

  const isAuthenticated = !!identity
  const principal = identity?.getPrincipal()

  const login = () => {
    const savedIdentity = loadIdentity()
    if (savedIdentity) {
      setIdentity(savedIdentity)
      return
    }

    if (!identity) {
      const newIdentity = Ed25519KeyIdentity.generate()
      saveIdentity(newIdentity)
      setIdentity(newIdentity)
    }
  }

  const logout = () => {
    setIdentity(undefined)
  }

  useEffect(() => {
    const savedIdentity = loadIdentity()
    if (savedIdentity) setIdentity(savedIdentity)
  }, [])

  return (
    <DevAuthContext.Provider value={{ isAuthenticated, identity, principal, login, logout }}>
      {children}
    </DevAuthContext.Provider>
  )
}

export const useDevAuth = () => {
  const ctx = useContext(DevAuthContext)
  if (!ctx) throw new Error('useDevAuth precisa ser usado dentro do DevAuthProvider')
  return ctx
}
