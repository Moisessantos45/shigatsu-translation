import axios, { AxiosInstance } from "axios";

const UrlBackendPrivate: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_HOST_USER}/api/user/1.0/Users/`,
  headers:{
    authorization: `Bearer ${localStorage.getItem("tokenInServer")}`
  }
});

export default UrlBackendPrivate;
