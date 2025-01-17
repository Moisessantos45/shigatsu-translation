import useUserStore from "../Store/useUserStore";
import "../Css/Slider.css";
import { Link } from "react-router-dom";
import Notifications from "../Components/Notifications";
import useInteractionStore from "@/Store/InteracionState";

const HeaderAdmin = () => {
  const { isDarkMode, isSidebarOpen, setIsDarkMode } = useInteractionStore();
  const {
    dataUser,
    setActiveListClass,
    activeListClass,
    numberNotification,
    setNumberNotification,
  } = useUserStore();

  const handelSubmitSearch = (e: React.ChangeEvent<HTMLFormElement>): void => {
    e.preventDefault();
  };

  const handelClickNotification = () => {
    setNumberNotification(0);
  };
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // const [activeListClass, setActiveListClass] = useState<boolean>(false);
  return (
    <>
      <header
        className={`relative top-0 w-full z-10 p-2 ${
          isSidebarOpen
            ? "sm:w-[calc(100%-256px)] sm:left-[256px]"
            : "sm:w-[calc(100%-0px)] sm:left-[0px]"
        } transition-all duration-300 ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        }
    `}
      >
        <form
          onSubmit={handelSubmitSearch}
          className=" h-14 p-2 flex w-8/12 sm:w-7/12 justify-center items-center sm:m-auto ml-8"
        >
          <input
            type="search"
            name=""
            className=" block p-2 h-full w-full pl-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search..."
            id=""
          />
        </form>
        <figure className=" flex sm:gap-2 gap-1 sm:right-2 right-1 top-2 absolute justify-evenly items-center">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-black"
            }`}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
          <button
            onClick={() => {
              setActiveListClass(!activeListClass), handelClickNotification();
            }}
            className=" h-14 w-14 flex justify-center items-center"
          >
            <i className=" fa-regular fa-bell text-4xl"></i>
            {numberNotification > 0 && (
              <span className="bg-red-700 rounded-full h-7 w-7 text-xl font-bold absolute top-0 right-18">
                {numberNotification}
              </span>
            )}
          </button>
          <Link to="profile">
            <img
              src={dataUser.avatar_url}
              alt="imagen de usuario"
              className="rounded-full h-14 w-14"
            />
          </Link>
        </figure>
      </header>
      <Notifications />
    </>
  );
};

export default HeaderAdmin;
