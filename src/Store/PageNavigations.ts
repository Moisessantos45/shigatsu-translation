import { create } from "zustand";

interface statePageNavigations {
  length: number;
  itemsPerPage: number;
  page: number;
  setLength: (length: number) => void;
  setPage: (page: number) => void;
  nextPageNavigation: () => void;
  prevPageNavigation: () => void;
}

const usePageNavigations = create<statePageNavigations>()((set, get) => ({
  length: 0,
  itemsPerPage: 6,
  page: 1,
  setLength: (length) => set({ length }),
  setPage: (page) => set({ page }),
  nextPageNavigation: () => {
    const { page } = get();
    set({ page: page + 1 });
  },
  prevPageNavigation: () => {
    const { page } = get();
    set({ page: page - 1 });
  },
}));

export default usePageNavigations;
