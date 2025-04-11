// store/measureStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type MeasureState = {
  round: number;
  second: number;
  setRound: (round: number) => void;
  setSecond: (second: number) => void;
  increaseSecond: () => void;
  resetSecond: () => void;
  increaseRound: () => void;
};

const useMeasureStore = create<MeasureState>()(
  persist(
    (set, get) => ({
      round: 1,
      second: 0,
      setRound: (round) => set({ round }),
      setSecond: (second) => set({ second }),
      increaseSecond: () => set((state) => ({ second: state.second + 1 })),
      resetSecond: () => set({ second: 0 }),
      increaseRound: () => set((state) => ({ round: state.round + 1 })),
    }),
    { name: 'measure-storage' }
  )
);

export default useMeasureStore;
