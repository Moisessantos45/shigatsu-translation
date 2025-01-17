import React, { useEffect, useRef, useState } from "react";
import { chapterData, volumenData } from "@/Types/Types";
import useUserStore from "@/Store/useUserStore";
import { NavLink } from "react-router-dom";
import ModalConfirm from "./ModalConfirm";
import ModalEdit from "./ModalEdit";
import UseStateSocket from "@/Store/UseStateSocket";
import usePageNavigations from "@/Store/PageNavigations";
import { v4 as uuidv4 } from "uuid";
import useChapters from "@/Store/UseChapters";
import useVolumens from "@/Store/UseVolumens";
import { isChapterData, isVolumenData } from "@/Utils/utils";
import useInteractionStore from "@/Store/InteracionState";

interface TableRenderContentProps {
  dataContent: volumenData[] | chapterData[];
  typeContent: string;
}

const TableRenderContent: React.FC<TableRenderContentProps> = ({
  typeContent,
  dataContent,
}): JSX.Element => {
  const {
    isDarkMode,
    isDrawerOpen,
    isVisibleModal,
    confirmDialog,
    setIsDrawerOpen,
    setIsVisibleModal,
    setConfirmDialog,
  } = useInteractionStore();
  const { dataUser } = useUserStore();
  const { setChapterData, removeChapter } = useChapters();
  const { setVolumenData, removeVolumen } = useVolumens();
  const { emitir } = UseStateSocket();
  const { numberNotification, setNumberNotification } = useUserStore();
  const {
    itemsPerPage,
    page,
    setLength,
    prevPageNavigation,
    nextPageNavigation,
  } = usePageNavigations();

  const [filterDataSearch, setFilterDataSearch] = useState<
    volumenData[] | chapterData[]
  >([]);
  const [search, setSearch] = useState<string>("");
  const [searchVolumen, setSearchVolumen] = useState("");
  const isConfirmDialog = useRef(false);
  const id = useRef<string>("");

  const handelClickDelete = async (id: string) => {
    const newDataContent: volumenData[] | chapterData[] = dataContent.filter(
      (item) => item.id !== id
    ) as [];
    setFilterDataSearch(newDataContent);
    setNumberNotification(numberNotification + 1);

    await removeVolumen(id);
    emitir("deleteContent", {
      id: dataUser.id,
      nameUser: id,
      message: "Ha sido eliminado un contenido",
    });
  };

  useEffect(() => {
    isConfirmDialog.current = confirmDialog;
    if (isConfirmDialog.current && dataUser.role === "administrador") {
      handelClickDelete(id.current);
      setConfirmDialog(false);
    }
  }, [confirmDialog]);

  useEffect(() => {
    const filterDataResultSearch: volumenData[] | chapterData[] =
      dataContent.filter((data) => {
        const matchesSearch = data.nombreNovela
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesVolumen =
          searchVolumen && data.volumenPertenece
            ? +data.volumenPertenece === +searchVolumen
            : true;
        return matchesSearch && matchesVolumen;
      }) as [];
    setLength(filterDataResultSearch.length);
    setFilterDataSearch(filterDataResultSearch);
  }, [dataContent, search, searchVolumen, page]);

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filterDataSearch.length);

  const visibleItems: volumenData[] | chapterData[] = filterDataSearch.slice(
    startIndex,
    endIndex
  );

  const handelClick = (data: volumenData) => {
    setIsVisibleModal(true);
    setVolumenData(data);
  };

  const handelClickDeleteChapter = async (data: chapterData) => {
    const folder = `${data.novelId}/${data.volumenPertenece}`;
    await removeChapter(data.id, { folder, idFile: data.capituloId });
  };

  return (
    <section className=" h-screen overflow-y-auto scrollbar">
      <div className=" w-full flex justify-between items-center">
        <form className=" w-10/12 m-auto flex justify-center">
          <input
            type="search"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full p-3 pl-6 text-base text-slate-600 border border-gray-300 rounded-lg zinc-100 focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:text-slate-800 search"
          />
        </form>
        <select
          className="w-14 m-auto p-3 text-base text-slate-600 border border-gray-300 rounded-lg zinc-100 focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:text-slate-800 search"
          onChange={(e) => setSearchVolumen(e.target.value)}
          value={searchVolumen}
        >
          {[
            ...new Set(
              dataContent.map(({ volumenPertenece }) => volumenPertenece)
            ),
          ].map((item) => (
            <option key={uuidv4()} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <article
        className={` w-12/12 overflow-x-auto overflow-hidden scrollbar rounded-md sm:flex sm:justify-center m-auto mt-2 p-2 flex-col ${
          isDarkMode ? "text-white" : "text-black"
        }`}
      >
        <table className="w-full border border-spacing-1 border-neutral-300">
          <thead className=" border-b-[1px] border border-neutral-300">
            <tr className="text-left text-xs font-semibold uppercase tracking-widest rounded-md">
              <th className="px-5 py-2 text-center">Nombre de la Novela</th>
              {typeContent == "volumen" ? (
                <>
                  <th className="px-5 py-2 text-center">Volumen</th>
                  <th className="px-1 py-2 text-center">links</th>
                  <th className="px-1 py-2 text-center">Nombre</th>
                  <th className="px-1 py-2 text-center">Disponibilidad</th>
                  <th className="px-1 py-2 text-center">Novel Id</th>
                </>
              ) : (
                <>
                  <th className="px-5 py-2 text-center">capitulo</th>
                  <th className="px-1 py-2 text-center">nombreCapitulo</th>
                  <th className="px-5 py-2 text-center">volumenPertenece</th>
                  <th className="px-5 py-2 text-center">contenido</th>
                </>
              )}
              <th className="px-5 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="w-full items_products">
            {visibleItems.map((data: volumenData | chapterData) => (
              <tr key={uuidv4()}>
                <td className="border-b border-gray-200 px-2 py-5 text-sm">
                  <div className="flex m-auto h-30 sm:h-28 w-40 break-all overflow-auto scrollbar font-medium">
                    <p>{data.nombreNovela}</p>
                  </div>
                </td>
                <td className=" border-b border-gray-200 px-2 py-1 text-sm">
                  <div className="flex m-auto h-30 sm:h-28 w-5 justify-center break-all overflow-auto scrollbar font-medium">
                    <p>{"volumen" in data ? data.volumen : data.capitulo}</p>
                  </div>
                </td>
                <td className=" border-b border-gray-200 px-2 py-1 text-sm">
                  <div className="flex m-auto h-30 sm:h-28 w-40 break-all overflow-auto scrollbar font-medium">
                    <p>
                      {"volumen" in data
                        ? data.links.join(", ")
                        : data.nombreCapitulo}
                    </p>
                  </div>
                </td>
                <td className=" border-b border-gray-200 px-2 py-1 text-sm">
                  <div
                    className={`flex m-auto h-30 sm:h-28 ${
                      typeContent === "volumen" ? "w-40" : "w-5"
                    } justify-center break-all overflow-auto scrollbar font-medium`}
                  >
                    <p>
                      {"volumen" in data
                        ? data.nombreNovela
                        : data.volumenPertenece}
                    </p>
                  </div>
                </td>
                <td
                  className={`border-b border-gray-200 px-2 ${
                    typeContent === "volumen" ? "" : "overflow-y-auto scrollbar"
                  } sm:overflow-auto `}
                >
                  <div
                    className={`flex m-auto h-30 sm:h-28 ${
                      typeContent === "volumen" ? "w-40" : "w-80 "
                    } break-all`}
                  >
                    <p className="flex w-full font-medium text-sm">
                      {"volumen" in data
                        ? data.disponibilidad
                        : data.contenido.substring(0, 230) + "..."}
                    </p>
                  </div>
                </td>
                {typeContent === "volumen" && (
                  <td className=" border-b border-gray-200 px-2 py-1 text-sm">
                    <div className="flex m-auto h-30 sm:h-28 w-40 break-all overflow-auto scrollbar font-medium">
                      <p>{data.novelId}</p>
                    </div>
                  </td>
                )}
                {/* editar funciones  estan son iguales para todos*/}
                <td className="border-b border-gray-200 px-2 py-5">
                  <div className="flex flex-col sm:flex-row m-auto h-30 sm:h-28 items-center w-12 sm:w-24 gap-1 justify-evenly">
                    {typeContent == "volumen" ? (
                      <button
                        className="flex h-10 w-9 justify-center items-center bg-blue-500 text-white p-2 rounded-lg"
                        onClick={() => handelClick(isVolumenData(data))}
                      >
                        <i className="fa-solid fa-pencil text-base text-yellow-500" />
                      </button>
                    ) : (
                      <NavLink
                        className="bg-blue-600 text-white rounded-lg h-10 w-9 flex justify-center items-center"
                        to={`/dashboard/${dataUser.id}/add-chapter?id=${data.id}`}
                        onClick={() => {
                          setChapterData(isChapterData(data));
                        }}
                      >
                        <i className="fa-solid fa-pencil text-base text-yellow-500"></i>
                      </NavLink>
                    )}
                    <button
                      className={`text-white rounded-lg h-10 p-2 w-9 flex justify-center items-center ${
                        dataUser.role === "administrador"
                          ? "bg-red-500"
                          : "bg-rose-400 cursor-not-allowed"
                      }`}
                      onClick={() => {
                        if (dataUser.role === "administrador") {
                          if ("volumen" in data && data.id) {
                            id.current = data.id;
                          } else {
                            handelClickDeleteChapter(data as chapterData);
                          }
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
          <span className="text-xs text-slate-300 sm:text-sm">
            Showing 1 to 6 of 12 Entries{" "}
          </span>
          <div className="mt-2 inline-flex sm:mt-0 text-slate-300">
            {page > 1 && (
              <button
                className="mr-2 h-10 w-10 rounded-full border text-sm font-semibold transition duration-150 hover:bg-gray-100"
                disabled={page === 1}
                onClick={prevPageNavigation}
              >
                Prev
              </button>
            )}

            <button
              className="h-10 w-10 rounded-full border text-sm font-semibold transition duration-150 hover:bg-gray-100"
              disabled={endIndex >= filterDataSearch.length}
              onClick={nextPageNavigation}
            >
              Next
            </button>
          </div>
        </div>
      </article>
      {isVisibleModal && <ModalEdit />}
      {isDrawerOpen && <ModalConfirm />}
    </section>
  );
};

export default TableRenderContent;
