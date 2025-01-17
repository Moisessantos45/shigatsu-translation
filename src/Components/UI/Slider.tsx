import {
  Home,
  BookOpen,
  PlusSquare,
  Image,
  Settings,
  Users,
  BookPlus,
  Layers,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import useInteractionStore from "@/Store/InteracionState";
import useUserStore from "@/Store/useUserStore";
import { NavLink, redirect } from "react-router-dom";
import supabase from "@/Config/supabase";
import { userData } from "@/Types/Types";

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
  const {
    isDarkMode,
    isSidebarOpen,
    activeRoute,
    setIsSidebarOpen,
    setActiveRoute,
  } = useInteractionStore();
  const { dataUser, setDataUser } = useUserStore();

  const sidebarRoutes = [
    {
      name: "Home",
      icon: <Home />,
      route: `/dashboard/${dataUser.id}`,
      type: "colaborador",
    },
    {
      name: "Register",
      icon: <BookOpen />,
      route: "register-user",
      type: "administrador",
    },
    {
      name: "Add Novel",
      icon: <PlusSquare />,
      route: "add-novel",
      type: "colaborador",
    },
    {
      name: "Add Chapter",
      icon: <BookPlus />,
      route: "add-chapter",
      type: "colaborador",
    },
    {
      name: "Add Volume",
      icon: <Layers />,
      route: "add-volume",
      type: "colaborador",
    },
    {
      name: "See Novels",
      icon: <BookOpen />,
      route: "see-novels",
      type: "colaborador",
    },
    {
      name: "See Chapters",
      icon: <BookPlus />,
      route: "see-chapters",
      type: "colaborador",
    },
    {
      name: "See Volumes",
      icon: <Layers />,
      route: "see-volumes",
      type: "colaborador",
    },
    { name: "Gallery", icon: <Image />, route: "gallery", type: "colaborador" },
    {
      name: "Team Users",
      icon: <Users />,
      route: "team-users",
      type: "administrador",
    },
    {
      name: "Settings",
      icon: <Settings />,
      route: "settings",
      type: "administrador",
    },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
    <>
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 left-4 z-50 p-2 rounded-lg transition-colors ${
          isDarkMode
            ? "bg-gray-700 hover:bg-gray-600 text-white"
            : "bg-gray-200 hover:bg-gray-300 text-black"
        }`}
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </button>
      <aside
        className={`fixed top-0 h-screen left-0 z-40 overflow-hidden transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-0"
        } ${
          isDarkMode
            ? "bg-gray-800 border-r border-gray-700"
            : "bg-white border-r border-gray-200"
        }`}
      >
        {/* Sidebar */}
        <div className="mt-14">
          <span
            className={`p-2 text-center text-2xl font-bold mt-10 ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            Novel Dashboard
          </span>
          <nav className="mt-4 overflow-y-auto scrollbar flex flex-col h-auto sm:h-86">
            {sidebarRoutes
              .filter(
                (route) =>
                  dataUser.role === "administrador" ||
                  route.type === dataUser.role
              )
              .map((route) => (
                <NavLink
                  key={route.route}
                  to={route.route}
                  onClick={() => setActiveRoute(route.route)}
                  className={`w-full flex items-center p-3 transition-colors duration-200 ${
                    activeRoute === route.route
                      ? isDarkMode
                        ? "bg-gray-700 text-white"
                        : "bg-gray-200 text-black"
                      : isDarkMode
                      ? "hover:bg-gray-700 text-gray-300 hover:text-white"
                      : "hover:bg-gray-100 text-gray-700 hover:text-black"
                  }`}
                >
                  <span className="mr-3">{route.icon}</span>
                  <span>{route.name}</span>
                </NavLink>
              ))}
          </nav>
          <button
            onClick={handelClick}
            className={`mt-2 w-full flex items-center p-3 ${
              isDarkMode
                ? "hover:bg-gray-700 text-gray-300 hover:text-white"
                : "hover:bg-gray-100 text-gray-700 hover:text-black"
            }`}
          >
            <span className="mr-3">
              <LogOut />
            </span>
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Slider;
