import { getSession, setSession } from '@/utils/storage'
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface State {
  token: string
  setToken: (token: string) => void
}

const TokenKey = 'token'

const useTokenStore = create<State>()(
  subscribeWithSelector(set => ({
    token: getSession(TokenKey),
    setToken: (token: string) => {
      setSession(TokenKey, token)
      set({ token })
    }
  }))
)

export function getToken() {
  return useTokenStore.getState().token
}

export function clearToken() {
  useTokenStore.getState().setToken('')
}

export default useTokenStore
