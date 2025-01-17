import { useState } from "react";
import { dbFirebaseLite } from "@/Config/firebase";
import { getDoc, doc } from "firebase/firestore/lite";
import Descripcion from "@/Components/Section/Descripcion";
import GaleryPersonajes from "@/Components/Section/GaleryPersonajes";
import Personajes from "@/Components/Section/Personajes";
import VolumenesNovel from "@/Components/Section/VolumenesNovel";
import { novelData } from "@/Types/Types";
import { useNavigate, useParams } from "react-router-dom";
import AcordionCapitulos from "@/Components/Section/AcordionCapitulos";
import usePageConfigStore from "@/Store/StateSiteHome";
import Loading from "@/Components/Loading";
import { fromToJsonMapNovel } from "@/Services/userService";
import { useQuery } from "@tanstack/react-query";

let initialNovelData: novelData;

const PageNovel = (): JSX.Element => {
  const { setBg_header, setTitleHeader, setTitleTextHeader, setHiddenBanner } =
    usePageConfigStore();
  const { novelId } = useParams<{ novelId: string }>();
  const [novelData, setNovelData] = useState<novelData>(initialNovelData);
  // const [isLoading, setLoading] = useState<boolean>(true);

  const redirect = useNavigate();
  const getNovelData = async (): Promise<void> => {
    try {
      if (!novelId) return redirect("/404");
      const q = doc(dbFirebaseLite, "novelasData", novelId);
      const documents = await getDoc(q);
      if (!documents.exists()) return redirect("/404");

      const dataRes = documents.data();
      const data: novelData = fromToJsonMapNovel(dataRes);
      setNovelData(data);
      setTitleHeader(data.titleNovel);
      setTitleTextHeader("");
      setBg_header(data.background);
      setHiddenBanner(false);
    } catch (error) {
      redirect("/404");
    }
    // setLoading(false);
  };

  const { isLoading } = useQuery({
    queryKey: ["novel", novelId],
    queryFn: getNovelData,
    refetchInterval: 3000000,
    refetchOnWindowFocus: false,
    staleTime: 3000000,
    retry: 0,
  });

  if (isLoading) return <Loading />;
  return (
    <>
      <Descripcion dataNovelInfo={novelData} />

      <Personajes dataNovelPersonajes={novelData.personajes} />

      <AcordionCapitulos />

      <GaleryPersonajes galeryImages={novelData.ilustracionesAtuales} />

      <VolumenesNovel />
    </>
  );
};

export default PageNovel;
