import axios from "axios";

const urlBackend = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_HOST}/api/2.0/`,
  headers: {
    authorization: `Bearer ${localStorage.getItem("tokenInServer")}`,
  },
});

export default urlBackend;
