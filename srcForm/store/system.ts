import { systemInfo } from '@/config'
import { create } from 'zustand'

interface State {
  systemInfo: typeof systemInfo
}

interface Action {
  setSystemInfo: (sys: typeof systemInfo) => void
  reset: () => void
}

const initialState: State = {
  systemInfo: systemInfo
}

const useSystemStore = create<State & Action>()(set => ({
  ...initialState,
  setSystemInfo: (sys: typeof systemInfo) => {
    set({ systemInfo: sys })
  },
  reset: () => {
    set(initialState)
  }
}))

export default useSystemStore
