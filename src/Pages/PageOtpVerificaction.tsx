import useUserStore from "../Store/useUserStore";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import UrlBackendPrivate from "../Config/UrlBackendPrivate";
import { toastify } from "@/Utils/utils";

const PageOtpVerificaction = () => {
  const { idUser } = useParams<{ idUser: string }>();
  const { dataUser, setLoadingSite } = useUserStore();
  const [code2fa, setOtp] = useState<string>("");
  const [contEnvios, setContEnvios] = useState<number>(0);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (verifyUser()) {
  //     navigate(`/dashboard/${dataUser.id}`);
  //   }
  // }, [dataUser, navigate]);

  const handelSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      await UrlBackendPrivate.post(`verification/${idUser}`, {
        code2fa,
      });

      toastify("Usuario Verificado", true);
      setLoadingSite(true);
      navigate(`/dashboard/${dataUser.id}`);
    } catch (error) {
      if (error instanceof Error) {
        toastify(error.message, false);
        return;
      } else if (axios.isAxiosError(error)) {
        const response = error.response;
        if (contEnvios > 2) {
          toastify("Demasiados intentos", false);
          navigate("/login");
          return;
        }
        if (response?.status === 401) {
          toastify(error.response?.data.msg, false);
          setContEnvios(contEnvios + 1);
          return;
        }
        toastify(error.response?.data.msg, false);
        return;
      }
    }
  };
  return (
    <div className="relative flex sm:h-auto h-screen flex-col sm:justify-center overflow-hidden bg-gray-50 sm:p-2 pt-6">
      <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-11/12 sm:w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl">
              <p>User Verification</p>
            </div>
            <div className="flex flex-row text-xl font-medium text-gray-400">
              <p>{dataUser.full_name}</p>
            </div>
          </div>
          <div>
            <form onSubmit={handelSubmit}>
              <div className="flex flex-col space-y-16">
                <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                  <input
                    className="w-full sm:h-16 h-14 flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-2 ring-blue-700"
                    type="text"
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-5">
                  <button
                    className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm"
                    type="submit"
                  >
                    Verify Account
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageOtpVerificaction;
