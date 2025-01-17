import { v4 as uuidv4 } from "uuid";

interface SymbolProps {
  children: React.ReactNode;
  className?: string;
}

const SymbolContainer: React.FC<SymbolProps> = ({ children, className }) => (
  <span key={uuidv4()} className={className}>
    {children}
  </span>
);

const PreBlock: React.FC<SymbolProps> = ({ children }) => (
  <pre className="whitespace-pre-line text-white">{children}</pre>
);

const unirSimbolos = (texto: string) => {
  const noteClass = "bg-gray-800 text-yellow-200 font-bold p-2 rounded-lg";

  const symbols = new Set([
    "◊◊◊",
    "◊◊",
    "◊",
    "$$$",
    "$$",
    "$",
    "**",
    "*",
    "§§§",
    "◆ ◆ ◆",
    "☆",
    "☆☆",
    "☆☆☆",
    "++++++++",
    "++++++",
    "+++++++++",
    "+++++++",
    "+++++++++++++++++++++++++",
    "+++++",
  ]);

  const NOTAS_TRADUCTOR = "-----";
  const result: JSX.Element[] = [];
  let preBlock = "";
  let insideNote = false;
  let noteContent = "";

  const addPreBlock = () => {
    if (preBlock) {
      result.push(<PreBlock key={uuidv4()}>{preBlock}</PreBlock>);
      preBlock = "";
    }
  };

  texto.split("\n").forEach((line) => {
    const trimmedLine = line.trim();

    if (trimmedLine === NOTAS_TRADUCTOR) {
      addPreBlock();

      if (insideNote) {
        // Cerrar la nota
        result.push(
          <SymbolContainer
            key={uuidv4()}
            className={`m-auto mt-1 flex w-full ${noteClass}`}
          >
            {noteContent}
          </SymbolContainer>
        );
        noteContent = "";
        insideNote = false;
      } else {
        // Abrir la nota
        insideNote = true;
      }
    } else if (insideNote) {
      // Acumular contenido de la nota
      noteContent += line + "\n";
    } else if (symbols.has(trimmedLine)) {
      addPreBlock();
      result.push(
        <SymbolContainer
          key={uuidv4()}
          className="m-auto flex justify-center w-24"
        >
          {line}
        </SymbolContainer>
      );
    } else {
      preBlock += line + "\n";
    }
  });

  addPreBlock();
  return result;
};

const FormaterContent = (texto: string): JSX.Element[] => {
  if (texto.length < 0) return [];

  const CLOUDINARY_URL = "https://res.cloudinary.com";
  // const IMGBB_URL = "https://i.ibb.co";
  const hasCloudinaryUrl = new RegExp(CLOUDINARY_URL, "i").test(texto);

  if (!hasCloudinaryUrl) return unirSimbolos(texto);

  return texto.split(`\n${CLOUDINARY_URL}`).flatMap((fragmento, i) => {
    if (i === 0) return unirSimbolos(fragmento);

    const indiceEspacio = fragmento.indexOf("\n");
    const url = `${CLOUDINARY_URL}${
      indiceEspacio !== -1 ? fragmento.slice(0, indiceEspacio) : fragmento
    }`;
    const resto = indiceEspacio !== -1 ? fragmento.slice(indiceEspacio) : "";

    return [
      <figure className="image-display" key={`img-${uuidv4()}`}>
        <img src={url.trim()} alt="" />
      </figure>,
      ...unirSimbolos(resto),
    ];
  });
};

export default FormaterContent;
