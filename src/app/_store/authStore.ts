import { create } from 'zustand'

interface AuthStore {
  isLoggedIn: boolean
  setLoggedIn: (value: boolean) => void
}

const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: false,
  setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
}))

export default useAuthStore
