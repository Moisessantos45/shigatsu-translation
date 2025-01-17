import urlBackend from "@/Config/UrlBackend";
import ErrorHandler from "@/Services/ErrorHandler";
import { fromToJsonMapVol } from "@/Services/userService";
import { volumenData, volumenDataWithNotContentType } from "@/Types/Types";
import { toastify } from "@/Utils/utils";
import { create } from "zustand";
import { getDocs, collection } from "firebase/firestore/lite";
import { dbFirebaseLite } from "@/Config/firebase";

interface StateVolumens {
  volumens: volumenData[];
  volumenData: volumenData;
  lastVolumen: volumenData[];
  setVolumens: (volumens: volumenData[]) => void;
  setVolumenData: (volumenData: volumenData) => void;
  setLastVolumen: (lastVolumen: volumenData[]) => void;
  getVolumens: () => Promise<volumenData[]>;
  addVolumen: (volumen: volumenDataWithNotContentType) => Promise<void>;
  updateVolumen: (
    volumen: volumenDataWithNotContentType,
    id: string
  ) => Promise<void>;
  removeVolumen: (id: string) => Promise<void>;
}

const useVolumens = create<StateVolumens>((set, get) => ({
  volumens: [],
  volumenData: {} as volumenData,
  lastVolumen: [],
  setVolumens: (volumens) => set({ volumens }),
  setVolumenData: (volumenData) => set({ volumenData }),
  setLastVolumen: (lastVolumen) => set({ lastVolumen }),
  getVolumens: async () => {
    try {
      const q = await getDocs(collection(dbFirebaseLite, "volumenesNovela"));
      const data = q.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const mapToJson = data.map(fromToJsonMapVol);
      const sortVolumens = mapToJson.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
      set({ volumens: mapToJson });
      set({ lastVolumen: sortVolumens });
      return mapToJson;
    } catch (error) {
      ErrorHandler(error);
      return [];
    }
  },
  addVolumen: async (volumen) => {
    try {
      const data = await urlBackend.post(`Volumenes/volumenes/${1}`, volumen);
      const res = data.data ? data.data : [];
      set((state) => ({ volumens: [...state.volumens, res] }));
      toastify("Volumen agregado", true);
    } catch (error) {
      ErrorHandler(error);
    }
  },
  updateVolumen: async (volumen, id) => {
    try {
      const data = await urlBackend.put(`Volumenes/volumenes/${id}`, volumen);
      const msg = data.data ? data.data.msg : "Volumen actualizado";
      toastify(msg, true);
    } catch (error) {
      ErrorHandler(error);
    }
  },
  removeVolumen: async (id) => {
    try {
      const data = await urlBackend.delete(`Volumenes/volumenes/${id}`);
      const msg = data.data ? data.data.msg : "Volumen eliminado";
      const newDataVolumen = get().volumens.filter((item) => item.id !== id);
      set({ volumens: newDataVolumen });
      toastify(msg, true);
    } catch (error) {
      ErrorHandler(error);
    }
  },
}));

export default useVolumens;
