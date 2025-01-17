import { useEffect, useState } from "react";
import useUserStore from "@/Store/useUserStore";
import { toastify } from "@/Utils/utils";
import QrCode from "../QrCode";
import useAdminContentStore from "@/Store/adminContentState";
import UrlBackendPrivate from "@/Config/UrlBackendPrivate";
import ErrorHandler from "@/Services/ErrorHandler";
import uploadFileImg from "@/Services/clodinary";

const Profile = () => {
  const { dataUser, setDataUser } = useUserStore();
  const { mostrarModalQrCode, setMostrarModalQrCode } = useAdminContentStore();
  const [userEmail, setUserEmail] = useState<string>(dataUser.email || "");
  const [password, setPassword] = useState<string>("");
  const [userName, setUserName] = useState<string>(dataUser.full_name || "");
  const [userType, setUserType] = useState<string>(dataUser.role || "");
  const [profilePictures, setProfilePicture] = useState<string>(
    dataUser.avatar_url || ""
  );
  const [has_2fa, setHas_2fa] = useState<string>(
    String(dataUser.firstsession) || ""
  );
  const [mostrarQrCode, setMostrarQrCode] = useState<boolean>(false);
  const [profilePictureRender, setProfilePictureRender] = useState<string>("");
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null
  );
  const [id, setId] = useState<string | null>(dataUser.id || "");

  useEffect(() => {
    if (has_2fa === "true") {
      setMostrarModalQrCode(true);
      setMostrarQrCode(!mostrarQrCode);
    }
  }, [has_2fa]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    if (e.target.files !== null) {
      const file = e.target.files[0];
      const imgRender = URL.createObjectURL(file);
      setProfilePictureFile(file);
      setProfilePictureRender(imgRender);
    }
  };
  const handelSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    let profilePicture = profilePictures;
    setId(id);
    try {
      profilePicture = await uploadFileImg(profilePictureFile!);

      const response = await UrlBackendPrivate.put(
        `PanelAdmin/updateUser/${id}`,
        {
          userEmail,
          password,
          userName,
          profilePicture,
          has_2fa,
        }
      );
      const data = response.data ? response.data : dataUser;
      setDataUser(data);
      setProfilePictureFile(null);
      setProfilePicture(profilePicture);
      setProfilePictureRender("");
      setPassword("");
      toastify("Usuario actualizado correctamente", true);
    } catch (error) {
      ErrorHandler(error);
    }
  };
  return (
    <>
      <div className="w-11/12 m-auto flex justify-center">
        <div className="container mx-auto">
          <div className="inputs w-full max-w-2xl p-6 mx-auto">
            <h2 className="text-2xl text-slate-300">Account Setting</h2>
            <form
              className="mt-6 border-t border-gray-400 pt-4"
              onSubmit={handelSubmit}
            >
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-full px-3 mb-6">
                  <label
                    className="block uppercase tracking-wide text-slate-300 text-xs font-bold mb-2"
                    htmlFor="grid-text-e"
                  >
                    email address
                  </label>
                  <input
                    className="appearance-none block w-full bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500"
                    id="grid-text-e"
                    type="text"
                    placeholder="Enter email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-full px-3 mb-6">
                  <label
                    className="block uppercase tracking-wide text-slate-300 text-xs font-bold mb-2"
                    htmlFor="grid-text-p"
                  >
                    password
                  </label>
                  <input
                    className="appearance-none block w-full bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500"
                    id="grid-text-p"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-full px-3 mb-6">
                  <label
                    className="block uppercase tracking-wide text-slate-300 text-xs font-bold mb-2"
                    htmlFor="grid-text-v"
                  >
                    Verificacion de 2 pasos
                  </label>
                  <input
                    className="appearance-none block w-full bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500"
                    id="grid-text-v"
                    type="text"
                    placeholder="Activa o desactiva la verificacion de 2 pasos"
                    value={has_2fa}
                    onChange={(e) => setHas_2fa(e.target.value)}
                  />
                </div>
                <div className="personal w-full border-t border-gray-400 pt-4">
                  <h2 className="text-2xl text-slate-300">Personal info:</h2>
                  <div className="flex items-center justify-between mt-4">
                    <div className="w-full px-3 mb-6">
                      <label className="block uppercase tracking-wide text-slate-300 text-xs font-bold mb-2">
                        first name
                      </label>
                      <input
                        className="appearance-none block w-full bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500"
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-full px-3 mb-6">
                    <label className="block uppercase tracking-wide text-slate-300 text-xs font-bold mb-2">
                      user type
                    </label>
                    <input
                      className="appearance-none block w-full bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500"
                      type="text"
                      value={userType}
                      onChange={(e) => setUserType(e.target.value)}
                      disabled
                    />
                  </div>
                  <div className="w-full md:w-full px-3 mb-6">
                    {profilePictureRender && (
                      <img
                        src={profilePictureRender || profilePictures}
                        className="h-24 w-36 rounded-lg shadow-lg flex self-center m-auto"
                      />
                    )}
                    <p className="text-sm text-slate-300">
                      Selecciona su foto de perfil
                    </p>
                    <div className=" p-2 mt-1 flex justify-center items-center w-full shadow">
                      <label
                        htmlFor="file-input"
                        className="text-white h-8 w-full outline-dotted flex justify-center items-center rounded-lg"
                      >
                        Foto perfil
                      </label>
                      <input
                        type="file"
                        name="foto"
                        className="hidden"
                        id="file-input"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="appearance-none bg-gray-200 text-gray-900 px-2 py-1 shadow-sm border border-gray-400 rounded-md mr-3"
                      type="submit"
                    >
                      save changes
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* <QrCode /> */}
      {mostrarModalQrCode && !dataUser.firstsession && <QrCode />}
    </>
  );
};

export default Profile;
