import { create } from 'zustand';

const useZoneStore = create((set) => ({
  currentZone: null,
  previousZone: null,
  allZones: [],
  userCount: 0,

  setCurrentZone: (zone) =>
    set((state) => ({ previousZone: state.currentZone, currentZone: zone })),
  setAllZones: (zones) => set({ allZones: zones }),
  setUserCount: (count) => set({ userCount: count }),
}));

export default useZoneStore;
