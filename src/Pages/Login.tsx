import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/Store/useUserStore";
import { toastify } from "@/Utils/utils";
import ErrorHandler from "@/Services/ErrorHandler";
import supabase from "@/Config/supabase";
import { userData } from "@/Types/Types";

const Login = () => {
  const { dataUser, setDataUser, setLoadingSite, verifyUser } = useUserStore();
  const [userEmail, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const sessionVerify = async () => {
    const session = await verifyUser();
    if (session) {
      navigate(`/dashboard/${dataUser.id}`);
    }
  };

  useEffect(() => {
    sessionVerify();
  }, []);

  const handelSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if ([password, userEmail].includes("")) {
      toastify("Campos vacios", false);
      return;
    }
    if (!userEmail.endsWith("@gmail.com")) {
      toastify("Correo invalido", false);
      toastify("Direccion valida @gmail.com", false);
      return;
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: password,
      });

      if (error) {
        throw new Error(error.message);
      }

      localStorage.setItem("tokenInServer", data.session.access_token);

      const user: userData = {
        id: data.user.id,
        email: data.user.email ?? "",
        ...data.user.user_metadata,
      } as userData;

      setDataUser(user);
      setLoadingSite(true);
      navigate(`/dashboard/${data.user.id}`);
    } catch (error) {
      ErrorHandler(error);
    }
  };
  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-[#060714]">
        <form
          className="flex flex-col justify-center gap-6 w-11/12 sm:w-full sm:max-w-md p-8 bg-[#2b3440] rounded-3xl shadow-lg"
          onSubmit={handelSubmit}
        >
          <h3 className="mb-6 text-3xl text-center text-white font-bold">
        Sign In
          </h3>
          <label
        htmlFor="email"
        className="text-sm text-start text-gray-300 font-semibold"
          >
        Email*
          </label>
          <input
        id="email"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        placeholder="mail@loopple.com"
        className="w-full px-4 py-3 text-sm font-medium placeholder-gray-500 text-gray-200 bg-[#3a4451] rounded-xl border border-gray-600 outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <label
        htmlFor="password"
        className="text-sm text-start text-gray-300 font-semibold"
          >
        Password*
          </label>
          <input
        id="password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        className="w-full px-4 py-3 text-sm font-medium placeholder-gray-500 text-gray-200 bg-[#3a4451] rounded-xl border border-gray-600 outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
        className="w-full px-6 py-3 mt-4 text-lg font-bold leading-none text-white transition duration-300 rounded-xl bg-indigo-600 hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500"
        type="submit"
          >
        Sign In
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
