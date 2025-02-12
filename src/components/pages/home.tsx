import { useEffect, useState } from "react";
import LatestRelease from "../latestRelease";
import ChaptersList from "../chaptersList";
import SocialsList from "../socialsList";
import { Chapter, ChapterRequest } from "../../assets/types";
import { getChapters } from "../../lib/Appwrite";
import { SkeletonBox, SkeletonText } from "../skeleton";

const Home = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [fontpageChapter, setFontpageChapter] = useState<Chapter>();

  useEffect(() => {
    const fetchChapters = async () => {
      const chapters: ChapterRequest = (await getChapters(
        true
      )) as ChapterRequest;

      const fontpageChapter = chapters.documents.filter((chapter) => {
        return chapter.Titles.Frontpage === true;
      })[0];
      setFontpageChapter(fontpageChapter);

      const leftOverChapters = chapters.documents.filter((chapter) => {
        return chapter.$id !== fontpageChapter.$id;
      });

      setChapters(leftOverChapters);
    };
    fetchChapters();
  }, []);

  return (
    <div className="grid w-full gap-8 px-4 pt-8 pb-8 xl:px-12 lg:px-12 grow lg:grid-cols-8 md:grid-cols-1 sm:grid-cols-1">
      <div className="w-full lg:col-span-2 md:col-span-1 h-fit sm:col-span-1">
        {fontpageChapter ? (
          <LatestRelease {...fontpageChapter} />
        ) : (
          <div className="w-full aspect-[4/7] flex flex-col gap-2">
            <SkeletonText className="w-full h-7" />
            <SkeletonBox className="w-full h-full" />
          </div>
        )}
      </div>
      <div className="w-full lg:col-span-4 md:col-span-1 h-fit sm:col-span-1">
        {chapters.length > 0 ? (
          <ChaptersList chapters={chapters} />
        ) : (
          <div className="flex flex-col w-full gap-2 h-fit">
            <SkeletonText className="w-full h-7" />
            <SkeletonBox className="w-full h-52" />
            <SkeletonBox className="w-full h-52" />
            <SkeletonBox className="w-full h-52" />
          </div>
        )}
      </div>
      <div className="w-full lg:col-span-2 md:col-span-1 h-fit sm:col-span-1">
        <SocialsList />
      </div>
    </div>
  );
};

export default Home;
