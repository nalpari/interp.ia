import { create } from 'zustand'
import { combine } from 'zustand/middleware'

export type UserState = {
  loginedUserInfo: {
    id: number
    email: string
    name: string
    image: string
    position: string
    department: string
    job: string
    phone: string
    isActive: boolean
  }
}

type InitialState = {
  loginedUserInfo: {
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
}

const initialState: InitialState = {
  loginedUserInfo: {
    id: 0,
    email: '',
    name: '',
    image: '',
    position: '',
    department: '',
    job: '',
    phone: '',
    isActive: false,
  },
}

export const useUserStore = create(
  combine(
    {
      loginedUserInfo: {
        id: 0,
        email: '',
        name: '',
        image: '',
        position: '',
        department: '',
        job: '',
        phone: '',
        isActive: false,
      },
    },
    (set, get) => ({
      setUser: (nextUser: Partial<UserState>) => set({ loginedUserInfo: nextUser.loginedUserInfo }),
      resetUser: () => set(initialState),
    }),
  ),
)
