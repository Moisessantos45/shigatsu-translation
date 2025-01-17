import { useEffect, useRef, useState } from "react";
import { chapterData, chapterDatNotContent } from "@/Types/Types";
import { useQueryClient } from "@tanstack/react-query";
import { toastify } from "@/Utils/utils";
import useChapters from "@/Store/UseChapters";
import HeaderForm from "@/Components/UI/HeaderForm";
import useNovels from "@/Store/UseNovels";
import InputForm from "@/Components/UI/InputForm";
import CustomSelect from "@/Components/UI/CustomSelect";
import useInteractionStore from "@/Store/InteracionState";
import { useSearchParams } from "react-router-dom";

const PageChapterAdmin = (): JSX.Element => {
  const { isDarkMode } = useInteractionStore();
  const { chapters, chapterData, addChapter, updateChapter, setChapterData } =
    useChapters();
  const { novels } = useNovels();
  const [nombreCapitulo, setNombreCapitulo] = useState<string>("");
  const [nombreNovela, setNombreNovela] = useState<string>("");
  const [capitulo, setCapitulo] = useState<number>(0);
  const [volumenPertenece, setVolumenPertenece] = useState<number>(0);
  const [contenido, setContenido] = useState<string>("");
  const [id, setId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<{
    id: string;
    titleNovel: string;
  } | null>(null);
  const [shouldReset, setShouldReset] = useState(false);
  const novelId = useRef<string>("");
  const isChange = useRef<boolean>(false);

  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const params = searchParams.get("id");

  const asignarNovel = (data: chapterData) => {
    setNombreCapitulo(data.nombreCapitulo);
    setNombreNovela(data.nombreNovela);
    setCapitulo(data.capitulo);
    setVolumenPertenece(data.volumenPertenece);
    setContenido(data.contenido);
    novelId.current = data.novelId;
    setId(data.id ?? params);
  };

  useEffect(() => {
    let data = null;
    if (params) {
      const findChapter = chapters.find((chapter) => chapter.id === params);
      if (findChapter) {
        data = findChapter;
      }
    } else if (chapterData?.capituloId) {
      data = chapterData;
    }
    if (data) {
      asignarNovel(data);
      const findNovel = novels.find((novel) => novel.id === data.novelId);
      if (findNovel) {
        setSelectedId({ id: findNovel.id, titleNovel: findNovel.titleNovel });
      }
    }
  }, []);

  useEffect(() => {
    if (shouldReset) {
      setNombreCapitulo("");
      setNombreNovela("");
      setCapitulo(0);
      setVolumenPertenece(0);
      setContenido("");
      novelId.current = "";
      setId(null);
      setSelectedId(null);
      setChapterData({} as chapterData);
      setShouldReset(false);
    }
  }, [shouldReset]);

  const cancelFrom = () => {
    setShouldReset(true);
  };

  const handleChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length < 1048050) {
      isChange.current = true;
      setContenido(e.target.value);
    } else {
      toastify("El contenido supero su maximo", false);
    }
  };

  const handelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const chapterData: chapterDatNotContent = {
      nombreCapitulo,
      nombreNovela,
      capitulo,
      volumenPertenece,
      contenido,
      novelId: novelId.current,
    };
    
    if (id !== null) {
      updateChapter(
        {
          ...chapterData,
          id,
        },
        isChange.current
      );
    } else {
      addChapter(chapterData);
    }

    queryClient.invalidateQueries({
      queryKey: ["chapters", novelId],
    });

    queryClient.invalidateQueries({
      queryKey: ["chaptersDataAdmin"],
    });

    cancelFrom();
  };

  return (
    <form
      className={`sm:p-8 p-3 sm:w-10/12 rounded-xl m-auto`}
      onSubmit={handelSubmit}
    >
      <HeaderForm
        title="Capitulos"
        text={
          novelId
            ? "Edita un capitulo de una novela"
            : "Agrega un capitulo de una novela"
        }
        cancelFrom={cancelFrom}
      />

      <fieldset>
        <div className="p-2 h-64 w-full grid md:grid-cols-2 grid-cols-2 md:grid-rows-4 grid-rows-4 md:gap-2 gap-1 m-auto border-b border-gray-400 border-opacity-20 items-center">
          <span
            className={`text-sm font-medium ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            } col-span-2 row-span-1 md:col-span-2 md:row-start-1 textWidthFitContent h-5`}
          >
            Titulo de la novela
          </span>
          <span
            className={`text-sm font-medium ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            } md:col-start-1 md:row-start-3 row-start-3 col-start-1 textWidthFitContent h-5`}
          >
            A que volumen pertenece
          </span>
          <span
            className={`text-sm font-medium ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            } md:col-start-2 md:row-start-3 row-start-3 col-start-2 textWidthFitContent h-5`}
          >
            Numero del capitulo
          </span>
          <div
            className={`py-5 md:col-span-3 md:row-start-2 row-start-2 col-span-2 px-3 w-full ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            } flex-col relative justify-center flex items-center`}
          >
            <CustomSelect
              options={novels}
              placeholder="Selecciona una novela"
              initValue={selectedId}
              onChange={(option) => {
                novelId.current = option.id;
                setNombreNovela(option.titulo);
              }}
            />
          </div>
          <InputForm
            classNames="md:col-start-1 md:row-start-4 row-start-4 col-start-1"
            id="formInput1-1"
            type="number"
            min={0}
            value={volumenPertenece}
            onChange={(e) => setVolumenPertenece(+e.target.value)}
          />

          <InputForm
            classNames="md:col-start-2 md:row-start-4 row-start-4 col-start-2"
            id="formInput1-1"
            type="number"
            placeholder="0"
            value={capitulo}
            onChange={(e) => setCapitulo(+e.target.value)}
          />
        </div>
        <div className="p-2 w-full flex flex-col m-auto border-b border-gray-400 border-opacity-20 gap-2">
          <div className="w-full px-4 flex flex-col sm:justify-center justify-evenly gap-2">
            <span
              className={`text-sm font-medium ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Titulo del capitulo
            </span>
          </div>
          <div className=" w-full m-auto border-b border-gray-400 border-opacity-20 gap-2">
            <InputForm
              id="formInput1-1"
              type="text"
              placeholder="...."
              value={nombreCapitulo}
              onChange={(e) => setNombreCapitulo(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-start pb-4 mb-8 border-b border-gray-400 border-opacity-20">
          <div className="w-full p-2 mb-5 sm:mb-0">
            <span
              className={`block mt-2 text-sm font-medium ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Contenido
            </span>
          </div>
          <div className="w-full">
            <textarea
              className={`block h-40 py-4 px-3 w-full text-sm ${
                isDarkMode
                  ? "text-gray-50 placeholder-gray-50"
                  : "text-gray-900 placeholder-gray-900"
              } font-medium outline-none bg-transparent border border-gray-400 hover:border-${
                isDarkMode ? "white" : "gray-900"
              } focus:border-green-500 rounded-lg resize-none scrollbar`}
              id="formInput1-9"
              placeholder="Lorem ipsum dolor sit amet"
              value={contenido}
              onChange={handleChangeTextArea}
              maxLength={1048050}
            />
          </div>
        </div>
      </fieldset>
    </form>
  );
};

export default PageChapterAdmin;
