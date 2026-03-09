// store/useProductStore.ts
import { create } from 'zustand';

interface ProductState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useShopProductStore = create<ProductState>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));