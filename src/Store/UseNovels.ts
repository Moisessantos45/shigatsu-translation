import ErrorHandler from "@/Services/ErrorHandler";
import { fromToJsonMapNovel } from "@/Services/userService";
import {
  novelData,
  novelDataWithIds,
  novelDataWithNotIdNNovel,
} from "@/Types/Types";
import { toastify } from "@/Utils/utils";
import { create } from "zustand";
import {
  getDocs,
  collection,
  addDoc,
  setDoc,
  doc,
} from "firebase/firestore/lite";
import { dbFirebaseLite } from "@/Config/firebase";
import {
  doc as docFirestore,
  collection as collectionFirestore,
  runTransaction,
  query,
  where,
  getDocs as getDocsFirestore,
} from "firebase/firestore";
import dbFirebase from "@/Config/firebase";
import { v4 as uuidv4 } from "uuid";

interface StateNovels {
  novels: novelData[];
  novelData: novelData;
  length: number;
  setNovels: (novels: novelData[]) => void;
  setNovelData: (novelData: novelData) => void;
  setLength: (length: number) => void;
  getNovels: () => Promise<novelData[]>;
  addNovel: (novel: novelDataWithIds) => Promise<void>;
  updateNovel: (novel: novelDataWithNotIdNNovel) => Promise<void>;
  removeNovel: (id: string) => Promise<void>;
  changeStatusState: (id: string, status: string) => Promise<void>;
}

const useNovels = create<StateNovels>()((set, get) => ({
  novels: [],
  novelData: {} as novelData,
  length: 0,
  setNovels: (novels) => set({ novels }),
  setNovelData: (novelData) => set({ novelData }),
  setLength: (length) => set({ length }),
  getNovels: async () => {
    try {
      const q = await getDocs(collection(dbFirebaseLite, "novelasData"));
      const data = q.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const mapToJson = data.map(fromToJsonMapNovel);
      set({ novels: mapToJson });
      set({ length: mapToJson.length });
      return mapToJson;
    } catch (error) {
      ErrorHandler(error);
      return [];
    }
  },
  addNovel: async (novel) => {
    try {
      const findNovel = get().novels.find(
        (item) => item.titleNovel === novel.titleNovel
      );
      if (findNovel) {
        toastify("La novela ya existe", false);
        return;
      }

      const newNovel = { ...novel, createdAt: Date.now(), novelId: uuidv4() };
      const docRef = await addDoc(
        collection(dbFirebaseLite, "novelasData"),
        newNovel
      );
      const extendsNovel = { ...newNovel, id: docRef.id };

      await setDoc(
        doc(dbFirebaseLite, "novelasData", docRef.id),
        extendsNovel,
        {
          merge: true,
        }
      );

      set((state) => ({ novels: [...state.novels, extendsNovel] }));
      toastify("Novela agregada", true);
    } catch (error) {
      ErrorHandler(error);
    }
  },
  updateNovel: async (novel) => {
    const { id, ...rest } = novel;
    try {
      const findNovel = get().novels.find((item) => item.id === id);
      if (!findNovel?.id) {
        toastify("La novela no existe", false);
        return;
      }

      const updatedNovel = Object.keys(rest).reduce(
        (acc: Partial<novelDataWithNotIdNNovel>, key) => {
          const typedKey = key as keyof typeof rest;
          if (rest[typedKey] !== findNovel[typedKey]) {
            acc[typedKey] = rest[typedKey];
          }
          return acc;
        },
        {} as Partial<novelDataWithNotIdNNovel>
      );

      const changedKeys = Object.keys(updatedNovel);
      if (changedKeys.length === 0) {
        toastify("No hay cambios", false);
        return;
      }

      await runTransaction(dbFirebase, async (transaction) => {
        const docRef = docFirestore(dbFirebase, "novelasData", id);
        const docSnap = await transaction.get(docRef);
        if (!docSnap.exists()) {
          throw new Error("Document does not exist");
        }

        transaction.update(docRef, updatedNovel);

        if (updatedNovel?.titleNovel) {
          const newName = updatedNovel.titleNovel
            .split(" ")
            .slice(0, 4)
            .join(" ")
            .toLowerCase();

          const [qVol, qChap] = await Promise.all([
            query(
              collectionFirestore(dbFirebase, "volumenesNovela"),
              where("novelId", "==", id)
            ),
            query(
              collectionFirestore(dbFirebase, "chaptersNovels"),
              where("novelId", "==", id)
            ),
          ]);

          const [querySnapshotVol, querySnapshotChapters] = await Promise.all([
            getDocsFirestore(qVol),
            getDocsFirestore(qChap),
          ]);

          querySnapshotVol.docs.forEach((doc) => {
            const docRef = docFirestore(dbFirebase, "volumenesNovela", doc.id);
            transaction.update(docRef, {
              nombreNovela: newName,
            });
          });

          querySnapshotChapters.docs.forEach((doc) => {
            const docRef = docFirestore(dbFirebase, "chaptersNovels", doc.id);
            transaction.update(docRef, {
              nombreNovela: newName,
            });
          });
        }
      });

      const msg = "Novela actualizada";
      toastify(msg, true);
    } catch (error) {
      ErrorHandler(error);
    }
  },
  removeNovel: async (id) => {
    try {
      const findNovel = get().novels.find((item) => item.id === id);
      if (!findNovel?.id) {
        toastify("La novela no existe", false);
        return;
      }

      await runTransaction(dbFirebase, async (transaction) => {
        const docRef = docFirestore(dbFirebase, "novelasData", id);
        const docSnap = await transaction.get(docRef);
        if (!docSnap.exists()) {
          throw new Error("Document does not exist");
        }

        transaction.delete(docRef);
        const [qVol, qChap] = await Promise.all([
          query(
            collectionFirestore(dbFirebase, "volumenesNovela"),
            where("novelId", "==", id)
          ),
          query(
            collectionFirestore(dbFirebase, "chaptersNovels"),
            where("novelId", "==", id)
          ),
        ]);

        if (!qVol || !qChap) return;

        const [querySnapshotVol, querySnapshotChapters] = await Promise.all([
          getDocsFirestore(qVol),
          getDocsFirestore(qChap),
        ]);

        querySnapshotVol.docs.forEach((doc) => {
          const docRef = docFirestore(dbFirebase, "volumenesNovela", doc.id);
          transaction.delete(docRef);
        });

        querySnapshotChapters.docs.forEach((doc) => {
          const docRef = docFirestore(dbFirebase, "chaptersNovels", doc.id);
          transaction.delete(docRef);
        });
      });

      const newDataNovel = get().novels.filter((item) => item.id !== id);
      set({ novels: newDataNovel });
      const msg = "Novela eliminada";
      toastify(msg, true);
    } catch (error) {
      ErrorHandler(error);
    }
  },
  changeStatusState: async (id, status) => {
    try {
      const findNovel = get().novels.find((item) => item.id === id);
      if (!findNovel?.id) {
        toastify("La novela no existe", false);
        return;
      }

      await runTransaction(dbFirebase, async (transaction) => {
        const docRef = docFirestore(dbFirebase, "novelasData", id);
        const docSnap = await transaction.get(docRef);
        if (!docSnap.exists()) {
          throw new Error("Document does not exist");
        }

        transaction.update(docRef, { statusNovel: status });
      });

      const msg = "Estado actualizado";
      toastify(msg, true);
    } catch (error) {
      ErrorHandler(error);
    }
  },
}));

export default useNovels;
