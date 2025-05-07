// store/measureStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type MeasureState = {
  level: number;
  levelTerm: number;
  second: number;
  ballCount: number;
  CustomSet: number;
  CustomRep: number;
  name: string;
  gender: string;
  setLevel: (level: number) => void;
  setLevelTerm: (levelTerm: number) => void;
  setSecond: (second: number) => void;
  setballCount: (ballCount: number) => void;
  setCustomSet: (CustomSet: number) => void;
  setCustomRep: (CustomRep: number) => void;
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
      levelTerm: 6,
      ballCount: 6,
      CustomSet: 0,
      CustomRep: 0,
      name: '',
      gender: '',
      setLevel: (level) => set({ level }),
      setLevelTerm: (levelTerm) => set({ levelTerm }),
      setballCount: (ballCount) => set({ ballCount }),
      setCustomSet: (CustomSet) => set({ CustomSet }),
      setCustomRep: (CustomRep) => set({ CustomRep }),
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
