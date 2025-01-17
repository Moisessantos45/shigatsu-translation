import { redirect } from "react-router-dom";
import useUserStore from "../Store/useUserStore";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import logo from "../Img/logo.png";
import supabase from "@/Config/supabase";
import { userData } from "@/Types/Types";

interface OpcionesMenu {
  texto: string;
  icon: string;
  url: string;
  tipeRuta: string;
  indice: number;
}

const user: userData = {
  id: "",
  email: "",
  full_name: "",
  role: "",
  avatar_url: "",
  firstsession: "false",
  status: "active",
  acceso: "false",
  activo: "false",
};

const Slider = () => {
  const { dataUser, setDataUser, modalVisible } = useUserStore();
  const [activeListClass, setActiveListClass] = useState<number>(0);
  const opcionesMenu: OpcionesMenu[] = [
    {
      texto: "Home",
      icon: "fas fa-border-all",
      url: `/dashboard/${dataUser.id}`,
      tipeRuta: "colaborador",
      indice: 0,
    },
    {
      texto: "Registrar",
      icon: "fa-solid fa-user-plus",
      url: "register-user",
      tipeRuta: "administrador",
      indice: 0,
    },
    {
      texto: "Agregar Novela",
      icon: "fa-solid fa-cloud-arrow-up",
      url: "agregar-novela",
      tipeRuta: "colaborador",
      indice: 0,
    },
    {
      texto: "Agregar Volumen",
      icon: "fa-solid fa-cloud-arrow-up",
      url: "agregar-volumen",
      tipeRuta: "colaborador",
      indice: 0,
    },
    {
      texto: "Agregar Capitulo",
      icon: "fa-solid fa-cloud-arrow-up",
      url: "agregar-capitulo",
      tipeRuta: "colaborador",
      indice: 0,
    },
    {
      texto: "Ver Novelas",
      icon: "fa-solid fa-book",
      url: "ver-novelas",
      tipeRuta: "colaborador",
      indice: 0,
    },
    {
      texto: "Ver Volumenes",
      icon: "fa-solid fa-book",
      url: "ver-volumenes",
      tipeRuta: "colaborador",
      indice: 0,
    },
    {
      texto: "Ver Capitulos",
      icon: "fa-solid fa-book",
      url: "ver-capitulos",
      tipeRuta: "colaborador",
      indice: 0,
    },
    {
      texto: "Team",
      icon: "fa-solid fa-users-gear",
      url: "team",
      tipeRuta: "administrador",
      indice: 0,
    },
    {
      texto: "Galery",
      icon: "fa-solid fa-images",
      url: "galery",
      tipeRuta: "colaborador",
      indice: 0,
    },
    {
      texto: "Settings",
      icon: "fa-solid fa-gear",
      url: "settings",
      tipeRuta: "administrador",
      indice: 0,
    },
  ];

  const newOpcionesMenu = opcionesMenu.map((item, i): OpcionesMenu => {
    const newItem = { ...item };
    newItem.indice = i;
    return newItem;
  });

  const handelClick = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("tokenInServer");
      setDataUser(user);
      redirect("/login");
    } catch (error) {
      setDataUser(user);
      redirect("/login");
      return;
    }
  };

  return (
    <aside
      className={`fixed z-20 left-0 top-0 sliderNav scrollbar sm:justify-normal justify-evenly h-screen flex items-center ${
        modalVisible
          ? "sm:w-[130px] -translate-x-0"
          : "-translate-x-[230px] sm:-translate-x-0 sm:w-[60px]"
      } flex-col duration-300 ease-linear`}
    >
      <img
        src={logo}
        className={`m-1 ${
          modalVisible ? "sm:w-28" : "sm:h-8"
        } w-36 duration-300 ease-linear`}
        alt="Logo"
      />
      <ul className="mt-8 sm:mt-5 flex h-[60vh] sm:h-[65vh] sm:justify-normal justify-evenly w-full overflow-y-auto scrollbar items-center m-auto text-white flex-col gap-3">
        {newOpcionesMenu.map(
          (item, i) =>
            (item.tipeRuta === "colaborador" ||
              dataUser.role === "administrador") && (
              <li
                key={i}
                className={`${
                  modalVisible ? "ml-1" : "ml-3"
                } w-full flex justify-center items-center duration-300 ease-in-out`}
              >
                <NavLink
                  to={item.url}
                  className={`flex items-center rounded-md ${
                    modalVisible
                      ? "w-full sm:h-16"
                      : "w-[calc(48px - (4px * 2))] sm:h-10"
                  } duration-300 ease-in-out overflow-x-hidden scrollbar ${
                    activeListClass === item.indice
                      ? "sliderVisible text-blue-500 font-bold"
                      : "font-semibold"
                  }`}
                  onClick={() => setActiveListClass(i)}
                >
                  <i className={`${item.icon} ml-1 text-xl`}></i>
                  <span
                    className={`${
                      modalVisible ? "ml-2 sm:w-full" : "ml-8 sm:w-14"
                    } textWidthFitContent flex duration-300 ease-linear sm:text-sm text-lg`}
                  >
                    {item.texto}
                  </span>
                </NavLink>
              </li>
            )
        )}
      </ul>
      <a
        href="https://api-img-bb-convert-links-frontend.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center rounded-md ${
          modalVisible ? "w-full sm:h-16" : "w-12 sm:h-10"
        } duration-300 ease-in-out overflow-x-auto scrollbar m-auto text-white`}
      >
        <i className="fa-solid text-white fa-file-image ml-3 text-xl"></i>
        <span
          className={`${
            modalVisible ? "ml-2" : "ml-8"
          } textWidthFitContent flex duration-300 ease-linear sm:text-sm text-lg`}
        >
          Subir Imagen
        </span>
      </a>
      <button
        onClick={handelClick}
        className={`bg-red-600 rounded-md ${
          modalVisible ? "sm:w-20 sm:mb-2" : "sm:w-14 sm:mb-4"
        } h-7 w-10/12 m-1 flex text-white justify-center items-center duration-300 ease-linear`}
      >
        Logout
      </button>
    </aside>
  );
};

export default Slider;
