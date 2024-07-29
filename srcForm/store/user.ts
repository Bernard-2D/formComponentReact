import { UserInfo } from '@/api/user'
import { create } from 'zustand'

interface State {
  userInfo: UserInfo
}

interface Action {
  setUser: (user: UserInfo) => void
  reset: () => void
}

const initialState: State = {
  userInfo: { email: '', username: '用户', loginName: '', phone: '' }
}

const useUserStore = create<State & Action>()(set => ({
  ...initialState,
  setUser: (user: UserInfo) => {
    set({ userInfo: user })
  },
  reset: () => {
    set(initialState)
  }
}))

export default useUserStore
