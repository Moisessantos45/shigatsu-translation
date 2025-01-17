import useInteractionStore from "@/Store/InteracionState";
import { FC } from "react";

interface InputFormProps extends React.InputHTMLAttributes<HTMLInputElement> {
  classNames?: string;
}

const InputForm: FC<InputFormProps> = ({ classNames, ...props }) => {
  const { isDarkMode } = useInteractionStore();
  return (
    <input
      {...props}
      className={`py-4 px-3 w-full text-sm ${
        isDarkMode
          ? "text-gray-50 placeholder-gray-50 border-gray-400 hover:border-white"
          : "text-gray-900 placeholder-gray-500 border-gray-300 hover:border-black"
      } font-medium outline-none bg-transparent border focus:border-green-500 rounded-lg ${
        classNames || ""
      }`}
    />
  );
};

export default InputForm;
