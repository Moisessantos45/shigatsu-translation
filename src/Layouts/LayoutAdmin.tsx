import { Navigate, Outlet } from "react-router-dom";
import useUserStore from "../Store/useUserStore";
import Loading from "../Components/Loading";
import { Suspense } from "react";
import Slider from "@/Components/UI/Slider";
import { useQuery } from "@tanstack/react-query";
import usePageConfigStore from "../Store/StateSiteHome";
import useNovels from "@/Store/UseNovels";
import useInteractionStore from "@/Store/InteracionState";
import HeaderAdmin from "@/Headers/HeaderAdmin";
import useChapters from "@/Store/UseChapters";
import useVolumens from "@/Store/UseVolumens";

const LayoutAdmin = (): JSX.Element => {
  const { isSidebarOpen, isDarkMode } = useInteractionStore();
  const { dataUser, fetchUserData } = useUserStore();
  const { fetchSiteData } = usePageConfigStore();
  const { getNovels } = useNovels();
  const { getChapters } = useChapters();
  const { getVolumens } = useVolumens();

  const getDataAdmin = async () => {
    try {
      await Promise.allSettled([
        fetchUserData(),
        fetchSiteData(),
        getNovels(),
        getChapters(),
        getVolumens(),
      ]);
    } catch (error) {
      return error;
    }
  };

  const { isLoading } = useQuery({
    queryKey: ["siteDataAdmin"],
    queryFn: getDataAdmin,
    refetchInterval: 3000000,
    refetchOnWindowFocus: false,
    staleTime: 3000000,
    retry: 0,
  });

  if (isLoading) return <Loading />;
  return (
    <>
      <Slider />
      {/* Header */}
      <HeaderAdmin />
      <main
        className={`md:relative w-full z-10 p-2 ${
          isSidebarOpen
            ? "sm:w-[calc(100%-256px)] sm:left-[256px]"
            : "sm:w-[calc(100%-0px)] sm:left-[0px]"
        } transition-all duration-300 ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        }
    `}
      >
        {dataUser?.id && dataUser.id ? (
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        ) : (
          <Navigate to="/login" />
        )}
      </main>
    </>
  );
};

export default LayoutAdmin;
