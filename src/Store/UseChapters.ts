import ErrorHandler from "@/Services/ErrorHandler";
import { fromToJsonMapChapter } from "@/Services/userService";
import {
  chapterDatNotContent,
  chapterData,
  chapterDataWithoutContentId,
} from "@/Types/Types";
import { toastify } from "@/Utils/utils";
import { create } from "zustand";
import {
  getDocs,
  collection,
  addDoc,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore/lite";
import { dbFirebaseLite } from "@/Config/firebase";
import supabase from "@/Config/supabase";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

interface StateChapters {
  chapters: chapterData[];
  chapterData: chapterData;
  length: number;
  lastChapter: chapterData[];
  setChapters: (chapters: chapterData[]) => void;
  setChapterData: (chapterData: chapterData) => void;
  setLength: (length: number) => void;
  setLastChapter: (lastChapter: chapterData[]) => void;
  getById: (id: string) => Promise<string | null>;
  uploadFile: (
    chapterDetails: chapterDataWithoutContentId | chapterDatNotContent,
    folder: string,
    id: string
  ) => Promise<string | null>;
  renameFile: (
    folder: string,
    chapterDetails: chapterDataWithoutContentId | chapterDatNotContent,
    id: string,
    newPath: number
  ) => Promise<string | null>;
  moveFiles: (
    folder: string,
    chapterDetails: chapterDataWithoutContentId | chapterDatNotContent,
    id: string,
    isChangeVolume?: number,
    isChangeNovel?: string
  ) => Promise<string | null>;
  uploadOrUpdateFile: (
    folder: string,
    filePath: string,
    file: Blob,
    fileExists: boolean
  ) => Promise<string | null>;
  getChapters: () => Promise<chapterData[]>;
  moveFile: (folder: string, oldPath: string, newPath: string) => Promise<void>;
  deleteFile: (folder: string, filePath: string) => Promise<void>;
  addChapter: (chapter: chapterDatNotContent) => Promise<void>;
  updateChapter: (
    chapter: chapterDataWithoutContentId,
    isChange: boolean
  ) => Promise<void>;
  removeChapter: (
    id: string,
    data: { folder: string; idFile: string }
  ) => Promise<void>;
}

const useChapters = create<StateChapters>()((set, get) => ({
  chapters: [],
  chapterData: {} as chapterData,
  length: 0,
  lastChapter: [],
  setChapters: (chapters) => set({ chapters }),
  setChapterData: (chapterData) => set({ chapterData }),
  setLength: (length) => set({ length }),
  setLastChapter: (lastChapter) => set({ lastChapter }),
  getById: async (id) => {
    try {
      const { data } = await axios(id);
      const content = data?.length > 0 ? data.split("+-----+")[1] : null;
      return content;
    } catch (error) {
      ErrorHandler(error);
      return null;
    }
  },
  uploadFile: async (chapterDetails, folder, id) => {
    try {
      const {
        novelId,
        volumenPertenece,
        capitulo,
        nombreCapitulo,
        nombreNovela,
      } = chapterDetails;
      const header = {
        capitulo,
        nombreCapitulo,
        nombreNovela,
        contenido: "",
      };

      const content =
        JSON.stringify(header) + "\n+-----+\n" + chapterDetails.contenido;

      const file = new Blob([content], { type: "text/plain" });
      const fileName = `${id}_cap-${capitulo}.txt`;

      const folderPath = `${novelId}/${volumenPertenece}`;
      const filePath = `${folderPath}/${fileName}`;

      // Verificar si el archivo existe
      const { data: dataExists, error: existsError } = await supabase.storage
        .from(folder)
        .list(folderPath);

      if (existsError?.message !== undefined) {
        throw existsError;
      }

      let findFile = false;
      if (dataExists && dataExists?.length > 0) {
        findFile = dataExists.some((item) => item.name === fileName);
      }

      await get().uploadOrUpdateFile(folder, filePath, file, findFile);

      // Obtener URL pública
      const {
        data: { publicUrl },
      } = supabase.storage.from(folder).getPublicUrl(filePath);
      return publicUrl;
    } catch (error) {
      ErrorHandler(error);
      return null;
    }
  },
  renameFile: async (folder, chapterDetails, id, newPath) => {
    try {
      const {
        novelId,
        volumenPertenece,
        capitulo,
        nombreCapitulo,
        nombreNovela,
      } = chapterDetails;
      const header = {
        capitulo: newPath,
        nombreCapitulo,
        nombreNovela,
        contenido: "",
      };

      const data = await get().getById(chapterDetails.contenido);
      if (!data) throw new Error("Error al obtener contenido");
      const content = JSON.stringify(header) + "\n+-----+\n" + data;

      const file = new Blob([content], { type: "text/plain" });
      let fileName = `${id}_cap-${capitulo}.txt`;

      const folderPath = `${novelId}/${volumenPertenece}`;
      let filePath = `${folderPath}/${fileName}`;

      const { data: dataExists, error } = await supabase.storage
        .from(folder)
        .list(folderPath);

      if (error?.message !== undefined || !dataExists) {
        throw error;
      }

      const findFile = dataExists.some((item) => item.name === fileName);
      if (!findFile) {
        throw new Error("Archivo no encontrado");
      }

      await get().deleteFile(folder, filePath);
      fileName = `${id}_cap-${newPath}.txt`;
      filePath = `${folderPath}/${fileName}`;

      const response = await get().uploadOrUpdateFile(
        folder,
        filePath,
        file,
        false
      );

      if (!response) throw new Error("Error al subir archivo");
      const {
        data: { publicUrl },
      } = supabase.storage.from(folder).getPublicUrl(response);

      return publicUrl;
    } catch (error) {
      ErrorHandler(error);
      return null;
    }
  },
  moveFiles: async (
    folder,
    chapterDetails,
    id,
    isChangeVolume,
    isChangeNovel
  ) => {
    try {
      const { novelId, volumenPertenece, capitulo } = chapterDetails;
      const fileName = `${id}_cap-${capitulo}.txt`;
      const folderPath = `${novelId}/${volumenPertenece}`;
      const filePath = `${folderPath}/${fileName}`;
      const newFolderPath = `${
        isChangeNovel !== undefined ? isChangeNovel : novelId
      }/${isChangeVolume !== undefined ? isChangeVolume : volumenPertenece}`;
      const newPath = `${newFolderPath}/${fileName}`;

      await get().moveFile(folder, filePath, newPath);
      const {
        data: { publicUrl },
      } = supabase.storage.from(folder).getPublicUrl(newPath);

      return publicUrl;
    } catch (error) {
      ErrorHandler(error);
      return null;
    }
  },
  uploadOrUpdateFile: async (folder, filePath, file, fileExists) => {
    let response = null;
    if (fileExists) {
      response = await supabase.storage
        .from(folder)
        .update(filePath, file, { contentType: "text/plain" });
    } else {
      response = await supabase.storage
        .from(folder)
        .upload(filePath, file, { contentType: "text/plain" });
    }
    if (response.error) {
      throw response.error;
    }
    const { data } = response;
    return data.path;
  },
  moveFile: async (folder, oldPath, newPath) => {
    const { error } = await supabase.storage
      .from(folder)
      .move(oldPath, newPath);
    if (error) {
      throw error;
    }
  },
  deleteFile: async (folder, filePath) => {
    const { error } = await supabase.storage.from(folder).remove([filePath]);
    if (error) {
      throw error;
    }
  },
  getChapters: async () => {
    try {
      const q = await getDocs(collection(dbFirebaseLite, "chaptersNovels"));
      const data = q.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const mapToJson = data.map(fromToJsonMapChapter);
      const sortChapters = mapToJson
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 5);
      set({ chapters: mapToJson });
      set({ lastChapter: sortChapters });
      return mapToJson;
    } catch (error) {
      ErrorHandler(error);
      return [];
    }
  },
  addChapter: async (chapter) => {
    try {
      const findChapter = get().chapters.find(
        (item) =>
          item.novelId === chapter.novelId &&
          item.capitulo === chapter.capitulo &&
          item.volumenPertenece === chapter.volumenPertenece
      );

      if (findChapter?.id) {
        toastify("Capitulo ya existe", false);
        return;
      }
      const newChapter = {
        ...chapter,
        createdAt: Date.now(),
        capituloId: uuidv4(),
      };

      const folder = "chapters";
      const data = await get().uploadFile(
        newChapter,
        folder,
        newChapter.capituloId
      );

      if (!data) {
        throw new Error("Error al subir archivo");
      }

      newChapter.contenido = data;

      const docRef = await addDoc(
        collection(dbFirebaseLite, "chaptersNovels"),
        newChapter
      );

      const extendsChapter = { ...newChapter, id: docRef.id };
      await setDoc(
        doc(dbFirebaseLite, "chaptersNovels", docRef.id),
        extendsChapter,
        {
          merge: true,
        }
      );

      set((state) => ({ chapters: [...state.chapters, extendsChapter] }));
      toastify("Capitulo agregado", true);
    } catch (error) {
      ErrorHandler(error);
    }
  },
  updateChapter: async (chapter, isChange) => {
    const { id, ...rest } = chapter;
    try {
      const findChapter = get().chapters.find((item) => item.id === id);

      if (!findChapter?.id) {
        toastify("Capitulo no existe", false);
        return;
      }

      const updatedChapter = Object.keys(rest).reduce(
        (acc: Partial<chapterDataWithoutContentId>, key) => {
          const typedKey = key as keyof typeof rest;
          if (rest[typedKey] !== findChapter[typedKey]) {
            // eslint-disable-next-line
            acc[typedKey] = rest[typedKey] as any;
          }
          return acc;
        },
        {} as Partial<chapterDataWithoutContentId>
      );

      const changedKeys = Object.keys(updatedChapter);

      if (
        changedKeys.length === 0 &&
        !isChange &&
        findChapter.contenido?.includes("supabase")
      ) {
        toastify("No hay cambios", false);
        return;
      }

      const folder = "chapters";
      if (
        updatedChapter?.contenido &&
        !updatedChapter.contenido?.includes("supabase")
      ) {
        const data = await get().uploadFile(
          { ...findChapter, contenido: updatedChapter.contenido },
          folder,
          findChapter.capituloId
        );
        if (!data) throw new Error("Error al subir archivo");
        updatedChapter.contenido = data;
      }

      if (updatedChapter?.capitulo !== undefined) {
        const data = await get().renameFile(
          folder,
          findChapter,
          findChapter.capituloId,
          updatedChapter.capitulo
        );
        if (!data) throw new Error("Error al subir archivo");
        updatedChapter.contenido = data;
      }

      if (
        updatedChapter?.volumenPertenece !== undefined ||
        updatedChapter?.novelId !== undefined
      ) {
        const data = await get().moveFiles(
          folder,
          findChapter,
          findChapter.capituloId,
          updatedChapter.volumenPertenece,
          updatedChapter.novelId
        );
        if (!data) throw new Error("Error al subir archivo");
        updatedChapter.contenido = data;
      }

      const docRef = doc(dbFirebaseLite, "chaptersNovels", id);
      await updateDoc(docRef, updatedChapter);

      set((state) => {
        const newChapters = state.chapters.map((item) => {
          if (item.id === id) {
            return { ...item, ...updatedChapter };
          }
          return item;
        });
        return { chapters: newChapters };
      });

      const msg = "Capitulo actualizado";
      toastify(msg, true);
    } catch (error) {
      ErrorHandler(error);
    }
  },
  removeChapter: async (id, data) => {
    try {
      const findChapter = get().chapters.find((item) => item.id === id);

      if (!findChapter?.id) {
        toastify("Capitulo no existe", false);
        return;
      }

      const docRef = doc(dbFirebaseLite, "chaptersNovels", id);
      await deleteDoc(docRef);
      const folder = "chapters";
      const folderName = `${data.folder}/${data.idFile}.txt`;
      await get().deleteFile(folder, folderName);

      const newDataChapter = get().chapters.filter((item) => item.id !== id);
      set({ chapters: newDataChapter });
      const msg = "Capitulo eliminado";
      toastify(msg, true);
    } catch (error) {
      ErrorHandler(error);
    }
  },
}));

export default useChapters;
