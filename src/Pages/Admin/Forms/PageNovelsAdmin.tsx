import { useEffect, useState } from "react";
import useUserStore from "@/Store/useUserStore";
import { novelData, novelDataWithIds } from "@/Types/Types";
import { toastify } from "@/Utils/utils";
import UseStateSocket from "@/Store/UseStateSocket";
import { useQueryClient } from "@tanstack/react-query";
import useNovels from "@/Store/UseNovels";
import HeaderForm from "@/Components/UI/HeaderForm";
import InputForm from "@/Components/UI/InputForm";
import useInteractionStore from "@/Store/InteracionState";
import { useSearchParams } from "react-router-dom";

interface IInputs {
  namePersonaje: string;
  imagenPersonaje: string;
  descripcionPersonaje: string;
}

const PageNovelsAdmin = () => {
  const { isDarkMode } = useInteractionStore();
  const { dataUser } = useUserStore();
  const { novels, updateNovel, novelData, addNovel } = useNovels();
  const { emitir } = UseStateSocket();
  const [titleNovel, setTitleNovel] = useState<string>("");
  const [volumenesActuales, setVolumenesActuales] = useState<number>(0);
  const [tipoNovela, setTipoNovela] = useState<string>("");
  const [nombresAlternos, setNombresAlternos] = useState<string>("");
  const [statusNovel, setStatusNovel] = useState<string>("");
  const [generos, setGeneros] = useState<string>("");
  const [autor, setAutor] = useState<string>("");
  const [background, setBackground] = useState<string>("");
  const [portada, setPortada] = useState<string>("");
  const [ilustracionesAtuales, setIlustracionesAtuales] = useState<string>("");
  const [sinopsis, setSinopsis] = useState<string>("");
  const [numberOfInputs, setNumberOfInputs] = useState<number>(0);
  const [inputValues, setInputValues] = useState<IInputs[]>([]);
  const [id, setId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const params = searchParams.get("id");

  const asignarDatos = (data: novelData) => {
    setTitleNovel(data.titleNovel);
    setVolumenesActuales(data.volumenesActuales);
    setTipoNovela(data.tipoNovela);
    setNombresAlternos(data.nombresAlternos);
    setStatusNovel(data.statusNovel);
    setGeneros(data.generos);
    setAutor(data.autor);
    setBackground(data.background);
    setPortada(data.portada);
    setIlustracionesAtuales(data.ilustracionesAtuales);
    setInputValues(JSON.parse(data.personajes));
    setNumberOfInputs(JSON.parse(data.personajes).length);
    setSinopsis(data.sinopsis);
    setId(data.id ?? params);
  };

  useEffect(() => {
    let data = null;
    if (params) {
      const findNovel = novels.find((novel) => novel.id === params);
      if (findNovel) {
        data = findNovel;
      }
    } else if (novelData.id) {
      data = novelData;
    }
    if (data) {
      asignarDatos(data);
    }
  }, [novelData]);

  const handelClickActivePersonajes = () => {
    setNumberOfInputs(numberOfInputs + 1);
  };

  const handelClickDeleteInput = (index: number) => {
    setNumberOfInputs(numberOfInputs - 1);
    const newInputValues: IInputs[] = inputValues.filter((_, i) => i !== index);
    setInputValues(newInputValues);
  };

  const handelChangeInputs = (
    index: number,
    fieldName: keyof IInputs,
    value: string
  ) => {
    setInputValues((prevInputValues) => {
      // Clonar el array existente para evitar mutar el estado directamente
      const newInputValues = [...prevInputValues];

      // Obtener el objeto correspondiente al índice actual
      let currentObject: IInputs = newInputValues[index];

      // Si no existe un objeto para ese índice, crear uno
      if (!currentObject) {
        currentObject = {} as IInputs;
        newInputValues[index] = currentObject;
      }

      // Actualizar el valor del campo en el objeto
      currentObject[fieldName] = value;

      return newInputValues;
    });
  };

  const cancelFrom = () => {
    setTitleNovel("");
    setVolumenesActuales(0);
    setTipoNovela("");
    setNombresAlternos("");
    setStatusNovel("");
    setGeneros("");
    setAutor("");
    setBackground("");
    setPortada("");
    setIlustracionesAtuales("");
    setInputValues([]);
    setNumberOfInputs(0);
    setSinopsis("");
    setId(null);
  };

  const handelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputs: string[] = [
      titleNovel,
      tipoNovela,
      nombresAlternos,
      statusNovel,
      generos,
      autor,
    ];
    if (inputs.some((input) => input === "")) {
      toastify("Hay campos vacios", false);
      return;
    }

    const novelData: novelDataWithIds = {
      titleNovel,
      volumenesActuales,
      nombresAlternos,
      background,
      portada,
      tipoNovela,
      generos,
      autor,
      sinopsis,
      ilustracionesAtuales,
      statusNovel,
      personajes: JSON.stringify(inputValues),
    };

    if (id !== null) {
      updateNovel({
        ...novelData,
        id,
      });

      emitir("updateContent", {
        id: dataUser.id,
        nameUser: titleNovel.substring(0, 15),
        message: "Novela ha sido actualizada",
      });
    } else {
      addNovel(novelData);

      emitir("addContent", {
        id: dataUser.id,
        nameUser: titleNovel.substring(0, 15),
        message: "Novela ha sido agregada",
      });
    }

    queryClient.invalidateQueries({
      queryKey: ["siteDataAdmin"],
    });

    queryClient.invalidateQueries({
      queryKey: ["volumenes"],
    });

    queryClient.invalidateQueries({
      queryKey: ["novelsDataAdmin"],
    });

    cancelFrom();
  };

  return (
    <form
      className={`sm:p-8 p-3 sm:w-10/12 rounded-xl m-auto ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
      onSubmit={handelSubmit}
    >
      <HeaderForm
        title="Novelas"
        text={
          id === null
            ? "Agrega una nueva novela"
            : "Actualizar datos de la novela"
        }
        cancelFrom={cancelFrom}
      />

      <fieldset>
        <div className="p-2 w-full grid md:grid-cols-4 grid-cols-2 md:grid-rows-2 grid-rows-4 md:gap-2 gap-1 m-auto border-b border-gray-400 border-opacity-20 items-center">
          <span
            className={`text-sm font-medium ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            } col-span-2 row-span-1 md:col-span-2 md:row-start-1 textWidthFitContent h-5`}
          >
            Titulo
          </span>
          <span
            className={`text-sm font-medium ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            } md:col-start-3 md:row-start-1 row-start-3 col-start-1 textWidthFitContent h-5`}
          >
            Volumenes actuales
          </span>
          <span
            className={`text-sm font-medium ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            } md:col-start-4 md:row-start-1 row-start-3 col-start-2 textWidthFitContent h-5`}
          >
            Tipo de novela
          </span>
          <InputForm
            classNames="md:col-span-2 md:row-start-2 row-start-2 col-span-2"
            id="formInput1-1"
            placeholder="...."
            value={titleNovel}
            onChange={(e) => setTitleNovel(e.target.value)}
            type="text"
          />
          <InputForm
            classNames="md:col-start-3 md:row-start-2 row-start-4 col-start-1"
            id="formInput1-1"
            placeholder="0"
            value={volumenesActuales}
            onChange={(e) => setVolumenesActuales(Number(e.target.value))}
            type="text"
          />
          <div
            className={`py-4 md:col-start-4 md:row-start-2 px-3 w-full ${
              isDarkMode ? "text-gray-50" : "text-gray-900"
            } placeholder-gray-50 font-medium outline-none bg-transparent focus:border-green-500 rounded-lg row-start-4 col-start-2 flex gap-4 justify-center items-center text-sm`}
          >
            <input
              type="radio"
              name="Ln"
              id="Ln"
              value="Ln"
              checked={tipoNovela.toLowerCase() === "Ln".toLowerCase()}
              onChange={(e) => setTipoNovela(e.target.value)}
              className="w-4 h-4 text-gray-50 border border-gray-400 hover:border-white focus:border-green-500 rounded-lg"
            />
            <label htmlFor="Ln">LN</label>
            <input
              type="radio"
              name="wn"
              id="Wn"
              value="Wn"
              checked={tipoNovela === "Wn"}
              onChange={(e) => setTipoNovela(e.target.value)}
              className="w-4 h-4 text-gray-50 border border-gray-400 hover:border-white focus:border-green-500 rounded-lg"
            />
            <label htmlFor="Wn">WN</label>
          </div>
        </div>
        <div className="p-2 w-full grid md:grid-cols-2 grid-cols-1 md:grid-rows-2 grid-rows-4 md:gap-2 items-center m-auto border-b border-gray-400 border-opacity-20">
          <span
            className={`text-sm font-medium md:row-start-1 row-start-1 md:col-start-1 col-start-1 ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Nombres alternos
          </span>
          <span
            className={`text-sm font-medium md:row-start-1 row-start-3 md:col-start-2 col-start-1 ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Status de la novela
          </span>
          <InputForm
            classNames="md:row-start-2 row-start-2 md:col-start-1 col-start-1"
            id="formInput1-1"
            placeholder="....."
            value={nombresAlternos}
            onChange={(e) => setNombresAlternos(e.target.value)}
            type="text"
          />
          <div
            className={`py-4 px-3 w-full text-sm md:row-start-2 row-start-4 md:col-start-2 col-start-1 ${
              isDarkMode ? "text-gray-50" : "text-gray-900"
            } placeholder-gray-50 font-medium outline-none bg-transparent hover:border-white focus:border-green-500 rounded-lg flex md:gap-2 lg:gap-3 gap-3 lg:justify-center items-center md:text-sm flex-wrap`}
          >
            <input
              type="radio"
              name="activo"
              id="activo"
              value="activo"
              checked={statusNovel === "activo"}
              onChange={(e) => setStatusNovel(e.target.value)}
              className="w-4 h-4 text-gray-50 border border-gray-400 hover:border-white focus:border-green-500 rounded-lg"
            />
            <label htmlFor="activo">Activo</label>
            <input
              type="radio"
              name="inactivo"
              id="inactivo"
              value="inactivo"
              checked={statusNovel === "inactivo"}
              onChange={(e) => setStatusNovel(e.target.value)}
              className="w-4 h-4 text-gray-50 border border-gray-400 hover:border-white focus:border-green-500 rounded-lg"
            />
            <label htmlFor="inactivo">Inactivo</label>
            <input
              type="radio"
              name="proceso"
              id="proceso"
              value="proceso"
              checked={statusNovel === "proceso"}
              onChange={(e) => setStatusNovel(e.target.value)}
              className="w-4 h-4 text-gray-50 border border-gray-400 hover:border-white focus:border-green-500 rounded-lg"
            />
            <label htmlFor="proceso">Proceso</label>
            <input
              type="radio"
              name="pendiente"
              id="pendiente"
              value="pendiente"
              checked={statusNovel === "pendiente"}
              onChange={(e) => setStatusNovel(e.target.value)}
              className="w-4 h-4 text-gray-50 border border-gray-400 hover:border-white focus:border-green-500 rounded-lg"
            />
            <label htmlFor="pendiente">Pendiente</label>
          </div>
        </div>
        <div className="p-2 w-full grid md:grid-cols-2 grid-cols-1 md:grid-rows-2 grid-rows-4 md:gap-2 m-auto border-b border-gray-400 border-opacity-20 items-center">
          <span
            className={`text-sm font-medium ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            } md:col-start-1 col-start-1 md:row-start-1 row-start-1`}
          >
            Generos
          </span>
          <span
            className={`text-sm font-medium ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            } md:col-start-2 col-start-1 md:row-start-1 row-start-3`}
          >
            Autor
          </span>
          <InputForm
            classNames="md:col-start-1 col-start-1 md:row-start-2 row-start-2"
            id="formInput1-1"
            placeholder="...."
            value={generos}
            onChange={(e) => setGeneros(e.target.value)}
            type="text"
          />
          <InputForm
            classNames="md:col-start-2 col-start-1 md:row-start-2 row-start-4"
            id="formInput1-1"
            placeholder="...."
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            type="text"
          />
        </div>
        <div className="p-2 w-full grid md:grid-cols-2 grid-cols-1 md:grid-rows-2 grid-rows-4 md:gap-2 m-auto border-b border-gray-400 border-opacity-20 items-center">
          <span
            className={`text-sm md:col-start-1 col-start-1 md:row-span-1 row-start-1 font-medium ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Background
          </span>
          <span
            className={`text-sm md:col-start-2 col-start-1 md:row-span-1 row-start-3 font-medium ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Portada
          </span>
          <InputForm
            classNames="md:col-start-1 col-start-1 md:row-start-2 row-start-2"
            id="formInput1-1"
            placeholder="...."
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            type="text"
          />
          <InputForm
            classNames="md:col-start-2 col-start-1 md:row-start-2 row-start-4"
            id="formInput1-1"
            placeholder="...."
            value={portada}
            onChange={(e) => setPortada(e.target.value)}
            type="text"
          />
        </div>
        <div className="p-2 w-full flex flex-col m-auto border-b border-gray-400 border-opacity-20 gap-2">
          <div className="w-full px-4 flex flex-col sm:justify-center justify-evenly gap-2">
            <span
              className={`text-sm font-medium ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Ilustraciones actuales
            </span>
          </div>
          <div className=" w-full m-auto border-b border-gray-400 border-opacity-20 gap-2">
            <InputForm
              id="formInput1-1"
              placeholder="...."
              value={ilustracionesAtuales}
              onChange={(e) => setIlustracionesAtuales(e.target.value)}
              type="text"
            />
          </div>
        </div>
        <div className="p-2 w-full flex flex-col m-auto border-b border-gray-400 border-opacity-20 gap-2">
          <div className="sm:w-full px-4 flex items-center flex-wrap sm:justify-start justify-evenly gap-2">
            <span
              className={`text-sm flex font-medium ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              } textWidthFitContent`}
            >
              Agregar personajes
            </span>
            <span
              className={`flex font-medium ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              } textWidthFitContent`}
            >
              <i
                className="fa-solid fa-plus cursor-pointer text-xl"
                onClick={handelClickActivePersonajes}
              ></i>
            </span>
          </div>
          <div className=" w-full m-auto border-b border-gray-400 border-opacity-20">
            {Array.from({ length: numberOfInputs }, (_, index) => (
              <article
                key={index}
                className=" gap-2 w-full justify-evenly items-center p-3 grid md:grid-cols-2 md:grid-rows-2 grid-cols-1 md:gap-2 m-auto relative"
              >
                <i
                  className="fa-solid fa-minus font-bold text-slate-300 text-3xl absolute right-2 -top-3 cursor-pointer"
                  onClick={() => handelClickDeleteInput(index)}
                ></i>
                <InputForm
                  classNames="md:col-start-1 md:row-start-1"
                  id="formInput1-1"
                  placeholder="Nombre del personaje"
                  value={
                    (inputValues[index] && inputValues[index].namePersonaje) ||
                    ""
                  }
                  onChange={(e) =>
                    handelChangeInputs(index, "namePersonaje", e.target.value)
                  }
                  type="text"
                />
                <InputForm
                  classNames="md:col-start-2 md:row-start-1"
                  id="formInput1-1"
                  placeholder="imagen del personaje"
                  value={
                    (inputValues[index] &&
                      inputValues[index].imagenPersonaje) ||
                    ""
                  }
                  onChange={(e) =>
                    handelChangeInputs(index, "imagenPersonaje", e.target.value)
                  }
                  type="text"
                />
                <InputForm
                  classNames="md:col-span-2 md:row-start-2"
                  id="formInput1-1"
                  placeholder="descripcion del personaje"
                  value={
                    (inputValues[index] &&
                      inputValues[index].descripcionPersonaje) ||
                    ""
                  }
                  onChange={(e) =>
                    handelChangeInputs(
                      index,
                      "descripcionPersonaje",
                      e.target.value
                    )
                  }
                  type="text"
                />
              </article>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-start pb-4 mb-8 border-b border-gray-400 border-opacity-20">
          <div className="w-full p-2 mb-5 sm:mb-0">
            <span
              className={`block mt-2 text-sm font-medium ${
                !isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Sinopsis
            </span>
          </div>
          <div className="w-full">
            <textarea
              className={`block h-40 py-4 px-3 w-full text-sm ${
                isDarkMode ? "text-gray-50" : "text-gray-900"
              } placeholder-gray-50 font-medium outline-none bg-transparent border border-gray-400 hover:border-white focus:border-green-500 rounded-lg resize-none scrollbar`}
              id="formInput1-9"
              placeholder="Lorem ipsum dolor sit amet"
              value={sinopsis}
              onChange={(e) => setSinopsis(e.target.value)}
            />
          </div>
        </div>
      </fieldset>
    </form>
  );
};

export default PageNovelsAdmin;
