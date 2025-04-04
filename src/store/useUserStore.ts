import { create } from 'zustand'

export type UserState = {
  id: number
  email: string
  name: string
  image: string
  position: string
  department: string
  job: string
  phone: string
  isActive: boolean
  setUser: (user: UserState) => void
  resetUser: () => void
}

type InitialState = {
  id: 0
  email: ''
  name: ''
  image: ''
  position: ''
  department: ''
  job: ''
  phone: ''
  isActive: false
}

const initialState: InitialState = {
  id: 0,
  email: '',
  name: '',
  image: '',
  position: '',
  department: '',
  job: '',
  phone: '',
  isActive: false,
}

export const useUserStore = create<UserState>((set) => ({
  ...initialState,
  setUser: (user: UserState) => set(user),
  resetUser: () => set(initialState),
}))
