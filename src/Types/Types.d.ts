interface userData {
  id: string;
  full_name: string;
  avatar_url: string;
  email: string;
  role: string;
  acceso: string;
  activo: string;
  firstsession: string;
  status: string;
  updated_at?: Date;
}

interface novelData {
  // [key: string]: string | number | undefined;
  id: string;
  novelId: string;
  titleNovel: string;
  volumenesActuales: number;
  nombresAlternos: string;
  background: string;
  portada: string;
  tipoNovela: string;
  generos: string;
  autor: string;
  sinopsis: string;
  ilustracionesAtuales: string;
  statusNovel: string;
  personajes: string;
}

type novelDataWithIds = Omit<novelData, "idNovel" | "id" | "novelId">;
type novelDataWithNotIdNNovel = Omit<novelData, "novelId">;

type novelDataWithoutVolumenes = Omit<
  novelData,
  | "volumenesActuales"
  | "nombresAlternos"
  | "background"
  | "generos"
  | "autor"
  | "ilustracionesAtuales"
  | "personajes"
>;

type novelDataWithoutDescription = Omit<
  novelData,
  "novelId" | "background" | "ilustracionesAtuales" | "personajes"
>;

interface volumenData {
  [key: string]: string | string[] | number | undefined;
  id: string;
  volumenId: string;
  nombreNovela: string;
  portadaVolumen: string;
  volumen: number;
  links: string[];
  disponibilidad: string;
  createdAt: number;
  novelId: string;
}

type volumenDataWithoutVolumen = Omit<
  volumenData,
  "portadaVolumen" | "links" | "disponibilidad"
>;

type volumenDataWithNotContentType = Omit<
  volumenData,
  "createdAt" | "id" | "volumenId"
>;

interface chapterData {
  // [key: string]: string | number | undefined;
  id: string;
  capituloId: string;
  nombreNovela: string;
  capitulo: number;
  nombreCapitulo: string;
  volumenPertenece: number;
  contenido: string;
  novelId: string;
  createdAt: number;
}

type chapterDataWithoutContentChapter = Omit<
  chapterData,
  "contenido" | "capitulo"
>;

interface chapterDatNotContent
  extends Omit<chapterData, "id" | "createdAt" | "capituloId"> {}

interface lastChapter extends Omit<chapterData, "contenido"> {
  imageUrl: string;
}

type chapterDataWithoutContentId = Omit<
  chapterData,
  "createdAt" | "capituloId"
>;

interface siteConfig {
  backgroud: string;
  titleSite: string;
  titleSiteWeb: string;
  backgroudSite: string;
  linkFacebook: string;
  mensajeSite: string;
  isMaintenanceMode: string;
  id?: string;
}

enum MyTypesStatus {
  activo = "activo",
  inactivo = "inactivo",
  proceso = "proceso",
  pendiente = "pendiente",
}

type MyTypes = userData | volumenData | chapterData | siteConfig;

type CombinedType = volumenData | chapterData | siteConfig;

type CombinedTypeContent = volumenData | chapterData | novelData;

interface ExtendedType extends CombinedType {
  typeDatareceive: string;
}

interface TypeDataNotification {
  message: string;
  nameUser: string;
  id?: string;
}

type Ruta = "novela" | "volumen" | "capitulo";

export {
  userData,
  novelDataWithoutVolumenes,
  novelDataWithIds,
  novelDataWithNotIdNNovel,
  novelDataWithoutDescription,
  volumenData,
  volumenDataWithoutVolumen,
  volumenDataWithNotContent,
  volumenDataWithNotContentType,
  chapterData,
  chapterDataWithoutContentChapter,
  chapterDatNotContent,
  lastChapter,
  chapterDataWithoutContentId,
  MyTypes,
  siteConfig,
  novelData,
  MyTypesStatus,
  TypeDataNotification,
  CombinedType,
  ExtendedType,
  CombinedTypeContent,
  Ruta,
};
