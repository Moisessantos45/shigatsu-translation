import usePageConfigStore from "@/Store/StateSiteHome";

const BannerHome = (): JSX.Element => {
  const { dataSite, bg_banner } = usePageConfigStore();

  return (
    <section
      className="w-full h-screen flex items-center justify-center bannerHome"
      style={{
        backgroundImage: `url(${bg_banner})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
    >
      <div className="w-11/12 sm:w-7/12 max-w-4xl p-6 text-center text-white">
        <h1 className="text-4xl sm:text-6xl font-bold mb-4">
          {dataSite.titleSite}
        </h1>
        <p className="text-lg sm:text-2xl font-medium mb-6">
          {dataSite.mensajeSite}
        </p>
        <a
          href={dataSite.linkFacebook}
          className="inline-block px-6 py-3 bg-pink-600 rounded-md text-white font-semibold hover:bg-pink-700 transition duration-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          Seguir
        </a>
      </div>
    </section>
  );
};

export default BannerHome;
