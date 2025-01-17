import { ChevronDown } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { dbFirebaseLite } from "@/Config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore/lite";
import { chapterData } from "@/Types/Types";
import { useRef, useState } from "react";
// import Loading from "../Loading";
import { fromToJsonMapChapter } from "@/Services/userService";
import { useQuery } from "@tanstack/react-query";

const AcordionCapitulos = (): JSX.Element => {
  const { novelId } = useParams<{
    novelId: string;
  }>();

  const [openChapter, setOpenChapter] = useState<number | null>(null);
  const capitulosGrupo = useRef<chapterData[][]>([]);
  // const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const transformChapters = (data: chapterData[]) => {
    capitulosGrupo.current = [];
    const volumeGroups = data.reduce((acc, chapter) => {
      const volume = chapter.volumenPertenece;
      if (!acc[volume]) acc[volume] = [];
      acc[volume].push(chapter);
      return acc;
    }, {} as Record<string, chapterData[]>);

    const sortedVolumes = Object.keys(volumeGroups).sort(
      (a, b) => Number(a) - Number(b)
    );

    sortedVolumes.forEach((volume) => {
      const sortedChapters = volumeGroups[volume].sort(
        (a, b) => Number(a.capitulo) - Number(b.capitulo)
      );
      capitulosGrupo.current.push(sortedChapters);
    });
  };

  const getChapters = async () => {
    try {
      const q = query(
        collection(dbFirebaseLite, "chaptersNovels"),
        where("novelId", "==", novelId)
      );
      const documents = await getDocs(q);
      const data = documents.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const mappedChapters = data.map(fromToJsonMapChapter);

      transformChapters(mappedChapters);
    } catch (error) {
      navigate("/404");
    }
  };

  const { isLoading } = useQuery({
    queryKey: ["chapters", novelId],
    queryFn: getChapters,
    refetchInterval: 3000000,
    refetchOnWindowFocus: false,
    staleTime: 3000000,
    retry: 0,
  });

  const toggleChapter = (chapterId: number) => {
    setOpenChapter(openChapter === chapterId ? null : chapterId);
  };

  return (
    <div className={`w-10/12 flex-col margin ${isLoading ? "hidden" : "flex"}`}>
      <div className="w-full">
        {capitulosGrupo.current.length > 0 ? (
          <>
            <div className="w-full flex justify-center m-2">
              <h1 className="text-xl font-bold text-white">
                Capitulos Disponibles &quot;Novel&quot;
              </h1>
            </div>
            {capitulosGrupo.current.map((grupo, i) => (
              <div key={`group-${i}`} className="mb-4">
                <button
                  className="flex justify-between items-center w-full p-4 bg-gray-800 hover:bg-gray-700 transition-colors duration-200 rounded-lg"
                  onClick={() => toggleChapter(i)}
                >
                  <span className="text-lg font-semibold text-white">
                    {`Volumen ${grupo[0].volumenPertenece}`}
                  </span>
                  <ChevronDown
                    className={`transform transition-transform duration-200 ${
                      openChapter === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openChapter === i && (
                  <div className="p-4 bg-gray-900 rounded-b-lg mt-1">
                    {grupo.map((char, index) => (
                      <div key={`char-${index}`} className="mb-2">
                        <Link
                          to={`/leer/${novelId}/${char.volumenPertenece}/${
                            char.capitulo
                          }?capitulo=${encodeURIComponent(
                            char.nombreCapitulo
                          )}&novela=${encodeURIComponent(char.nombreNovela)}`}
                          className="flex items-center md:text-sm text-[10px] md:py-3 py-4 text-white w-full"
                        >
                          {`Vol ${char.volumenPertenece} - Capítulo ${char.capitulo} - ${char.nombreCapitulo}`}
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </>
        ) : (
          <span>No hay capítulos disponibles.</span>
        )}
      </div>
    </div>
  );
};

export default AcordionCapitulos;
