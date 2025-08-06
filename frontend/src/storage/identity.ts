import type { Identity } from '@dfinity/agent'
import { Ed25519KeyIdentity } from '@dfinity/identity'
import { LOCAL_STORAGE_KEY } from './config'

export const loadIdentity = (): Identity | null => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (stored) {
    try {
      return Ed25519KeyIdentity.fromParsedJson(JSON.parse(stored))
    } catch {
      console.warn('Erro ao carregar identidade do localStorage')
      return null
    }
  }
  return null
}

export const saveIdentity = (identity: Ed25519KeyIdentity) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(identity.toJSON()))
}