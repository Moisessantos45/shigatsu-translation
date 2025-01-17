import React from "react";

interface BotonAProps {
  link: string;
  text: string;
}

const BotonA: React.FC<BotonAProps> = ({ link, text }): JSX.Element => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-10/12 mx-auto mb-2 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-300"
    >
      {text}
    </a>
  );
};

export default BotonA;
