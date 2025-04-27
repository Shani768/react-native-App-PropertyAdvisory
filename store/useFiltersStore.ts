// src/store/useFiltersStore.ts
import { create } from "zustand";

interface FiltersState {
  houseType: string;
  minRooms: number;
  maxRooms: number;
  minBathrooms: number;
  maxBathrooms: number;
  selectedFurnishing: string;
  setFilters: (filters: Partial<FiltersState>) => void;
}

export const useFiltersStore = create<FiltersState>((set) => ({ 
  houseType: "",
  minRooms: 1,
  maxRooms: 1,
  minBathrooms: 1,
  maxBathrooms: 1,
  selectedFurnishing: "",
  setFilters: (filters) => set((state) => ({ ...state, ...filters })),
}));
