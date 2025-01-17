import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
// import "../Css/CardsHome.css";
import { novelDataWithoutVolumenes } from "../Types/Types";
import { Link } from "react-router-dom";
import Loading from "../Components/Loading";
import usePageConfigStore from "@/Store/StateSiteHome";
import useNovels from "@/Store/UseNovels";
import NovelCard from "@/Components/UI/NovelCard";

const CardsHome = (): JSX.Element => {
  const { fetchSiteData } = usePageConfigStore();
  const { novels } = useNovels();
  const [search, setSearch] = useState<string>("");
  const [data, setData] = useState<novelDataWithoutVolumenes[]>([]);
  const [filterData, setFilterNovel] = useState<novelDataWithoutVolumenes[]>(
    []
  );

  const handelSubmit = (e: React.ChangeEvent<HTMLFormElement>): void => {
    e.preventDefault();
  };

  const fetchNovelsData = async () => {
    try {
      await fetchSiteData();
      setData(novels);
      return novels;
    } catch (error) {
      setData([]);
    }
  };

  const { isLoading } = useQuery({
    queryKey: ["novels"],
    queryFn: fetchNovelsData,
    refetchInterval: 60000,
    refetchOnWindowFocus: false,
    retry: 0,
  });

  useEffect(() => {
    const filterNovelsSearch = data.filter(
      (novels) =>
        novels.titleNovel.toLowerCase().includes(search.toLowerCase()) ||
        novels.id.toLowerCase().includes(search.toLowerCase())
    );
    setFilterNovel(filterNovelsSearch);
  }, [data, search]);

  if (isLoading) return <Loading />;
  return (
    <>
      <main className=" flex w-11/12 margin">
        <form className="w-full" onSubmit={handelSubmit}>
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative shadow-xl">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </form>
      </main>

      <div className="h-32 m-auto mt-2 flex justify-evenly text-center flex-col w-11/12">
        <span className="h-1 w-full flex justify-center items-center rounded-md color_line"></span>
        <h1 className="title text-2xl uppercase font-bold text-white">
          Novelas en Traduccion
        </h1>
        <span className="h-1 w-full flex justify-center items-center rounded-md color_line"></span>
      </div>
      <section className=" w-12/12 gap-2 flex flex-wrap margin justify-around p-2 text-white">
        {filterData.length > 0 ? (
          filterData.map(
            (novela) =>
              novela.statusNovel !== "inactivo" && (
                <figure
                  className="flex justify-center items-center flex-col w-[270px] min-h[400px] gap-2 m-1"
                  key={novela.novelId}
                >
                  <NovelCard
                    imageUrl={novela.portada}
                    title={novela.titleNovel}
                    description={novela.sinopsis.substring(0, 90) + "...."}
                    type={novela.tipoNovela}
                  />
                  {/* <span className="cards_tipo">
                    {novela.tipoNovela.toLocaleUpperCase()}
                  </span>
                  <div className="cards_img">
                    <div
                      className="cards_back"
                      style={{ backgroundImage: `url(${novela.portada})` }}
                    ></div>
                    <div
                      className="cards_back2"
                      style={{ backgroundImage: `url(${novela.portada})` }}
                    ></div>
                    <div className="overlay">
                      <h2 className="overlay_title">Sinopsis:</h2>
                      <p className="overlay_descripcion">
                        {novela.sinopsis.substring(0, 90) + "...."}
                      </p>
                    </div>
                  </div> */}
                  <Link
                    to={`/novel/${novela.id}?novela=${encodeURIComponent(
                      novela.titleNovel
                    )}`}
                    className="font-bold card_title text-white text-center text-[14px] no-underline"
                  >
                    <p className="text-white no-underline">
                      {novela.titleNovel}
                    </p>
                  </Link>
                </figure>
              )
          )
        ) : (
          <h1 className="flex font-bold text-3xl">No hay novelas</h1>
        )}
      </section>
    </>
  );
};

export default CardsHome;
