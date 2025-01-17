import { FC, useEffect, useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { novelData } from "@/Types/Types";

interface TypeOption {
  options: novelData[];
  placeholder: string;
  onChange: (option: { titulo: string; id: string }) => void;
  initValue: { titleNovel: string; id: string } | null;
}

const CustomSelect: FC<TypeOption> = ({
  options,
  placeholder,
  onChange,
  initValue = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<{
    id: string;
    titleNovel: string;
  } | null>(null);
  //   console.log(options);
  useEffect(() => {
    if (initValue) {
      setSelectedOption(initValue);
    } else {
      setSelectedOption(null);
    }
  }, [initValue]);

  const handleSelect = (option: novelData) => {
    const { titleNovel, id } = option;
    setSelectedOption({ titleNovel, id });
    onChange({ titulo: titleNovel, id });
    setIsOpen(false);
  };

  return (
    <div className="relative w-full mb-4">
      <button
        type="button"
        className={`relative w-full py-3 pl-3 pr-10 text-left bg-white dark:bg-gray-800 rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-opacity-75 ${
          selectedOption
            ? "text-slate-700 dark:text-slate-200"
            : "text-slate-400"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="block truncate">
          {selectedOption ? selectedOption.titleNovel : placeholder}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDownIcon
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </span>
      </button>
      {isOpen && (
        <ul className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white dark:bg-gray-800 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm scrollbar">
          {options.map((option) => (
            <li
              key={option.id}
              className={`cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-green-100 dark:hover:bg-green-700 ${
                selectedOption &&
                selectedOption.titleNovel === option.titleNovel
                  ? "bg-green-200 dark:bg-green-600"
                  : ""
              }`}
              onClick={() => handleSelect(option)}
            >
              <span
                className={`block truncate text-gray-400 ${
                  selectedOption &&
                  selectedOption.titleNovel === option.titleNovel
                    ? "font-medium"
                    : "font-normal"
                }`}
              >
                {option.titleNovel}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
