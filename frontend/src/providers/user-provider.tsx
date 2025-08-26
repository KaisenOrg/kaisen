import { createContext, useContext, useEffect, useMemo } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useActor } from '@/lib/agent'
import { toMotokoUser, toUserData } from '@/lib/mappers'
import { useUserStore } from '@/stores/useUserStore'
import { useModalStore } from '@/stores/useModalStore'
import type { UserData } from '@/types'
import type { Principal } from '@dfinity/principal'
import type { Identity } from '@dfinity/agent'

type ContextType = {
  user: UserData | null
  isAuthenticated: boolean
  identity?: Identity
  principal?: Principal
  isLoading: boolean
  error: string | null
  login: () => void
  logout: () => void
  refetch: () => Promise<void>
  fetchUserByIdentity: (identity: string) => Promise<UserData | null | undefined>
  createUser: (user: Partial<UserData>) => Promise<void>
  updateUser: (user: Partial<UserData>) => Promise<void>
  deleteUser: (identity: string) => Promise<void>
}

const UserContext = createContext<ContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { identity, isAuthenticated, login, logout, principal } = useAuth()
  const { setUser, user, clearUser, isLoading, setLoading, error, setError } = useUserStore()
  const { open, close } = useModalStore()
  const usersActor = useActor('users_backend')

  const refetch = async () => {
    if (isLoading || !usersActor || !principal) return

    setError(null)
    setLoading(true)

    try {
      const res = await usersActor.getUser(principal.toText())
      if ('ok' in res) {
        setUser(toUserData(res.ok))
      } else {
        setError(res.err)
      }
    } catch (e) {
      setError('Erro ao buscar usuário')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserByIdentity = async (identity: string) => {
    if (isLoading || !usersActor) return

    setError(null)
    setLoading(true)

    try {
      const res = await usersActor.getUser(identity)
      if ('ok' in res) {
        return toUserData(res.ok)
      } else {
        setError(res.err)
      }
    } catch (e) {
      setError('Erro ao buscar usuário por identity')
    } finally {
      setLoading(false)
    }

    return null
  }

  const createUser = async (partial: Partial<UserData>) => {
    
    if (!usersActor || !principal || !identity || isLoading) return

    setError(null)
    setLoading(true)

    try {
      const newUser: UserData = {
        ...partial,
        principal,
        identity: identity.getPrincipal().toText(),
        certificates: [],
        completedTracks: [],
        createdTracks: [],
        followers: [],
        following: [],
        inProgressTracks: [],
        username: partial.username || `user-${Math.floor(Math.random() * 1000)}`,
        nickname: partial.nickname || 'Usuário do Kaisen',
      }

      const res = await usersActor.createUser(toMotokoUser(newUser))
      if ('err' in res) setError(res.err)
      else await refetch()
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (partial: Partial<UserData>) => {
    if (!usersActor || !user || isLoading) return

    setError(null)
    setLoading(true)

    try {
      const mergedUser: UserData = { ...user, ...partial }
      const res = await usersActor.updateUser(toMotokoUser(mergedUser))
      if ('err' in res) setError(res.err)
      else await refetch()
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (identity: string) => {
    if (!usersActor || isLoading) return

    setError(null)
    setLoading(true)

    try {
      const res = await usersActor.deleteUser(identity)
      if ('err' in res) setError(res.err)
      else clearUser()
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    if (isLoading) open({ type: 'loading' })
    else close()
  }, [isLoading])

  useEffect(() => {
    if (isAuthenticated && !user && usersActor) {
      refetch()
    }
  }, [isAuthenticated, user, usersActor])

  const value = useMemo(() => ({
    user, isAuthenticated,
    identity, principal,
    isLoading, error,
    login, logout,
    refetch, fetchUserByIdentity,
    createUser, updateUser, deleteUser
  }), [
    user, isAuthenticated,
    identity, principal,
    isLoading, error,
    login, logout,
    refetch, fetchUserByIdentity,
    createUser, updateUser, deleteUser
  ])

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser deve ser usado dentro de UserProvider')
  return ctx
}
