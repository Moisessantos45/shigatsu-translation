import { create } from "zustand";
import { siteConfig } from "../Types/Types";
import UrlBackendPrivate from "../Config/UrlBackendPrivate";
import { toastify } from "@/Utils/utils";
import supabase from "@/Config/supabase";

type StateSiteHome = {
  dataSite: siteConfig;
  titleHeader: string;
  titleTextHeader: string;
  bg_header: string;
  bg_banner: string;
  heigthHeader: boolean;
  hiddenHeader: boolean;
  hiddenBanner: boolean;
  hiddenHeaderMenu: boolean;
  isMaintenanceMode: string;
  setDataSite: (data: siteConfig) => void;
  setTitleHeader: (data: string) => void;
  setTitleTextHeader: (data: string) => void;
  setBg_header: (data: string) => void;
  setBg_banner: (data: string) => void;
  setHeigthHeader: (data: boolean) => void;
  setHiddenHeader: (data: boolean) => void;
  setHiddenBanner: (data: boolean) => void;
  setHiddenHeaderMenu: (data: boolean) => void;
  setMaintenanceMode: (data: string) => void;
  fetchSiteData: () => Promise<siteConfig>;
  changeStatusSite: (status: string) => Promise<void>;
};

const usePageConfigStore = create<StateSiteHome>()((set) => ({
  dataSite: {} as siteConfig,
  titleHeader: "shigatsuTranslations",
  titleTextHeader: "Llena de historias tu vida con Shigatsu Translations",
  bg_header:
    "https://cdn.usegalileo.ai/sdxl10/71e6ef2e-51c2-415a-9196-4bbd126098ed.png",
  bg_banner:
    "https://res.cloudinary.com/dtkskpitc/image/upload/v1733477517/bg_perfiles/ojpnfvzkyqu1fzuqtznl.png",
  heigthHeader: false,
  hiddenHeader: false,
  hiddenBanner: true,
  hiddenHeaderMenu: false,
  isMaintenanceMode: "",
  setDataSite: (data) => set({ dataSite: data }),
  setTitleHeader: (data) => set({ titleHeader: data }),
  setTitleTextHeader: (data) => set({ titleTextHeader: data }),
  setBg_header: (data) => set({ bg_header: data }),
  setBg_banner: (data) => set({ bg_banner: data }),
  setHeigthHeader: (data) => set({ heigthHeader: data }),
  setHiddenHeader: (data) => set({ hiddenHeader: data }),
  setHiddenBanner: (data) => set({ hiddenBanner: data }),
  setHiddenHeaderMenu: (data) => set({ hiddenHeaderMenu: data }),
  setMaintenanceMode: (data) => set({ isMaintenanceMode: data }),
  fetchSiteData: async (): Promise<siteConfig> => {
    try {
      const { data } = await supabase.from("configSite").select("*").single();
      set({ dataSite: data });
      set({ bg_header: data.backgroud });
      set({ titleHeader: data.titleSiteWeb });
      set({ titleTextHeader: data.mensajeSite });
      set({ isMaintenanceMode: JSON.stringify(data.isMaintenance) });
      return data;
    } catch (error) {
      return {} as siteConfig;
    }
  },
  changeStatusSite: async (status: string) => {
    try {
      await UrlBackendPrivate.patch(`PanelAdmin/getConfig?status=${status}`);
      toastify("Status changed", true);
      set({ isMaintenanceMode: status });
    } catch (error) {
      return;
    }
  },
}));

export default usePageConfigStore;
