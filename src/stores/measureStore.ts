// store/measureStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type MeasureState = {
  level: number;
  second: number;
  name: string;
  gender: string;
  setLevel: (level: number) => void;
  setSecond: (second: number) => void;
  decreaseSecond: () => void;
  resetSecond: () => void;
  increaseLevel: () => void;
  setName: (name: string) => void;
  setGender: (gender: string) => void;
};

const useMeasureStore = create<MeasureState>()(
  persist(
    (set) => ({
      level: 1,
      second: 60,
      name: '',
      gender: '',
      setLevel: (level) => set({ level }),
      setSecond: (second) => set({ second }),
      resetSecond: () => set({ second: 60 }),
      decreaseSecond: () => set((state) => ({ second: state.second - 1 })),
      increaseLevel: () => set((state) => ({ level: state.level + 1 })),
      setName: (name) => set({ name }),
      setGender: (gender) => set({ gender }),
    }),
    { name: 'measure-storage' }
  )
);

export default useMeasureStore;
