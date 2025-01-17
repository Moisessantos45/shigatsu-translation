import useUserStore from "@/Store/useUserStore";

const Notifications = (): JSX.Element => {
  const { dataNotification, activeListClass, setActiveListClass } =
    useUserStore();
  return (
    <div
      className={`${
        activeListClass ? "flex" : "hidden"
      } flex-col overflow-y-auto scrollbar absolute top-20 h-72 w-64 rounded-md right-3 bg-[#1b1c29] z-20 items-center justify-start shadow-lg`}
    >
      <i
        className="absolute right-2 top-1 cursor-pointer fa-solid fa-xmark text-slate-300 text-2xl"
        onClick={() => setActiveListClass(!activeListClass)}
      ></i>
      <ul className="m-auto w-full flex justify-center items-center p-2 gap-3 flex-col">
        {dataNotification.map((item, i) => (
          <li
            key={i}
            className="w-full flex flex-col gap-2 text-sm shadow-inner shadow-gray-800 rounded-md p-2 bg-[#27293d] text-slate-300 font-medium"
          >
            <span className="flex gap-3 items-center">
              <i className="fa-solid fa-check text-slate-200"></i>
              {item.message}
            </span>
            <span className="flex gap-3 items-center">
              <i className="fa-solid fa-user text-slate-200"></i>
              Usuario: {item.nameUser}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
