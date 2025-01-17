import { NavLink } from "react-router-dom";
import ModalConfirm from "@/Components/ModalConfirm";
import useUserStore from "@/Store/useUserStore";
import { useEffect, useRef, useState } from "react";
import { novelData } from "@/Types/Types";
import UseStateSocket from "@/Store/UseStateSocket";
import usePageNavigations from "@/Store/PageNavigations";
import { useQuery } from "@tanstack/react-query";
import useNovels from "@/Store/UseNovels";
import Loading from "@/Components/Loading";
import useInteractionStore from "@/Store/InteracionState";

interface BotonsStatus {
  [key: string]: string;
  activo: string;
  inactivo: string;
  proceso: string;
  pendiente: string;
}

const PageVerNovelas = () => {
  const {
    getNovels,
    novels,
    removeNovel,
    setNovels,
    setNovelData,
    changeStatusState,
  } = useNovels();
  const {
    isDarkMode,
    isDrawerOpen,
    setIsDrawerOpen,
    setConfirmDialog,
    confirmDialog,
  } = useInteractionStore();
  const { dataUser } = useUserStore();
  const { emitir } = UseStateSocket();
  const {
    setPage,
    setLength,
    length,
    page,
    nextPageNavigation,
    prevPageNavigation,
    itemsPerPage,
  } = usePageNavigations();
  const [filterNovelSearch, setFilterNovelSearch] = useState<novelData[]>([]);
  const [search, setSearch] = useState<string>("");
  const [endIndex, setEndIndex] = useState<number>(0);

  const isConfirmDialog = useRef(false);
  const id = useRef<string>("");

  const botonsStatus: BotonsStatus = {
    activo: "bg-green-500",
    inactivo: "bg-gray-500",
    proceso: "bg-blue-500",
    pendiente: "bg-yellow-500",
  };

  const modifyStatus = async (id: string, status: string) => {
    const newDataNovel: novelData[] = novels.map((item) =>
      item.novelId === id ? { ...item, statusNovel: status } : item
    );
    setNovels(newDataNovel);
    setFilterNovelSearch(newDataNovel);

    await changeStatusState(id, status);

    emitir("changeStatusState", {
      nameUser: id,
      message: "Novela ha cambiado de estado",
    });
  };

  const deleteItemNovel = async (id: string) => {
    await removeNovel(id);
    const newDataNovel: novelData[] = novels.filter((item) => item.id !== id);
    setNovels(newDataNovel);
    setFilterNovelSearch(newDataNovel);

    emitir("deleteContent", {
      nameUser: id,
      message: "Novela ha sido eliminado",
    });
  };

  useEffect(() => {
    isConfirmDialog.current = confirmDialog;
    if (isConfirmDialog.current && dataUser.role === "administrador") {
      deleteItemNovel(id.current);
      setConfirmDialog(false);
    }
  }, [confirmDialog]);

  const getContentNovels = async () => {
    try {
      await getNovels();
      setLength(novels.length);
      setPage(1);
    } catch (error) {
      return error;
    }
  };

  const { isLoading } = useQuery({
    queryKey: ["novelsDataAdmin"],
    queryFn: getContentNovels,
    refetchInterval: 60000,
    refetchOnWindowFocus: false,
    retry: 0,
  });

  useEffect(() => {
    const filterSearchResulNovel: novelData[] = novels.filter(
      (novel) =>
        novel.titleNovel.toLowerCase().includes(search.toLowerCase()) ||
        novel.id.toLowerCase().includes(search.toLowerCase())
    );
    setLength(filterSearchResulNovel.length);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(
      startIndex + itemsPerPage,
      filterSearchResulNovel.length
    );
    setEndIndex(endIndex);
    setFilterNovelSearch(filterSearchResulNovel.slice(startIndex, endIndex));
  }, [novels, search, page]);

  if (isLoading) return <Loading />;
  return (
    <>
      <form className=" w-11/12 m-auto flex justify-center">
        <input
          type="search"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`block w-full p-3 pl-6 text-base border rounded-lg focus:ring-blue-500 focus:border-blue-500 search ${
            isDarkMode
              ? "text-slate-300 border-gray-700 bg-gray-800 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              : "text-slate-600 border-gray-300 bg-zinc-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
          }`}
        />
      </form>
      <article className=" w-12/12 overflow-x-auto overflow-hidden scrollbar rounded-md sm:flex sm:justify-center m-auto mt-2 p-2 flex-col">
        <table className="w-full border border-spacing-1 rounded-md">
          <thead className="border-b-[1px]">
            <tr className="text-left text-xs font-semibold uppercase tracking-widest rounded-md">
              <th className="px-5 py-2 text-center w-32">Imagen</th>
              <th className="px-5 py-2 text-center">Titulo</th>
              <th className="px-5 py-2 text-center">Status</th>
              <th className="px-5 py-2 text-center">Sinopsis</th>
              <th className="px-5 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="w-full items_products">
            {filterNovelSearch.map((item) => (
              <tr key={item.id}>
                <td className="border-b px-2 py-1 text-sm">
                  <figure className="flex m-auto h-24 sm:h-28 items-center w-28 justify-center">
                    <img
                      className="flex w-24 h-24 sm:h-28"
                      src={item.portada}
                      alt={item.titleNovel}
                    />
                  </figure>
                </td>
                <td className="border-b px-2 py-5 text-[12px] sm:text-[13px]">
                  <div className="flex m-auto h-24 sm:h-28 w-40 sm:w-48 break-all overflow-auto scrollbar font-medium">
                    <p>{item.titleNovel}</p>
                  </div>
                </td>
                <td className="border-b px-2 py-2">
                  <div
                    className={`flex m-auto gap-1 h-24 sm:h-28 flex-wrap items-center w-32 justify-center text-[10px] capitalize ${
                      !isDarkMode ? "text-black" : "text-white"
                    } `}
                  >
                    <span
                      className={`${
                        item.statusNovel === "activo"
                          ? botonsStatus[item.statusNovel]
                          : ""
                      } border p-1 rounded-md cursor-pointer`}
                      onClick={() => modifyStatus(item.id, "activo")}
                    >
                      activo
                    </span>
                    <span
                      className={`${
                        item.statusNovel === "inactivo"
                          ? botonsStatus[item.statusNovel]
                          : ""
                      } border p-1 rounded-md cursor-pointer`}
                      onClick={() => modifyStatus(item.id, "inactivo")}
                    >
                      inactivo
                    </span>
                    <span
                      className={`${
                        item.statusNovel === "proceso"
                          ? botonsStatus[item.statusNovel]
                          : ""
                      } border p-1 rounded-md cursor-pointer`}
                      onClick={() => modifyStatus(item.id, "proceso")}
                    >
                      proceso
                    </span>
                    <span
                      className={`${
                        item.statusNovel === "pending"
                          ? botonsStatus[item.statusNovel] + " text-white"
                          : isDarkMode
                          ? "text-white"
                          : "text-black"
                      } border p-1 rounded-m cursor-pointer`}
                      onClick={() => modifyStatus(item.id, "pending")}
                    >
                      pending
                    </span>
                  </div>
                </td>
                <td className="border-b px-2 sm:overflow-auto overflow-y-auto scrollbar">
                  <div className="flex m-auto h-24 sm:h-28 w-80 break-all">
                    <p className="flex w-full font-medium text-[12px] sm:text-[13px]">
                      {item.sinopsis.substring(0, 220) + "..."}
                    </p>
                  </div>
                </td>
                <td className="border-b px-2 py-5">
                  <div className="flex flex-col sm:flex-row m-auto h-24 sm:h-28 items-center w-12 sm:w-24 gap-1 justify-evenly">
                    <NavLink
                      to={`/dashboard/${dataUser.id}/add-novel?id=${item.id}`}
                      className="flex h-10 w-9 justify-center items-center bg-blue-500 text-white p-2 rounded-lg"
                      onClick={() => setNovelData(item)}
                    >
                      <i className="fa-solid fa-pencil text-base text-yellow-500" />
                    </NavLink>
                    <button
                      className={`text-white rounded-lg h-10 p-2 w-9 flex justify-center items-center ${
                        dataUser.role === "administrador"
                          ? "bg-red-500"
                          : "bg-rose-400 cursor-not-allowed"
                      }`}
                      onClick={() => {
                        if (dataUser.role === "administrador" && item.id) {
                          id.current = item.id;
                          setIsDrawerOpen(true);
                        }
                      }}
                      disabled={dataUser.role !== "administrador"}
                    >
                      <i className="fa-solid bg-transparent text-base fa-trash rounded-l"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-col items-center border-t px-5 py-3 sm:flex-row sm:justify-between">
          <span className="text-xs sm:text-sm">
            Showing 1 to 6 of {novels.length} Entries
          </span>
          <div className="mt-2 inline-flex sm:mt-0">
            {page > 1 && (
              <button
                className="mr-2 h-10 w-10 rounded-full border text-sm font-semibold transition duration-150 hover:bg-gray-100"
                disabled={page === 1}
                onClick={prevPageNavigation}
              >
                Prev
              </button>
            )}

            {endIndex < length && (
              <button
                className="h-10 w-10 rounded-full border text-sm font-semibold transition duration-150 hover:bg-gray-100 cursor-pointer"
                disabled={endIndex >= length}
                onClick={nextPageNavigation}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </article>

      {isDrawerOpen && <ModalConfirm />}
    </>
  );
};

export default PageVerNovelas;
