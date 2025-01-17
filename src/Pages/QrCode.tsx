import useAdminContentStore from "@/Store/adminContentState";

const QrCode = (): JSX.Element => {
  const url: string = import.meta.env.VITE_URL_CODE_2FA;
  const { setMostrarModalQrCode } = useAdminContentStore();
  const handleClickMenu = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.preventDefault();
  };
  return (
    <figure className="flex justify-center items-center top-0 left-0 fixed z-30 h-screen w-full">
      <div className=" relative p-10">
        <button
          className=" w-7 h-7 absolute top-2 right-2 text-white"
          onClick={() => setMostrarModalQrCode(false)}
        >
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
        <img
          src={url}
          alt="Code 2F2"
          draggable="false"
          onContextMenu={handleClickMenu}
          className=" cursor-none"
        />
      </div>
    </figure>
  );
};

export default QrCode;
