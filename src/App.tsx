import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import LayoutHome from "./Layouts/LayoutHome";
import CardsHome from "./Home/CardsHome";
import Mantenimiento from "./Pages/Mantenimiento";

const PageNovel = lazy(() => import("./Pages/PageNovel"));
const PageChapter = lazy(() => import("./Pages/PageChapter"));
const LayoutLogin = lazy(() => import("./Layouts/LayoutLogin"));
const Login = lazy(() => import("./Pages/Login"));
const PageOtpVerificaction = lazy(() => import("./Pages/PageOtpVerificaction"));
const LayoutAdmin = lazy(() => import("./Layouts/LayoutAdmin"));
const RegisterUser = lazy(() => import("./Pages/Admin/Forms/RegisterUser"));
const Paga404 = lazy(() => import("./Pages/Paga404"));
const ContentHome = lazy(() => import("./Container/ContentHome"));
const Profile = lazy(() => import("./Pages/Admin/Profile"));
const PageVolumenes = lazy(() => import("./Pages/Admin/Forms/PageVolumenes"));
const PageNovelsAdmin = lazy(
  () => import("./Pages/Admin/Forms/PageNovelsAdmin")
);
const PageChapterAdmin = lazy(
  () => import("./Pages/Admin/Forms/PageChapterAdmin")
);
const PageVerNovelas = lazy(() => import("./Pages/Admin/PageVerNovelas"));
const PageVerVolumenes = lazy(() => import("./Pages/Admin/PageVerVolumenes"));
const PageVerChapters = lazy(() => import("./Pages/Admin/PageVerChapters"));
const AllUsers = lazy(() => import("./Pages/Admin/AllUsers"));
const Settings = lazy(() => import("./Pages/Admin/Settings"));
const GaleryIlustraciones = lazy(
  () => import("./Components/GaleryIlustraciones")
);

const App = createBrowserRouter([
  {
    path: "/",
    element: <LayoutHome />,
    children: [
      {
        index: true,
        element: <CardsHome />,
      },
      {
        path: "novel/:novelId",
        element: <PageNovel />,
      },
      {
        path: "leer/:novelId/:vol/:capitulo",
        element: <PageChapter />,
      },
    ],
  },
  {
    path: "/login",
    element: <LayoutLogin />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "verification/:idUser",
        element: <PageOtpVerificaction />,
      },
    ],
  },
  {
    path: "/dashboard/:idUser",
    element: <LayoutAdmin />,
    children: [
      {
        index: true,
        element: <ContentHome />,
      },
      {
        path: "register-user",
        element: <RegisterUser />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "add-volume",
        element: <PageVolumenes />,
      },
      {
        path: "add-novel",
        element: <PageNovelsAdmin />,
      },
      {
        path: "add-chapter",
        element: <PageChapterAdmin />,
      },
      {
        path: "see-novels",
        element: <PageVerNovelas />,
      },
      {
        path: "see-volumes",
        element: <PageVerVolumenes />,
      },
      {
        path: "see-chapters",
        element: <PageVerChapters />,
      },
      {
        path: "team-users",
        element: <AllUsers />,
      },
      {
        path: "gallery",
        element: <GaleryIlustraciones />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "*",
    element: <Paga404 />,
  },
  {
    path: "/maintenance",
    element: <Mantenimiento />,
  },
]);

export default App;
