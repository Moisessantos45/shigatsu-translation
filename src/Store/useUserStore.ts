import { create } from "zustand";
import {
  chapterDataWithoutContentChapter,
  volumenDataWithoutVolumen,
  TypeDataNotification,
  userData,
} from "../Types/Types";
import UrlBackendPrivate from "../Config/UrlBackendPrivate";
import { redirect } from "react-router-dom";
import { toastify } from "@/Utils/utils";
import ErrorHandler from "@/Services/ErrorHandler";
import supabase from "@/Config/supabase";
import { fromToJsonMapUser } from "@/Services/userService";

type stateUser = {
  dataUser: userData;
  dataUpdateUser: userData;
  dataLastVolumen: volumenDataWithoutVolumen[];
  dataLastChapter: chapterDataWithoutContentChapter[];
  totalUsers: number;
  loadingSite: boolean;
  modalVisible: boolean;
  dataNotification: TypeDataNotification[];
  numberNotification: number;
  activeListClass: boolean;
  setDataUser: (data: userData) => void;
  setDataUpdateUser: (data: userData) => void;
  setDataLastVolumen: (data: volumenDataWithoutVolumen) => void;
  setDataLastChapter: (data: chapterDataWithoutContentChapter) => void;
  setTotalUsers: (data: number) => void;
  setLoadingSite: (data: boolean) => void;
  setModalVisible: (data: boolean) => void;
  setDataNotification: (data: TypeDataNotification) => void;
  setNumberNotification: (data: number) => void;
  setActiveListClass: (data: boolean) => void;
  changeUserState: (id: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  fetchUserData: () => Promise<void>;
  verifyUser: () => Promise<boolean>;
};

const useUserStore = create<stateUser>()((set) => ({
  dataUser: {} as userData,
  dataUpdateUser: {} as userData,
  dataLastVolumen: [],
  dataLastChapter: [],
  totalUsers: 0,
  loadingSite: true,
  modalVisible: false,
  dataNotification: [],
  numberNotification: 0,
  activeListClass: false,
  setDataUser: (data) => set({ dataUser: data }),
  setDataUpdateUser: (data) => set({ dataUpdateUser: data }),
  setDataLastVolumen: (data) => set({ dataLastVolumen: [data] }),
  setDataLastChapter: (data) => set({ dataLastChapter: [data] }),
  setTotalUsers: (data) => set({ totalUsers: data }),
  setLoadingSite: (data) => set({ loadingSite: data }),
  setModalVisible: (data) => set({ modalVisible: data }),
  setDataNotification: (data) => set({ dataNotification: [data] }),
  setNumberNotification: (data) => set({ numberNotification: data }),
  setActiveListClass: (data) => set({ activeListClass: data }),
  changeUserState: async (id) => {
    try {
      const response = await UrlBackendPrivate.patch(
        `PanelAdmin/StatusUser/${id}`
      );
      const msg = response.data
        ? response.data.msg
        : "Error al cambiar el estado del usuario";
      toastify(msg, true);
    } catch (error) {
      ErrorHandler(error);
    }
  },
  deleteUser: async (id) => {
    const token = localStorage.getItem("tokenInServer") || "";
    if (token === "") {
      set({ dataUser: {} as userData });
      set({ loadingSite: false });
      redirect("/login");
      return;
    }
    try {
      const response = await UrlBackendPrivate.delete(
        `PanelAdmin/deleteUser/${id}`
      );

      const msg = response.data
        ? response.data.msg
        : "Se ha eliminado el usuario correctamente";
      toastify(msg, true);
    } catch (error) {
      ErrorHandler(error);
    }
  },
  fetchUserData: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        redirect("/login");
      }

      const [resUser, resUserSize] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", data.user?.id).single(),
        supabase.from("profiles").select("id"),
      ]);

      const newTotalUsers: number = resUserSize.data
        ? resUserSize.data.length
        : 0;
      const dataUser = fromToJsonMapUser({
        ...resUser.data,
        email: data.user?.email,
      });

      set({ dataUser });
      set({ totalUsers: newTotalUsers });
      set({ loadingSite: false });
    } catch (error) {
      redirect("/login");
      return;
    }
  },
  verifyUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      return false;
    }
    return data.user.id ? true : false;
  },
}));

export default useUserStore;
