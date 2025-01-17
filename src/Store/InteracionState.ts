import { create } from "zustand";

interface stateInteraction {
  isSidebarOpen: boolean;
  isDarkMode: boolean;
  activeRoute: string;
  isDrawerOpen: boolean;
  isVisibleModal: boolean;
  confirmDialog: boolean;
  setIsSidebarOpen: (data: boolean) => void;
  setIsDarkMode: (data: boolean) => void;
  setActiveRoute: (data: string) => void;
  setIsDrawerOpen: (data: boolean) => void;
  setIsVisibleModal: (data: boolean) => void;
  setConfirmDialog: (data: boolean) => void;
}

const useInteractionStore = create<stateInteraction>((set) => ({
  isSidebarOpen: true,
  isDarkMode: false,
  activeRoute: "home",
  isDrawerOpen: false,
  isVisibleModal: false,
  confirmDialog: false,
  setIsSidebarOpen: (data) => set({ isSidebarOpen: data }),
  setIsDarkMode: (data) => set({ isDarkMode: data }),
  setActiveRoute: (data) => set({ activeRoute: data }),
  setIsDrawerOpen: (data) => set({ isDrawerOpen: data }),
  setIsVisibleModal: (data) => set({ isVisibleModal: data }),
  setConfirmDialog: (data) => set({ confirmDialog: data }),
}));

export default useInteractionStore;
