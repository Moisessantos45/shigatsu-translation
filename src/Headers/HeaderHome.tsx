import { useEffect } from "react";
import icon_logo from "../Img/logo.png";
import { Link, NavLink } from "react-router-dom";
import "../Css/HeaderHome.css";
import usePageConfigStore from "../Store/StateSiteHome";
import { useQuery } from "@tanstack/react-query";

const HeaderHome = (): JSX.Element => {
  const {
    titleHeader,
    titleTextHeader,
    bg_header,
    heigthHeader,
    hiddenHeader,
    setHiddenHeaderMenu,
    fetchSiteData,
  } = usePageConfigStore();

  const handleScroll = () => {
    const position = window.scrollY;
    if (position > 255) {
      setHiddenHeaderMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useQuery({
    queryKey: ["siteDataHome"],
    queryFn: fetchSiteData,
    refetchInterval: 3000000,
    staleTime: 3000000,
    retry: 0,
  });

  return (
    <>
      <div
        className="relative flex flex-col bg-[#060714] overflow-x-hidden"
        style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}
      >
        <div className="flex items-center bg-[#060714] p-4 pb-2 justify-between">
          <h2 className="text-[#ffffff] text-lg md:text-xl lg:text-2xl font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
            <Link to="/">
              <img
                src={icon_logo}
                alt="Shigatsu Translation"
                className="h-14 md:h-14 lg:h-16 absolute top-3 left-2 md:left-3 lg:top-4 lg:left-4"
              />
            </Link>
          </h2>
          <div className="flex w-12 items-center justify-end">
            <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 bg-transparent text-[#ffffff] gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="container mx-auto p-4">
          <div
            className={`flex ${
              heigthHeader ? "max-h-[380px]" : "sm:min-h-[480px] h-[380px]"
            } flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-center justify-center p-4`}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("${bg_header}")`,
              backgroundPosition: "center center",
              backgroundSize: "cover",
            }}
          >
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-black leading-tight tracking-[-0.033em]">
                {titleHeader}
              </h1>
              <h2 className="text-white text-sm md:text-base lg:text-lg font-normal leading-normal">
                {titleTextHeader}
              </h2>
            </div>
            <button className="min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl px-4 md:px-5 bg-[#1980e6] text-slate-50 text-sm md:text-base font-bold leading-normal tracking-[0.015em] h-2"></button>
          </div>
        </div>
        {!hiddenHeader && (
          <div className="pb-3 md:w-11/12 w-full m-auto">
            <div className="flex border-b border-[#d0dbe7] px-4 gap-8 overflow-x-auto">
              <NavLink
                className="flex flex-col items-center justify-center border-b-[3px] border-b-[#1980e6] text-[#ffffff] pb-[13px] pt-4"
                to="novel/wEXFKZoJZRpChvV9E5gA"
              >
                <p className="text-[#ffffff] text-xs md:text-base font-bold leading-normal tracking-[0.015em]">
                  Kamatte Shinsotsu-chan
                </p>
              </NavLink>
              <NavLink
                className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#b0bec8] pb-[13px] pt-4"
                to="novel/YVnG4p1Bdy5sbjCOCRwy"
              >
                <p className="text-[#b0bec8] text-sm md:text-base font-bold leading-normal tracking-[0.015em]">
                  Yuujin-chara
                </p>
              </NavLink>
              <NavLink
                className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#b0bec8] pb-[13px] pt-4"
                to="novel/iwAda49vXUdhaNzz2DXF"
              >
                <p className="text-[#b0bec8] text-sm md:text-base font-bold leading-normal tracking-[0.015em]">
                  it Seems
                </p>
              </NavLink>
              <a
                className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#b0bec8] pb-[13px] pt-4"
                href="https://www.facebook.com/people/Shigatsu-Translation/100083095400806/"
                target="_blank"
                rel="noreferrer"
              >
                <p className="text-[#b0bec8] text-sm md:text-base font-bold leading-normal tracking-[0.015em]">
                  Facebook
                </p>
              </a>
            </div>
          </div>
        )}
        <div className="h-5 bg-[#060714]" />
      </div>
    </>
  );
};

export default HeaderHome;
