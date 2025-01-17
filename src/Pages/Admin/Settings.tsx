import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toastify } from "@/Utils/utils";
import usePageConfigStore from "@/Store/StateSiteHome";
import UrlBackendPrivate from "@/Config/UrlBackendPrivate";
import ErrorHandler from "@/Services/ErrorHandler";
import InputForm from "@/Components/UI/InputForm";
import useInteractionStore from "@/Store/InteracionState";

const Settings = () => {
  const { isDarkMode } = useInteractionStore();
  const { dataSite, changeStatusSite } = usePageConfigStore();
  const [titleSiteWeb, setTitleSiteWeb] = useState<string>("");
  const [titleSite, setTitleSite] = useState<string>("");
  const [backgroud, setBackgroud] = useState<string>("");
  const [backgroudSite, setBackgroudSite] = useState<string>("");
  const [linkFacebook, setLinkFacebook] = useState<string>("");
  const [mensajeSite, setMensajeSite] = useState<string>("");
  const [isMaintenanceMode, setIsMaintenanceMode] = useState<string>("false");

  const queryClient = useQueryClient();
  useEffect(() => {
    if (dataSite.id) {
      setTitleSiteWeb(dataSite.titleSiteWeb);
      setTitleSite(dataSite.titleSite);
      setBackgroud(dataSite.backgroud);
      setBackgroudSite(dataSite.backgroudSite);
      setLinkFacebook(dataSite.linkFacebook);
      setMensajeSite(dataSite.mensajeSite);
      setIsMaintenanceMode(JSON.stringify(dataSite.isMaintenanceMode));
    }
  }, []);

  const handelSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      const response = await UrlBackendPrivate.put("PanelAdmin/getConfig", {
        titleSiteWeb,
        titleSite,
        backgroud,
        backgroudSite,
        linkFacebook,
        mensajeSite,
      });
      const msg = response.data ? response.data.msg : "Error";
      toastify(msg, true);
    } catch (error) {
      ErrorHandler(error);
    }
  };

  const changesStatus = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== "") {
      setIsMaintenanceMode(e.target.value);
      await changeStatusSite(e.target.value);
      queryClient.invalidateQueries({
        queryKey: ["siteDataHome"],
      });
    }
  };

  return (
    <form
      className="sm:p-8 p-3 m-auto sm:w-10/12 w-full rounded-xl"
      onSubmit={handelSubmit}
    >
      <div className="flex flex-wrap items-center justify-between mb-3 pb-3 border-b border-gray-400 border-opacity-20">
        <div className="w-full sm:w-auto px-4 mb-2 sm:mb-0">
          <h4
            className={`text-2xl font-bold tracking-wide ${
              isDarkMode ? "text-white " : "text-gray-900"
            } mb-1`}
          >
            Setting
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Actualiza la informacion del sitio web
          </p>
        </div>
        <div className="w-full sm:w-auto px-4">
          <div>
            <button
              type="button"
              className="inline-block py-2 px-4 mr-3 text-xs text-center font-semibold leading-normal text-gray-700 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-block py-2 px-4 text-xs text-center font-semibold leading-normal text-blue-700 dark:text-blue-50 bg-blue-200 dark:bg-blue-500 hover:bg-blue-300 dark:hover:bg-blue-600 rounded-lg transition duration-200"
            >
              Save
            </button>
          </div>
        </div>
      </div>
      <fieldset className="flex w-full flex-col">
        <div className="p-2 w-full grid md:grid-cols-4 grid-cols-2 md:grid-rows-2 grid-rows-4 md:gap-2 gap-1 border-b border-gray-400 border-opacity-20 items-center">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 col-span-2 md:col-span-2 textWidthFitContent h-5">
            Titulo del sitio web
          </span>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 md:col-start-3 md:col-span-2 col-span-2 textWidthFitContent h-5">
            Titulo del banner
          </span>
          <InputForm
            classNames="md:col-span-2 col-span-2"
            id="formInput1-1"
            type="text"
            placeholder="...."
            value={titleSiteWeb}
            onChange={(e) => setTitleSiteWeb(e.target.value)}
          />
          <InputForm
            classNames="md:col-start-3 md:col-span-2 col-span-2"
            id="formInput1-2"
            type="text"
            placeholder="...."
            value={titleSite}
            onChange={(e) => setTitleSite(e.target.value)}
          />
        </div>

        <div className="p-2 w-full grid md:grid-cols-2 grid-cols-1 md:grid-rows-2 grid-rows-4 md:gap-2 border-b border-gray-400 border-opacity-20 items-center">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Background Sitio
          </span>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Background Banner
          </span>
          <InputForm
            classNames="md:col-span-1 col-span-1"
            id="formInput1-3"
            type="text"
            placeholder="...."
            value={backgroud}
            onChange={(e) => setBackgroud(e.target.value)}
          />
          <InputForm
            classNames="md:col-span-1 col-span-1"
            id="formInput1-4"
            type="text"
            placeholder="...."
            value={backgroudSite}
            onChange={(e) => setBackgroudSite(e.target.value)}
          />
        </div>
        <div className="p-2 w-full flex flex-col border-b border-gray-400 border-opacity-20 gap-2">
          <div className="w-full flex flex-col sm:justify-center gap-2">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Link de Facebook
            </span>
            <InputForm
              id="formInput1-5"
              type="text"
              placeholder="...."
              value={linkFacebook}
              onChange={(e) => setLinkFacebook(e.target.value)}
            />
          </div>
        </div>
        <div className="py-4 px-3 w-full text-gray-900 dark:text-gray-50 placeholder-gray-500 dark:placeholder-gray-50 font-medium outline-none bg-transparent focus:border-green-500 rounded-lg flex flex-col sm:flex-row gap-4 items-center text-sm">
          <div className="w-full flex flex-col">
            <h1
              className={`text-sm ${
                isDarkMode ? "text-white " : "text-gray-900"
              }`}
            >
              Modo de mantenimiento
              <span className="text-x">(Solo para administradores)</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="maintenanceMode"
              id="maintenanceOff"
              value="false"
              checked={isMaintenanceMode === "false"}
              onChange={changesStatus}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label
              htmlFor="maintenanceOff"
              className="text-gray-900 dark:text-gray-100"
            >
              Deshabilitado
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="maintenanceMode"
              id="maintenanceOn"
              value="true"
              checked={isMaintenanceMode === "true"}
              onChange={changesStatus}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label
              htmlFor="maintenanceOn"
              className="text-gray-900 dark:text-gray-100"
            >
              Habilitado
            </label>
          </div>
        </div>
        <div className="flex flex-wrap items-start pb-4 mb-8 border-b border-gray-400 border-opacity-20">
          <div className="w-full p-2 mb-5 sm:mb-0">
            <span
              className={`block mt-2 text-sm font-medium ${
                isDarkMode ? "text-white " : "text-gray-900"
              }`}
            >
              Mensaje
            </span>
          </div>
          <div className="w-full">
            <textarea
              className={`block h-40 py-4 px-3 w-full text-sm placeholder-gray-500 dark:placeholder-gray-50 font-medium outline-none bg-transparent border border-gray-400 hover:border-gray-500 focus:border-green-500 rounded-lg resize-none ${
                isDarkMode ? "text-white " : "text-gray-900"
              }`}
              id="formInput1-6"
              placeholder="Lorem ipsum dolor sit amet"
              value={mensajeSite}
              onChange={(e) => setMensajeSite(e.target.value)}
            />
          </div>
        </div>
      </fieldset>
    </form>
  );
};

export default Settings;
