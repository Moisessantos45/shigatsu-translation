import { useState } from "react";
import useUserStore from "@/Store/useUserStore";
import UseStateSocket from "@/Store/UseStateSocket";
import useVolumens from "@/Store/UseVolumens";
import HeaderForm from "@/Components/UI/HeaderForm";
import useNovels from "@/Store/UseNovels";
import InputForm from "@/Components/UI/InputForm";
import CustomSelect from "@/Components/UI/CustomSelect";
import useInteractionStore from "@/Store/InteracionState";

const PageVolumenes = () => {
  const { isDarkMode } = useInteractionStore();
  const { dataUser } = useUserStore();
  const { novels } = useNovels();
  const { addVolumen } = useVolumens();
  const { emitir } = UseStateSocket();
  const [nombreNovela, setNombreNovela] = useState<string>("");
  const [portadaVolumen, setPortadaVolumen] = useState<string>("");
  const [volumen, setVolumen] = useState<number>(0);
  const [disponibilidad, setDisponibilidad] = useState<string>("");
  const [novelId, setNovelId] = useState<string>("");
  const [numberInputs, setNumberInputs] = useState<number>(0);
  const [dataInputs, setDataInputs] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<{
    titleNovel: string;
    id: string;
  } | null>(null);

  const handelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addVolumen({
      nombreNovela,
      portadaVolumen,
      volumen,
      links: dataInputs,
      disponibilidad,
      novelId,
    });

    emitir("addContent", {
      id: dataUser.id,
      nameUser: nombreNovela.substring(0, 15),
      message: "Volumen ha sido agregado",
    });

    setNombreNovela("");
    setPortadaVolumen("");
    setVolumen(0);
    setDisponibilidad("");
  };

  const handleAddInput = () => {
    setNumberInputs(numberInputs + 1);
  };

  const handleRemoveInput = (index: number) => {
    const newInputs: string[] = dataInputs.filter((_, i) => i !== index);
    setNumberInputs(numberInputs - 1);
    setDataInputs(newInputs);
  };

  const handlewriteData = (value: string, index: number) => {
    setDataInputs((prev) => {
      const newPrev = [...prev];
      newPrev[index] = value;
      return newPrev;
    });
  };

  return (
    <form
      className="sm:p-8 p-3 sm:w-10/12 rounded-xl m-auto "
      onSubmit={handelSubmit}
    >
      <HeaderForm text="Agrega un nuevo volumen" title="Volumenes" />
      <fieldset>
        <div
          className={`p-2 h-64 w-full grid md:grid-cols-3 grid-cols-2 md:grid-rows-4 grid-rows-4 md:gap-2 gap-1 m-auto border-b ${
            isDarkMode ? "border-gray-600" : "border-gray-400"
          } border-opacity-20 items-center`}
        >
          <span
            className={`text-sm font-medium ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            } col-span-3 row-span-1 md:col-span-2 md:row-start-1 textWidthFitContent h-5`}
          >
            Titulo de la novela
          </span>
          <span
            className={`text-sm font-medium ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            } md:col-start-1 md:row-start-3 row-start-3 col-start-1 textWidthFitContent h-5`}
          >
            Volumen
          </span>
          <span
            className={`text-sm font-medium ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            } md:col-start-2 md:col-span-2 md:row-start-3 row-start-3 col-start-2 textWidthFitContent h-5`}
          >
            Disponibilidad
          </span>
          <div
            className={`py-5 md:col-span-3 md:row-start-2 row-start-2 col-span-2 px-3 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            } flex-col relative justify-center flex items-center`}
          >
            <CustomSelect
              options={novels}
              placeholder="Selecciona una novela"
              initValue={selectedId}
              onChange={(option) => {
                setNovelId(option.id);
                setNombreNovela(option.titulo);
                setSelectedId({ titleNovel: option.titulo, id: option.id });
              }}
            />
          </div>
          <InputForm
            classNames={`md:col-start-1 md:row-start-4 row-start-4 col-start-1 flex-col relative justify-center flex items-center ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
            id="formInput1-1"
            type="number"
            min={0}
            value={volumen}
            onChange={(e) => setVolumen(+e.target.value)}
          />
          <InputForm
            classNames={`md:col-start-2 md:col-span-2 md:row-start-4 row-start-4 col-start-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
            id="formInput1-1"
            type="text"
            placeholder="Ingresa un texto..."
            value={disponibilidad}
            onChange={(e) => setDisponibilidad(e.target.value)}
          />
        </div>
        <div
          className={`p-2 w-full flex flex-col m-auto border-b ${
            isDarkMode ? "border-gray-600" : "border-gray-400"
          } border-opacity-20 gap-2`}
        >
          <div className="w-full px-4 flex flex-col sm:justify-center justify-evenly gap-2">
            <span
              className={`text-sm font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Portada del volumen
            </span>
          </div>
          <div
            className={`w-full m-auto border-b ${
              isDarkMode ? "border-gray-600" : "border-gray-400"
            } border-opacity-20 gap-2`}
          >
            <InputForm
              id="formInput1-1"
              type="text"
              placeholder="...."
              value={portadaVolumen}
              onChange={(e) => setPortadaVolumen(e.target.value)}
            />
          </div>
        </div>
        {/* inputs dinamicos */}
        <div className="mb-5 p-2">
          <div className="sm:w-full py-2 my-2 flex items-center flex-wrap sm:justify-start justify-between gap-2">
            <span
              className={`flex textWidthFitContent text-xl font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Agrega los links
            </span>
            <span
              className={`flex font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              } textWidthFitContent`}
            >
              <i
                className="fa-solid fa-plus cursor-pointer text-xl"
                onClick={handleAddInput}
              ></i>
            </span>
          </div>
          {Array.from({ length: numberInputs }, (_, i) => (
            <article key={i} className="relative">
              <i
                className={`fa-solid fa-minus font-bold ${
                  isDarkMode ? "text-slate-300" : "text-slate-700"
                } text-3xl absolute right-2 -top-4 cursor-pointer`}
                onClick={() => handleRemoveInput(i)}
              ></i>
              <InputForm
                classNames={`mb-3 md:col-start-2 col-start-1 md:row-start-2 row-start-4 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
                id="name"
                type="text"
                name="name"
                value={dataInputs[i] || ""}
                onChange={(e) => handlewriteData(e.target.value, i)}
                placeholder="Link..."
              />
            </article>
          ))}
        </div>
      </fieldset>
    </form>
  );
};

export default PageVolumenes;
