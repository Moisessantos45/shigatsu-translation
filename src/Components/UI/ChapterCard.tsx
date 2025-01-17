import { Link } from "react-router-dom";

interface ChapterCardProps {
  imageUrl: string;
  date: string;
  chapterName: string;
  novelId: string;
  volumenPertenece: number;
  capitulo: number;
  nombreNovela: string;
}

export function ChapterCard({
  imageUrl,
  date,
  chapterName,
  nombreNovela,
  novelId,
  volumenPertenece,
  capitulo,
}: ChapterCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <img
          src={imageUrl}
          alt={chapterName}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-2">{date}</p>
        <Link
          to={`/leer/${novelId}/${volumenPertenece}/${capitulo}?capitulo=${encodeURIComponent(
            chapterName
          )}&novela=${encodeURIComponent(nombreNovela)}`}
        >
          <h3 className="text-lg font-semibold text-gray-800">{chapterName}</h3>
        </Link>
      </div>
    </div>
  );
}
