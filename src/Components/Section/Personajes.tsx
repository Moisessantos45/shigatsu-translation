import React from "react";

interface PersonajesProps {
  dataNovelPersonajes: string;
}
interface PersonajesData {
  namePersonaje: string;
  imagenPersonaje: string;
  descripcionPersonaje: string;
}

const Personajes: React.FC<PersonajesProps> = ({
  dataNovelPersonajes,
}): JSX.Element => {
  
  const personajesNovel: PersonajesData[] =
    dataNovelPersonajes.length > 10 ? JSON.parse(dataNovelPersonajes) : [];

  return (
    <section className=" w-11/12 margin pt-3 flex justify-evenly items-center flex-wrap">
      {personajesNovel.length > 0 ? (
        <>
          {personajesNovel.map((item, i) => (
            <figure
              key={i}
              className=" p-1 gap-1 sm:w-64 w-10/12 min-h-[330px] sm:text-base text-[15px] text-center flex flex-col items-center justify-evenly text-white"
            >
              <img
                src={item.imagenPersonaje}
                alt=""
                className=" w-7/12 outline-3 h-28 outline-pink-600 outline rounded-md hover:outline hover:outline-pink-600 self-center "
              />
              <h1 className=" font-bold">{item.namePersonaje}</h1>
              <p>{item.descripcionPersonaje}</p>
            </figure>
          ))}
        </>
      ) : (
        ""
      )}
    </section>
  );
};

export default Personajes;
