import useChapters from "@/Store/UseChapters";
import { ChapterCard } from "../UI/ChapterCard";
import { useEffect, useRef } from "react";
import { formatTimestampToDate } from "@/Utils/utils";
import useNovels from "@/Store/UseNovels";
import { lastChapter } from "@/Types/Types";

// interface Chapter {
//   id: number;
//   imageUrl: string;
//   date: string;
//   chapterName: string;
// }

// const chapters: Chapter[] = [
//   {
//     id: 1,
//     imageUrl: "/placeholder.svg?height=300&width=400",
//     date: "2023-05-15",
//     chapterName: "The Beginning of the End",
//   },
//   {
//     id: 2,
//     imageUrl: "/placeholder.svg?height=300&width=400",
//     date: "2023-05-18",
//     chapterName: "A New Hope",
//   },
//   {
//     id: 3,
//     imageUrl: "/placeholder.svg?height=300&width=400",
//     date: "2023-05-21",
//     chapterName: "The Dark Forest",
//   },
//   {
//     id: 4,
//     imageUrl: "/placeholder.svg?height=300&width=400",
//     date: "2023-05-24",
//     chapterName: "Redemption",
//   },
// ];

export function LatestChapters() {
  const { lastChapter } = useChapters();
  const { novels } = useNovels();
  const chapters = useRef<lastChapter[]>([]);

  const getDocs = async () => {
    const newLastChapter = lastChapter.map((item) => {
      const novel = novels.find((novel) => novel.id === item.novelId);
      return {
        ...item,
        imageUrl: novel?.portada ?? "",
      };
    });
    chapters.current = newLastChapter;
  };

  useEffect(() => {
    getDocs();
  }, []);
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          Latest Chapters
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {chapters.current.map((chapter) => (
            <ChapterCard
              key={chapter.id}
              imageUrl={chapter.imageUrl}
              date={formatTimestampToDate(chapter.createdAt)}
              chapterName={chapter.nombreCapitulo}
              novelId={chapter.novelId}
              volumenPertenece={chapter.volumenPertenece}
              capitulo={chapter.capitulo}
              nombreNovela={chapter.nombreNovela}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
