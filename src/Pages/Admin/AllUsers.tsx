import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import supabase from "@/Config/supabase";
import { userData } from "@/Types/Types";
import Loading from "@/Components/Loading";
import useUserStore from "@/Store/useUserStore";
import useAdminContentStore from "@/Store/adminContentState";
import ModalConfirm from "@/Components/ModalConfirm";
import { fromToJsonMapUser } from "@/Services/userService";

const roleOptions = [
  { value: "administrador", label: "Administrador" },
  { value: "usuario", label: "Usuario" },
  { value: "invitado", label: "Invitado" },
];

const AllUsers = (): JSX.Element => {
  const { changeUserState, deleteUser } = useUserStore();
  const {
    deleteContent,
    setDeleteContent,
    modalConfirmDelete,
    setModalConfirmDelete,
    setProvideDataUser,
  } = useAdminContentStore();
  const { dataUser, modalVisible } = useUserStore();
  const [allGetUsers, setAllGetUsers] = useState<userData[]>([]);

  const statusAsignadoRef = useRef<boolean>(deleteContent);
  useEffect(() => {
    statusAsignadoRef.current = deleteContent;
  }, [deleteContent]);

  const getAllUser = async () => {
    try {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) {
        throw error;
      }
      const mapToJson = data.map(fromToJsonMapUser);

      setAllGetUsers(mapToJson);
    } catch (error) {
      setAllGetUsers([]);
    }
  };

  const { isLoading } = useQuery({
    queryKey: ["allUser"],
    queryFn: getAllUser,
    refetchInterval: 60000,
    refetchOnWindowFocus: false,
    retry: 0,
  });

  const handleClickStatus = (id: string) => {
    console.log("click", id);
    // setTimeout(() => {
    //   if (statusAsignadoRef.current) {
    //     setDeleteContent(false);
    //     setModalConfirmDelete(false);
    //     changeUserState(id);
    //     const newAllUsers = allGetUsers.filter((item) =>
    //       item.id === id ? { ...item, userStatus: !item.status } : item
    //     );
    //     setAllGetUsers(newAllUsers);
    //   }
    // }, 10000);
  };

  const handelClickDelete = (id: string) => {
    setTimeout(() => {
      if (statusAsignadoRef.current) {
        setDeleteContent(false);
        setModalConfirmDelete(false);
        deleteUser(id);
        const newAllUsers = allGetUsers.filter((item) => item.id !== id);
        setAllGetUsers(newAllUsers);
      }
    }, 10000);
  };

  const obtenerDatosUser = (data: userData) => {
    setProvideDataUser(data);
  };
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  if (isLoading) return <Loading />;
  return (
    <>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-8 h-screen">
        <div className="flex items-center justify-between pb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">User Accounts</h2>
            <span className="text-sm text-gray-400">
              Registered collaborators
            </span>
          </div>
          <div>
            <Link
              to={`/dashboard/${dataUser.id}/register-user`}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Register
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-800 shadow-md">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-700 text-left text-xs font-semibold uppercase tracking-widest text-white">
                <th className="px-5 py-3">Full Name</th>
                <th className="px-5 py-3">User Role</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Options</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {allGetUsers.length > 0 &&
                allGetUsers.map((item) => (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-700 transition-colors duration-300 ${
                      hoveredRow === item.id ? "bg-gray-700" : ""
                    }`}
                    onMouseEnter={() => setHoveredRow(item.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="px-5 py-5 text-sm">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-full w-full rounded-full object-cover"
                            src={item.avatar_url}
                            alt={item.full_name}
                          />
                        </div>
                        <div className="ml-3">
                          <p className="whitespace-no-wrap font-medium">
                            {item.full_name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 text-sm">
                      {dataUser.role === "administrador" ? (
                        <select
                          className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white transition-colors duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          defaultValue={item.role}
                          onChange={(e) => {
                            console.log(e.target.value);
                          }}
                        >
                          {roleOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="whitespace-no-wrap">{item.role}</p>
                      )}
                    </td>
                    <td className="px-5 py-5 text-sm">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status
                            ? "bg-green-200 text-green-900"
                            : "bg-red-200 text-red-900"
                        }`}
                      >
                        {item.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-5 text-sm">
                      <div className="flex justify-start space-x-2">
                        <Link
                          className="rounded-md bg-blue-600 px-3 py-1 text-white transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          to={`/dashboard/${dataUser.id}/register-user`}
                          onClick={() => obtenerDatosUser(item)}
                        >
                          Edit
                        </Link>
                        <button
                          className="rounded-md bg-red-600 px-3 py-1 text-white transition-colors duration-300 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          onClick={() => {
                            if (dataUser.role === "administrador") {
                              setModalConfirmDelete(true);
                              handelClickDelete(String(item.id));
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col items-center border-t border-gray-700 px-5 py-5 sm:flex-row sm:justify-between">
          <span className="text-sm text-gray-400 sm:text-sm">
            Showing 1 to 5 of 12 Entries
          </span>
          <div className="mt-2 inline-flex sm:mt-0">
            <button className="mr-2 h-10 w-10 rounded-full border border-gray-600 bg-gray-800 text-sm font-semibold text-white transition duration-150 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Prev
            </button>
            <button className="h-10 w-10 rounded-full border border-gray-600 bg-gray-800 text-sm font-semibold text-white transition duration-150 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Next
            </button>
          </div>
        </div>
      </div>
      {modalConfirmDelete && <ModalConfirm />}
    </>
  );
};
export default AllUsers;
