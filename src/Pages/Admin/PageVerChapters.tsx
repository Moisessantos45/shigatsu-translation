import TableRenderContent from "@/Components/TableRenderContent";
import usePageNavigations from "@/Store/PageNavigations";
import useChapters from "@/Store/UseChapters";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/Components/Loading";

const PageVerChapters = () => {
  const { chapters, getChapters } = useChapters();
  const { setLength, setPage } = usePageNavigations();

  const getContentChapters = async () => {
    try {
      await getChapters();
      setLength(chapters.length);
      setPage(1);
      return chapters;
    } catch (error) {
      return error;
    }
  };

  const { isLoading } = useQuery({
    queryKey: ["chaptersDataAdmin"],
    queryFn: getContentChapters,
    refetchInterval: 60000,
    refetchOnWindowFocus: false,
    retry: 0,
  });

  if (isLoading) return <Loading />;
  return <TableRenderContent dataContent={chapters} typeContent="capitulo" />;
};

export default PageVerChapters;
