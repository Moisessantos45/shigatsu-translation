import React from "react";

interface GaleryPersonajesProps {
  galeryImages: string;
}

const GaleryPersonajes: React.FC<GaleryPersonajesProps> = ({
  galeryImages,
}): JSX.Element => {
  const images: string[] =
    galeryImages.length > 10 ? galeryImages.split(",") : [];

  if (galeryImages.length > 10)
    return (
      <section className="w-11/12 flex justify-center items-center m-auto flex-col">
        <div className="h-32 m-auto mt-2 flex justify-evenly text-center flex-col w-12/12">
          <span className="line3 h-1 w-full flex justify-center items-center rounded-md color_line"></span>
          <h1 className="title text-4xl uppercase font-bold text-white">
            Ilustraciones de la novela
          </h1>
          <span className="line3 h-1 w-full flex justify-center items-center rounded-md color_line"></span>
        </div>
        <figure className=" w-full gap-1 flex justify-around flex-wrap">
          {images.map((item, i) => (
            <img
              key={i}
              src={item}
              alt={i.toString()}
              loading="lazy"
              className=" max-w-36 sm:max-w-64 object-contain m-2"
            />
          ))}
        </figure>
      </section>
    );
  else return <></>;
};

export default GaleryPersonajes;
