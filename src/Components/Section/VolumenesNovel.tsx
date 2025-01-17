import { useState } from "react";
import { dbFirebaseLite } from "@/Config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore/lite";
import { volumenData } from "@/Types/Types";
import BotonA from "../UI/BotonA";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { fromToJsonMapVol } from "@/Services/userService";

const VolumenesNovel = (): JSX.Element => {
  const { novelId } = useParams<{ novelId: string }>();
  const [volumenes, setVolumenes] = useState<volumenData[]>([]);

  const getVolumen = async () => {
    try {
      const q = query(
        collection(dbFirebaseLite, "volumenesNovela"),
        where("novelId", "==", novelId)
      );

      const documents = await getDocs(q);
      const data = documents.docs.map((doc) => doc.data());
      const mappedVolumenesData = data.map(fromToJsonMapVol);
    
      setVolumenes(mappedVolumenesData);
      return data;
    } catch (error) {
      setVolumenes([]);
    }
  };

  const { isLoading } = useQuery({
    queryKey: ["volumenes", novelId],
    queryFn: getVolumen,
    refetchInterval: 3000000,
    refetchOnWindowFocus: false,
    staleTime: 3000000,
    retry: 0,
  });

  return (
    <section
      className={`w-11/12 margin ${
        isLoading || volumenes.length === 0 ? "hidden" : "flex"
      } justify-evenly flex-wrap`}
    >
      <div className="h-24 m-auto mt-2 flex justify-evenly text-center items-center flex-col w-12/12">
        <span className="line3 h-1 w-full flex justify-center items-center rounded-md color_line"></span>
        <h1 className="title text-4xl text-white uppercase font-bold flex justify-center items-center">
          Volumenes
        </h1>
        <span className="line3 h-1 w-full flex justify-center items-center rounded-md color_line"></span>
      </div>
      {volumenes.map((volumen) => (
        <figure
          key={volumen.volumenId}
          className="flex flex-col items-center text-center m-2 w-64 bg-gray-800 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <img
            src={volumen.portadaVolumen}
            alt={volumen.nombreNovela}
            loading="lazy"
            className=" w-full rounded-t-md box_shadow"
          />
          <div className="flex w-12/12 flex-col items-center justify-center text-center gap-2 m-2">
            <h1 className="flex justify-center items-center font-bold text-slate-300">
              Volumen {volumen.volumen}
            </h1>
            <p className="text-center text-slate-300">
              {volumen.disponibilidad}
            </p>

            {volumen.links.length > 0 &&
              volumen.links.map((link) => (
                <BotonA key={uuidv4()} link={link} text="Descargar Volumen" />
              ))}
          </div>
        </figure>
      ))}
    </section>
  );
};

export default VolumenesNovel;
