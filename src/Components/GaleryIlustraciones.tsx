import { useState } from "react";
import { toastify } from "@/Utils/utils";
import { useQuery } from "@tanstack/react-query";
import ErrorHandler from "@/Services/ErrorHandler";
import useNovels from "@/Store/UseNovels";
import useVolumens from "@/Store/UseVolumens";

const GaleryIlustraciones = () => {
  const { novels } = useNovels();
  const { volumens } = useVolumens();
  const [ilustraciones, setIlustraciones] = useState<string[]>([]);

  const getIlustraciones = async () => {
    try {
      const [item1, item2] = await Promise.all([
        novels
          .map((item) => {
            const { portada, background, ilustracionesAtuales } = item;
            const ilustraciones = ilustracionesAtuales.split(",");
            return [...ilustraciones, portada, background].filter(
              (item) => item
            );
          })
          .flat(),
        volumens.map((item) => {
          const { portadaVolumen } = item;
          return portadaVolumen;
        }),
      ]);

      setIlustraciones([...item1, ...item2]);
    } catch (error) {
      setIlustraciones([]);
      ErrorHandler(error);
    }
    // setLoading(false);
  };

  const { isLoading } = useQuery({
    queryKey: ["getIlustraciones"],
    queryFn: getIlustraciones,
    refetchInterval: 3000000,
    staleTime: 3000000,
    retry: 0,
  });

  const copyImg = (url: string) => {
    navigator.clipboard.writeText(url);
    toastify("Imagen Copiada", true);
  };

  if (isLoading) return <h1>Cargando...</h1>;
  return (
    <section className="mx-auto max-w-screen-xl px-4 py-8 sm:px-8 h-screen scrollbar overflow-y-auto">
      {ilustraciones.length > 1 ? (
        <div className="grid grid-cols-3 md:grid-cols-5 p-3 sm:p-2 gap-4 w-11/12 m-auto sm:h-auto">
          {ilustraciones.map((img, i) => (
            <div key={i} className="grid gap-4 relative">
              <img
                onClick={() => copyImg(img)}
                className="h-auto max-w-full rounded-lg cursor-pointer"
                src={img}
                alt="ilustracion"
              />
              <span className=" absolute font-bold text-[12px] bg-pink-600 w-10 rounded-md h-5 items-center justify-center flex text-white cursor-pointer">
                Click
              </span>
            </div>
          ))}
        </div>
      ) : (
        <h1 className=" text-center">No hay ilustraciones</h1>
      )}
    </section>
  );
};

export default GaleryIlustraciones;
