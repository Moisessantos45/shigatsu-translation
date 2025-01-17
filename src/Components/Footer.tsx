const Footer = (): JSX.Element => {
  const year = new Date().getFullYear();

  return (
    <footer className=" w-full mt-5 bg-gray-900 px-4 pt-5">
      <p className="py-5 text-center text-gray-300">
        © {year} Copyright | Shigatsu Translation
      </p>
    </footer>
  );
};

export default Footer;
