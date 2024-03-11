import { useState, useEffect } from "react";
import { Chapter } from "../../assets/types";
import ChapterViewA from "./chapterViewA";

const ChaptersListA = ({ chapters }: { chapters: Chapter[] }) => {
  const [chaptersList, setChaptersList] = useState<Chapter[]>([]);

  useEffect(() => {
    const preChapters = chapters;
    const sorted = [...preChapters].sort((a, b) =>
      b.title.localeCompare(a.title)
    );
    setChaptersList(sorted);
  }, [chapters]);

  return (
    <div className="flex flex-col w-full gap-4 h-fit">
      {chaptersList &&
        chaptersList.map((chapter, index) => (
          <ChapterViewA key={index} chapter={chapter} />
        ))}
    </div>
  );
};

export default ChaptersListA;
