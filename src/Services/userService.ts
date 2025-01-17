import { chapterData, novelData, userData, volumenData } from "@/Types/Types";

const fromToJsonMapUser = (
  data: Partial<Record<string, unknown>>
): userData => {
  return {
    id: data["id"]?.toString() ?? "",
    full_name: data["full_name"]?.toString() ?? "",
    avatar_url: data["avatar_url"]?.toString() ?? "",
    email: data["email"]?.toString() ?? "",
    role: data["role"]?.toString() ?? "",
    acceso: data["acceso"]?.toString() ?? "",
    activo: data["activo"]?.toString() ?? "",
    firstsession: data["firstsession"]?.toString() ?? "",
    status: data["status"]?.toString() ?? "",
    updated_at: new Date(data["updated_at"]?.toString() ?? ""),
  };
};

const fromToJsonMapNovel = (
  novel: Partial<Record<string, unknown>>
): novelData => {
  return {
    id: novel["id"]?.toString() ?? "",
    novelId: novel["novelId"]?.toString() ?? "",
    titleNovel: novel["titleNovel"]?.toString() ?? "",
    volumenesActuales: Number(novel["volumenesActuales"]) || 0,
    nombresAlternos: novel["nombresAlternos"]?.toString() ?? "",
    background: novel["background"]?.toString() ?? "",
    portada: novel["portada"]?.toString() ?? "",
    tipoNovela: novel["tipoNovela"]?.toString() ?? "",
    generos: novel["generos"]?.toString() ?? "",
    autor: novel["autor"]?.toString() ?? "",
    sinopsis: novel["sinopsis"]?.toString() ?? "",
    ilustracionesAtuales: novel["ilustracionesActuales"]?.toString() ?? "",
    statusNovel: novel["statusNovel"]?.toString() ?? "",
    personajes: novel["personajes"]?.toString() ?? "",
  };
};

const fromToJsonMapVol = (
  data: Partial<Record<string, unknown>>
): volumenData => {
  return {
    nombreNovela: data["nombreNovela"]?.toString() ?? "",
    portadaVolumen: data["portadaVolumen"]?.toString() ?? "",
    volumen: Number(data["volumen"]) ?? 0,
    links: data["links"] && Array.isArray(data["links"]) ? data["links"] : [],
    disponibilidad: data["disponibilidad"]?.toString() ?? "",
    createdAt: Number(data["createdAt"]) ?? 0,
    volumenId: data["volumenId"]?.toString() ?? "",
    novelId: data["novelId"]?.toString() ?? "",
    id: data["id"]?.toString() ?? "",
  };
};

const fromToJsonMapChapter = (
  data: Partial<Record<string, unknown>>
): chapterData => {
  return {
    capituloId: data["capituloId"]?.toString() ?? "",
    nombreNovela: data["nombreNovela"]?.toString() ?? "",
    capitulo: Number(data["capitulo"]?.toString()) ?? 0,
    nombreCapitulo: data["nombreCapitulo"]?.toString() ?? "",
    volumenPertenece: Number(data["volumenPertenece"]) ?? 0,
    contenido: data["contenido"]?.toString() ?? "",
    novelId: data["novelId"]?.toString() ?? "",
    createdAt: Number(data["createdAt"]) ?? 0,
    id: data["id"]?.toString() ?? "",
  };
};

interface Illustration {
  image: string;
}

const extractIllustrations = (
  items: (novelData | volumenData)[]
): Illustration[] => {
  const validImageUrls = ["https://i.ibb.co", "https://res.cloudinary"];
  const imageKeys = ["portada", "background"] as const;

  return items.reduce<Illustration[]>((illustrations, item) => {
    imageKeys.forEach((key) => {
      const imageUrl = (item as never)[key];
      if (!imageUrl || typeof imageUrl !== "string") return;

      const isValidBackground =
        key !== "background" ||
        validImageUrls.some((url) => (imageUrl as string).startsWith(url))

      if (isValidBackground) {
        illustrations.push({ image: imageUrl });
      }
    });

    return illustrations;
  }, []);
};

export {
  fromToJsonMapUser,
  fromToJsonMapNovel,
  fromToJsonMapVol,
  fromToJsonMapChapter,
  extractIllustrations,
};
