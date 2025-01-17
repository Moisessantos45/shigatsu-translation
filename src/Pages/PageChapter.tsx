import { useEffect, useRef, useState } from "react";
import FormaterContent from "@/Components/Section/FormaterContent";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Home, ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import Loading from "@/Components/Loading";
import "../Css/ChapterStyle.css";
import usePageConfigStore from "@/Store/StateSiteHome";
import axios from "axios";
import supabase from "@/Config/supabase";

interface ChapterData {
  contenido: string;
  nombreCapitulo: string;
  capitulo: number;
  nombreNovela: string;
}

const newChater: ChapterData = {
  contenido: "",
  nombreCapitulo: "",
  capitulo: 0,
  nombreNovela: "",
};

type Params = {
  novelId: string;
  vol: string;
  capitulo: string;
};

const PageChapter = (): JSX.Element => {
  const {
    setTitleHeader,
    setTitleTextHeader,
    setBg_header,
    setHeigthHeader,
    setHiddenBanner,
  } = usePageConfigStore();
  const [dataChapter, setDataChapter] = useState<ChapterData>(newChater);
  const [loading, setLoading] = useState<boolean>(true);
  const [chapterCount, setCantidadActualCapitulos] = useState<number>(0);
  const [numeroCapituloActual, setNumeroCapituloActual] = useState<number>(0);
  const contenidoFormateadoRef = useRef<(JSX.Element | JSX.Element[])[]>([]);
  const contenidoSinFormatear = useRef("");

  const navigateTo = useNavigate();

  const params = useParams();

  const { novelId, vol, capitulo } = params as Params;

  const normalizeText = (text: string) =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const getChapter = async (
    novelId: string,
    vol: string,
    capitulo: string
  ): Promise<void> => {
    try {
      const folderName = `${novelId}/${vol}`;
      const id = `cap-${capitulo}.txt`;

      const { data: list, error } = await supabase.storage
        .from("chapters")
        .list(folderName);

      if (error) {
        throw error;
      }

      const findFile = list.find((file) => file.name.includes(id));

      if (!findFile?.id) throw new Error("No se encontro el archivo");

      const url = `https://seafaucozksbntgerqdh.supabase.co/storage/v1/object/public/chapters/${novelId}/${vol}/${findFile?.name}`;

      const response = await axios(url);
      const data = response.data ? response.data : "";

      const header: ChapterData = JSON.parse(data.split("+-----+")[0]);
      const content = data.split("+-----+")[1];

      setDataChapter({
        capitulo: header.capitulo,
        contenido: content,
        nombreCapitulo: header.nombreCapitulo,
        nombreNovela: header.nombreNovela,
      });
      setCantidadActualCapitulos(list.length);

      contenidoSinFormatear.current = content;

      const formatearContenido = FormaterContent(contenidoSinFormatear.current);
      contenidoFormateadoRef.current = formatearContenido;

      const title = normalizeText(
        header?.nombreCapitulo.toLowerCase()
      ).includes("prologo")
        ? "Capitulo - 0"
        : `Capitulo - ${header?.capitulo}`;
      setTitleHeader(title);
      setTitleTextHeader(header?.nombreCapitulo ?? "");
      setBg_header("");
      setHeigthHeader(true);
      setHiddenBanner(false);
    } catch (error) {
      contenidoFormateadoRef.current = [];
      navigateTo(`/novel/${novelId}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    getChapter(novelId, vol, capitulo);
    setNumeroCapituloActual(parseInt(capitulo));
  }, [capitulo]);

  if (loading) return <Loading />;
  return (
    <main className="min-h-screen py-8 px-4 bg-gray-800 text-white">
      <section className="md:w-9/12 w-12/12 mx-auto content_text">
        {contenidoFormateadoRef.current.length > 0 ? (
          <>{contenidoFormateadoRef.current}</>
        ) : (
          <h1 className=" text-center text-4xl m-2">No hay capitulo</h1>
        )}
        <span className="h-1 w-full mt-5 flex justify-center items-center rounded-md color_line"></span>
      </section>

      <div className="flex justify-center items-center gap-6 mt-8">
        {numeroCapituloActual > 1 && (
          <Link
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            to={`/leer/${novelId}/${vol}/${
              +capitulo - 1
            }?capitulo=${encodeURIComponent(
              dataChapter.nombreCapitulo
            )}&novela=${encodeURIComponent(dataChapter.nombreNovela)}`}
          >
            <ArrowLeftCircle size={24} />
            <span>Anterior</span>
          </Link>
        )}
        <Link
          to={`/novel/${novelId}?novela=${encodeURIComponent(
            dataChapter.nombreNovela
          )}`}
          className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          <Home size={24} />
        </Link>
        {numeroCapituloActual < chapterCount && (
          <Link
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            to={`/leer/${novelId}/${vol}/${
              +capitulo + 1
            }?capitulo=${encodeURIComponent(
              dataChapter.nombreCapitulo
            )}&novela=${encodeURIComponent(dataChapter.nombreNovela)}`}
          >
            <span>Siguiente</span>
            <ArrowRightCircle size={24} />
          </Link>
        )}
      </div>
    </main>
  );
};

export default PageChapter;
