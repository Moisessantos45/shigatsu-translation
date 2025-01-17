import Loading from "@/Components/Loading";
import TableRenderContent from "@/Components/TableRenderContent";
import usePageNavigations from "@/Store/PageNavigations";
import useVolumens from "@/Store/UseVolumens";
import { useQuery } from "@tanstack/react-query";

const PageVerVolumenes = () => {
  const { volumens, getVolumens } = useVolumens();
  const { setLength, setPage } = usePageNavigations();

  const getContentVolume = async () => {
    try {
      await getVolumens();
      setLength(volumens.length);
      setPage(1);
    } catch (error) {
      return error;
    }
  };

  const { isLoading } = useQuery({
    queryKey: ["volumensDataAdmin"],
    queryFn: getContentVolume,
    refetchInterval: 60000,
    refetchOnWindowFocus: false,
    retry: 0,
  });

  if (isLoading) return <Loading />;
  return <TableRenderContent dataContent={volumens} typeContent="volumen" />;
};

export default PageVerVolumenes;
