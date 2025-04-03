import { create } from "zustand";

type CountState = {
  count: number;
  increment: () => void;
  decrement: () => void;
  paramSetting: (param: Partial<CountState>) => void;
  resetCount: () => void;
};

type InitialState = {
  count: number;
};

const initialState: InitialState = {
  count: 0,
};

export const useCountStore = create<CountState>((set) => ({
  ...initialState,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  paramSetting: (param: Partial<CountState>) => set(param),
  resetCount: () => set(initialState),
}));
