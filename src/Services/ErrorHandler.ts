import { toastify } from "@/Utils/utils";
import axios from "axios";

const ErrorHandler = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response && error.response.data && error.response.data.msg) {
      const msg = error.response.data.msg;
      toastify(msg, false);
      return;
    } else if (error.message) {
      toastify(error.message, false);
      return;
    }
    toastify("Error desconocido", false);
  }
};

export default ErrorHandler;
