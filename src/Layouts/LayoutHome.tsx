import { Navigate, Outlet } from "react-router-dom";
import HeaderHome from "../Headers/HeaderHome";
import Footer from "../Components/Footer";
import BannerHome from "../Components/Section/BannerHome";
import usePageConfigStore from "../Store/StateSiteHome";
import { Suspense, useEffect, useState } from "react";
import Loading from "@/Components/Loading";
import { LatestChapters } from "@/Components/Section/LatestChapters";
import useNovels from "@/Store/UseNovels";
import useChapters from "@/Store/UseChapters";

const LayoutHome = (): JSX.Element => {
  const { hiddenBanner, isMaintenanceMode } = usePageConfigStore();
  const { getNovels } = useNovels();
  const { getChapters } = useChapters();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getContentDocs = async () => {
    try {
      await Promise.all([getNovels(), getChapters()]);
      setIsLoading(false);
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    getContentDocs();
  }, []);

  if (isLoading) return <Loading />;
  return (
    <>
      {isMaintenanceMode === "true" ? (
        <Navigate to="/maintenance" replace={true} />
      ) : (
        <>
          <HeaderHome />
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>

          {hiddenBanner && <BannerHome />}
          <LatestChapters />
          <Footer />
        </>
      )}
    </>
  );
};

export default LayoutHome;
