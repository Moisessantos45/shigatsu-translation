import useInteractionStore from "@/Store/InteracionState";
import { FC } from "react";

interface HeaderFormProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  text: string;
  cancelFrom?: () => void;
}

const HeaderForm: FC<HeaderFormProps> = ({ text, title, cancelFrom }) => {
  const { isDarkMode } = useInteractionStore();
  return (
    <div
      className={`flex flex-wrap items-center justify-between mb-3 pb-3 border-b ${
        isDarkMode ? "border-gray-400" : "border-gray-800"
      } border-opacity-20`}
    >
      <div className="w-full sm:w-auto px-4 mb-2 sm:mb-0">
        <h4
          className={`text-2xl font-bold tracking-wide mb-1 ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          {title}
        </h4>
        <p
          className={`text-sm ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {text}
        </p>
      </div>
      <div className="w-full sm:w-auto px-4">
        <div>
          <button
            type="button"
            className={`inline-block py-2 px-4 mr-3 text-xs text-center font-semibold leading-normal rounded-lg transition duration-200 ${
              isDarkMode
                ? "text-gray-400 bg-gray-600 hover:bg-gray-700"
                : "text-gray-700 bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={cancelFrom}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`inline-block py-2 px-4 text-xs text-center font-semibold leading-normal rounded-lg transition duration-200 ${
              isDarkMode
                ? "text-blue-50 bg-blue-500 hover:bg-blue-600"
                : "text-white bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderForm;
