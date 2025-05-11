// store/measureStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type MeasureState = {
  level: number;
  levelTerm: number;
  CustomLevelTerm: number;
  second: number;
  ballCount: number;
  CustomSet: number;
  CustomRep: number;
  pageInfo: string;
  name: string;
  gender: string;
  setLevel: (level: number) => void;
  setLevelTerm: (levelTerm: number) => void;
  setCustomLevelTerm: (CustomLevelTerm: number) => void;
  setSecond: (second: number) => void;
  setballCount: (ballCount: number) => void;
  setCustomSet: (CustomSet: number) => void;
  setCustomRep: (CustomRep: number) => void;
  decreaseSecond: () => void;
  resetSecond: () => void;
  increaseLevel: () => void;
  setPageInfo: (pageInfo: string) => void;
  setName: (name: string) => void;
  setGender: (gender: string) => void;
};

const useMeasureStore = create<MeasureState>()(
  persist(
    (set) => ({
      level: 1,
      second: 60,
      levelTerm: 6000,
      CustomLevelTerm: 6000,
      ballCount: 6,
      CustomSet: 3,
      CustomRep: 10,
      pageInfo: '',
      name: '',
      gender: '',
      setLevel: (level) => set({ level }),
      setLevelTerm: (levelTerm) => set({ levelTerm }),
      setCustomLevelTerm: (CustomLevelTerm) => set({ CustomLevelTerm }),
      setballCount: (ballCount) => set({ ballCount }),
      setCustomSet: (CustomSet) => set({ CustomSet }),
      setCustomRep: (CustomRep) => set({ CustomRep }),
      setSecond: (second) => set({ second }),
      resetSecond: () => set({ second: 6 }),
      decreaseSecond: () => set((state) => ({
        second: state.second > 0 ? state.second - 1 : 0
      })),
      increaseLevel: () => set((state) => ({ level: state.level + 1 })),
      setPageInfo: (pageInfo) => set({ pageInfo }),
      setName: (name) => set({ name }),
      setGender: (gender) => set({ gender }),
    }),
    { name: 'measure-storage' }
  )
);

export default useMeasureStore;
