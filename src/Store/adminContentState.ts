import { userData } from "@/Types/Types";
import { create } from "zustand";

type stateAdminContent = {
  socket: string | null;
  modalEditVolumen: boolean;
  deleteContent: boolean;
  modalConfirmDelete: boolean;
  mostrarModalQrCode: boolean;
  provideDataUser: userData;
  setModalEditVolumen: (data: boolean) => void;
  setDeleteContent: (data: boolean) => void;
  setModalConfirmDelete: (data: boolean) => void;
  setMostrarModalQrCode: (data: boolean) => void;
  setProvideDataUser: (data: userData) => void;
};

const useAdminContentStore = create<stateAdminContent>()((set) => ({
  socket: null,
  modalEditVolumen: false,
  deleteContent: false,
  modalConfirmDelete: false,
  mostrarModalQrCode: false,
  provideDataUser: {} as userData,
  setDeleteContent: (data) => set({ deleteContent: data }),
  setModalEditVolumen: (data) => set({ modalEditVolumen: data }),
  setModalConfirmDelete: (data) => set({ modalConfirmDelete: data }),
  setMostrarModalQrCode: (data) => set({ mostrarModalQrCode: data }),
  setProvideDataUser: (data) => set({ provideDataUser: data }),
}));

export default useAdminContentStore;
