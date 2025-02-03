import { useEffect, useState } from "react";
import LatestRelease from "../latestRelease";
import ChaptersList from "../chaptersList";
import SocialsList from "../socialsList";
import { Chapter, ChapterRequest } from "../../assets/types";
import { getChapters } from "../../lib/Appwrite";

const Home = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [fontpageChapter, setFontpageChapter] = useState<Chapter>();

  useEffect(() => {
    const fetchChapters = async () => {
      const chapters: ChapterRequest = (await getChapters(
        true
      )) as ChapterRequest;
      setChapters(chapters.documents);

      const fontpageChapter = chapters.documents.filter((chapter) => {
        return chapter.Titles.Frontpage === true;
      })[0];
      setFontpageChapter(fontpageChapter);
    };
    fetchChapters();
  }, []);

  return (
    <div className="grid w-full gap-8 px-4 pt-8 pb-8 xl:px-12 lg:px-12 grow lg:grid-cols-8 md:grid-cols-1 sm:grid-cols-1">
      <div className="w-full lg:col-span-2 md:col-span-1 h-fit sm:col-span-1">
        {chapters.length > 0 && <LatestRelease {...chapters[0]} />}
      </div>
      <div className="w-full lg:col-span-4 md:col-span-1 h-fit sm:col-span-1">
        {chapters.length > 0 && <ChaptersList chapters={chapters.slice(1)} />}
      </div>
      <div className="w-full lg:col-span-2 md:col-span-1 h-fit sm:col-span-1">
        <SocialsList />
      </div>
    </div>
  );
};

export default Home;
