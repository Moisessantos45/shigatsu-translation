import { useEffect, useState } from "react";
import { toastify } from "@/Utils/utils";
import useAdminContentStore from "@/Store/adminContentState";
import ErrorHandler from "@/Services/ErrorHandler";
import uploadFileImg from "@/Services/clodinary";
import supabase from "@/Config/supabase";
import useInteractionStore from "@/Store/InteracionState";

const RegisterUser = () => {
  const { isDarkMode } = useInteractionStore();
  const { provideDataUser } = useAdminContentStore();
  const [userEmail, setUserEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null
  );
  const [profilePictureRender, setProfilePictureRender] = useState<string>("");
  // const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    if (provideDataUser.id) {
      setUserEmail(provideDataUser.email);
      setUserName(provideDataUser.full_name);
      setProfilePictureRender(provideDataUser.avatar_url);
      setProfilePicture(provideDataUser.avatar_url);
      // setId(provideDataUser.idUser);
    }
  }, []);

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
    try {
      const foto_perfil = await uploadFileImg(profilePictureFile!);
      const { error } = await supabase.auth.signUp({
        email: userEmail,
        password: password,
        options: {
          data: {
            full_name: userName,
            avatar_url: foto_perfil,
          },
        },
      });

      if (error) {
        throw error;
      }
      setPassword("");
      setUserEmail("");
      setUserName("");
      setProfilePicture("");
      setProfilePictureRender("");
      setProfilePictureFile(null);
      toastify("User registered", true);
    } catch (error) {
      ErrorHandler(error);
    }
  };

  return (
    <div className={`w-full md:w-1/2 mx-auto my-4 h-screen`}>
      <h1
        className={`text-lg font-bold ${
          isDarkMode ? "text-white" : "text-black"
        }`}
      >
        Register
      </h1>
      <form className="flex flex-col mt-4" onSubmit={handelSubmit}>
        <input
          type="text"
          name="full-name"
          className={`px-4 py-3 w-full rounded-md ${
            isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-black"
          } border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm`}
          placeholder="Full Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="email"
          name="email"
          className={`px-4 py-3 mt-4 w-full rounded-md ${
            isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-black"
          } border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm`}
          placeholder="Email address"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          className={`px-4 py-3 mt-4 w-full rounded-md ${
            isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-black"
          } border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm`}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="w-11/12 m-auto flex p-2 justify-center items-center">
          <label
            htmlFor="file-input"
            className={`text-white h-10 w-44 ${
              isDarkMode ? "bg-blue-600" : "bg-blue-500"
            } flex justify-center items-center rounded-lg`}
          >
            Add Image
          </label>
          <input
            type="file"
            name="foto"
            accept="image/*"
            id="file-input"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        {profilePictureRender && (
          <figure className="m-auto flex justify-center items-center p-2 w-11/12">
            <img
              src={profilePictureRender || profilePicture}
              className="w-44 min-h-24 outline-slate-50 outline-dotted rounded-md"
              alt=""
            />
          </figure>
        )}
        <button
          type="submit"
          className={`mt-4 px-4 py-3 leading-6 text-base rounded-md border border-transparent text-white focus:outline-none ${
            isDarkMode ? "bg-blue-600" : "bg-blue-500"
          } hover:text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer inline-flex items-center w-full justify-center font-medium`}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterUser;
