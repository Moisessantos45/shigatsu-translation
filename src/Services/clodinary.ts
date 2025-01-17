import axios from "axios";

const api_Key = import.meta.env.VITE_PRESET_CLOUDINARY;

const uploadFileImg = async (file: File) => {
  if (!file.type.startsWith("image/")) {
    return "";
  }
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", api_Key || "");
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/dtkskpitc/image/upload`,
      formData
    );
    return data.secure_url;
  } catch (error) {
    return "";
  }
};

export default uploadFileImg;
