import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { chapterData, Ruta, volumenData } from "@/Types/Types";

const formatTimestampToDate = (timestamp: number) => {
  const fecha = new Date(timestamp);
  return `${fecha.getDate()}/${fecha.getMonth()}/${fecha.getFullYear()}`;
};

const toastify = (text: string, type: boolean) => {
  Toastify({
    text: `${text}`,
    duration: 3000,
    newWindow: true,
    // close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: type
        ? "linear-gradient(to right, #00b09b, #96c93d)"
        : "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
      borderRadius: "10px",
    },
  }).showToast();
};

const obtenerRuta = (ruta: Ruta): string => {
  const rutas: Record<Ruta, string> = {
    novela: "Novels/addNovels/",
    volumen: "Volumenes/volumenes/",
    capitulo: "ChaptersHandler/chapters/",
  };
  return rutas[ruta];
};

const obtenerRutaAdmin = (ruta: Ruta): string => {
  const rutas: Record<Ruta, string> = {
    novela: "Novels/addNovels/",
    volumen: "Volumenes",
    capitulo: "ChaptersHandler",
  };
  return rutas[ruta];
};

const isVolumenData = (data: unknown): volumenData => {
  return data as volumenData;
};

const isChapterData = (data: unknown): chapterData => {
  return data as chapterData;
};

function isData(data: string): string;
function isData(data: undefined): string;
function isData(data: string | undefined): string {
  if (data === undefined) {
    return "";
  }
  return data;
}

export {
  formatTimestampToDate,
  toastify,
  obtenerRuta,
  obtenerRutaAdmin,
  isVolumenData,
  isChapterData,
  isData,
};
