import { useEffect, useRef, useState } from "react";
import imgClose from "../Img/cerrar.png";
import UseStateSocket from "../Store/UseStateSocket";
import useUserStore from "../Store/useUserStore";
import useVolumens from "@/Store/UseVolumens";
import { useQueryClient } from "@tanstack/react-query";
import CustomSelect from "./UI/CustomSelect";
import useNovels from "@/Store/UseNovels";
import { novelData } from "@/Types/Types";
import useInteractionStore from "@/Store/InteracionState";

const ModalEdit = () => {
  const { setIsVisibleModal } = useInteractionStore();
  const { updateVolumen, volumenData } = useVolumens();
  const { dataUser } = useUserStore();
  const { novels } = useNovels();
  const { emitir } = UseStateSocket();
  const [nombreNovela, setNombreNovela] = useState<string>("");
  const [portadaVolumen, setPortadaVolumen] = useState<string>("");
  const [volumen, setVolumen] = useState<number>(0);
  const [disponibilidad, setDisponibilidad] = useState<string>("");
  const novelId = useRef<string>("");
  const [id, setId] = useState<string>("");
  const [numberInputs, setNumberInputs] = useState<number>(0);
  const [dataInputs, setDataInputs] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<novelData | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (volumenData.volumenId) {
      setNombreNovela(volumenData.nombreNovela);
      setPortadaVolumen(volumenData.portadaVolumen);
      setVolumen(volumenData.volumen);
      setDisponibilidad(volumenData.disponibilidad);
      novelId.current = volumenData.novelId;
      setId(volumenData.volumenId);
      setDataInputs(volumenData.links);
      setNumberInputs(volumenData.links.length);
    }
  }, [volumenData]);

  useEffect(() => {
    const findNovel = novels.find((novel) => novel.id === novelId.current);
    if (findNovel) {
      setSelectedId(findNovel);
    }
  }, [novelId]);

  const handelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateVolumen(
      {
        nombreNovela,
        portadaVolumen,
        volumen,
        links: dataInputs,
        disponibilidad,
        novelId: novelId.current,
      },
      id
    );

    emitir("updateContent", {
      id: dataUser.id,
      nameUser: nombreNovela.substring(0, 15),
      message: "Volumen ha sido actualizado",
    });

    queryClient.invalidateQueries({
      queryKey: ["volumensDataAdmin"],
    });

    setNombreNovela("");
    setPortadaVolumen("");
    setVolumen(0);
    setDataInputs([]);
    setDisponibilidad("");
    novelId.current = "";
    setId("");
    setIsVisibleModal(false);
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
    <section className="flex p-2 justify-center items-center top-0 left-0 fixed h-screen w-full">
      <div className="max-w-md bg-white shadow-lg rounded-lg md:max-w-xl mx-2 relative">
        <img
          src={imgClose}
          alt="imagne de cerrar"
          className="absolute w-6 h-6 right-2 top-2 cursor-pointer"
          onClick={() => setIsVisibleModal(false)}
        />
        <form className="md:flex" onSubmit={handelSubmit}>
          <div className="w-full p-4 px-5 py-5">
            <div className="flex flex-row text-center">
              <h2 className="text-3xl text-green-400 font-semibold">
                Actualizar Volumen
              </h2>
            </div>
            <div className="relative pb-1">
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
            <div className="relative pb-1">
              <input
                type="text"
                className="border rounded h-10 w-full focus:outline-none text-slate-400 focus:text-slate-700 focus:border-green-200 px-2 mt-2 text-sm"
                placeholder="Nombre del volumen"
                value={nombreNovela}
                onChange={(e) => setNombreNovela(e.target.value)}
              />
            </div>
            <div className="grid md:grid-cols-3 md:gap-2">
              <input
                type="number"
                className="border rounded h-10 w-full text-slate-400 focus:text-slate-700 focus:outline-none focus:border-green-200 px-2 mt-2 text-sm"
                placeholder="Volumen"
                value={volumen}
                onChange={(e) => setVolumen(Number(e.target.value))}
              />
              <input
                type="text"
                className="border rounded sm:col-start-2 col-span-2 h-10 w-full text-slate-400 focus:text-slate-700  focus:outline-none focus:border-green-200 px-2 mt-2 text-sm"
                placeholder="Descripcion del estado del volumen"
                value={disponibilidad}
                onChange={(e) => setDisponibilidad(e.target.value)}
              />
            </div>
            <input
              type="text"
              className="border rounded h-10 w-full text-slate-400 focus:text-slate-700 focus:outline-none focus:border-green-200 px-2 mt-2 text-sm"
              placeholder="Imagen"
              value={portadaVolumen}
              onChange={(e) => setPortadaVolumen(e.target.value)}
            />

            <div className="mb-5 p-2">
              <div className="sm:w-full py-2 my-2 flex items-center flex-wrap sm:justify-start justify-between gap-2">
                <span className=" flex textWidthFitContent text-xl font-medium text-gray-400">
                  Links de descarga
                </span>
                <span className="flex font-medium text-gray-500 textWidthFitContent">
                  <i
                    className="fa-solid fa-plus cursor-pointer text-xl"
                    onClick={handleAddInput}
                  ></i>
                </span>
              </div>
              {Array.from({ length: numberInputs }, (_, i) => (
                <article key={i} className=" relative">
                  <i
                    className="fa-solid fa-minus font-bold text-slate-300 text-3xl absolute right-2 -top-4 cursor-pointer"
                    onClick={() => handleRemoveInput(i)}
                  ></i>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={dataInputs[i] || ""}
                    onChange={(e) => handlewriteData(e.target.value, i)}
                    placeholder="Link..."
                    className="py-4 mb-3 border rounded h-10 w-full text-slate-400 focus:text-slate-700 focus:outline-none focus:border-green-200 px-2 mt-2 text-sm"
                  />
                </article>
              ))}
            </div>

            <div className="flex justify-center items-center pt-2">
              <button
                type="submit"
                value="Actualizar el volumen"
                className="h-10 w-48 rounded font-medium text-xs bg-blue-500 text-white"
              >
                Actualizar el volumen
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ModalEdit;
