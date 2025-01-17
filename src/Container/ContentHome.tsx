import useUserStore from "../Store/useUserStore";
import { Link } from "react-router-dom";
import "../Css/ContentHome.css";
import useInteractionStore from "@/Store/InteracionState";
import useNovels from "@/Store/UseNovels";
import useChapters from "@/Store/UseChapters";
import useVolumens from "@/Store/UseVolumens";
import { formatTimestampToDate } from "@/Utils/utils";

const ContentHome = () => {
  const { isDarkMode } = useInteractionStore();
  const { totalUsers } = useUserStore();
  const { length } = useNovels();
  const { lastChapter } = useChapters();
  const { lastVolumen } = useVolumens();
  return (
    <>
      <section
        className={`content h-screen ${
          isDarkMode ? "dark" : ""
        } scrollbar overflow-y-auto`}
      >
        <main>
          <div className="head-title">
            <div className="left">
              <h1>Dashboard</h1>
              <ul className="breadcrumb">
                <li>
                  <a href="#">Dashboard</a>
                </li>
                <i className="fas fa-chevron-right"></i>
                <li>
                  <a href="#" className="actives">
                    Home
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="box-info">
            <li>
              visitas
              <i className="fa-solid fa-users"></i>
              <span className="text">
                <h3>{34}</h3>
                <p>visitas</p>
              </span>
            </li>
            <li>
              <i className="fas fa-people-group"></i>
              <span className="text">
                <h3>{totalUsers}</h3>
                <p>Usuarios</p>
              </span>
            </li>
            <li>
              <i className="fa-solid fa-book-atlas"></i>
              <span className="text">
                <h3>{length}</h3>
                <p>novelas</p>
              </span>
            </li>
          </div>

          <div className="table-data">
            <div className="order">
              <div className="head">
                <h3>Recent chapters</h3>
                <i className="fas fa-search"></i>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Upload Date</th>
                    <th>Volumen</th>
                  </tr>
                </thead>
                <tbody>
                  {lastChapter.length > 0
                    ? lastChapter.map((item) => (
                        <tr key={item.capituloId}>
                          <td>
                            <p>{item.nombreNovela}</p>
                          </td>
                          <td>{formatTimestampToDate(item?.createdAt)}</td>
                          <td>
                            <span className="status complete">
                              {item.volumenPertenece}{" "}
                            </span>
                          </td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
            </div>

            <div className="todo">
              <div className="head">
                <h3>Recent Volumenes</h3>
                <Link to="agregar-volumen">
                  <i className="fas fa-plus"></i>
                </Link>
              </div>

              <ul className="todo-list">
                {lastVolumen.length > 0
                  ? lastVolumen.map((item) => (
                      <li className="not-completed" key={item.volumenId}>
                        <p
                          className={`${
                            isDarkMode ? "text-white" : "text-black"
                          }`}
                        >
                          {item.nombreNovela} vol {item.volumen}
                        </p>
                        <i className="fas fa-ellipsis-vertical"></i>
                      </li>
                    ))
                  : ""}
              </ul>
            </div>
          </div>
        </main>
      </section>
    </>
  );
};

export default ContentHome;
