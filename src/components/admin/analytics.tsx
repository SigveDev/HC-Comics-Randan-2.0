import { useState, useEffect } from "react";
import { Art, Chapter, BarListData, Author } from "../../assets/types";
import { BarList } from "@tremor/react";
import { Eye, HeartHandshake, Forward, User } from "lucide-react";

const Analytics = ({
  author,
  arts,
  chapters,
}: {
  author: Author;
  arts: Art[];
  chapters: Chapter[];
}) => {
  const [artDataViews, setArtDataViews] = useState<BarListData[]>([]);
  const [chapterDataViews, setChapterDataViews] = useState<BarListData[]>([]);
  const [totalDataViews, setTotalDataViews] = useState<BarListData[]>([]);
  const [totalDataLikes, setTotalDataLikes] = useState<BarListData[]>([]);
  const [totalDataShares, setTotalDataShares] = useState<BarListData[]>([]);

  useEffect(() => {
    const preArts = [
      ...arts.map((art) => {
        return {
          name: art.title,
          value: art.ArtStats.Views,
          href: "/admin/stats/a/" + art.$id,
          color: "--primary",
        };
      }),
    ];
    const sorted = [...preArts].sort((a, b) => b.value - a.value);
    setArtDataViews(sorted.slice(0, 5));
  }, [arts]);

  useEffect(() => {
    const preChapters = [
      ...chapters.map((chapter) => {
        return {
          name: chapter.title,
          value: chapter.ChapterStats.Views,
          href: "/admin/stats/c/" + chapter.$id,
          color: "--primary",
        };
      }),
    ];
    const sorted = [...preChapters].sort((a, b) => b.value - a.value);
    setChapterDataViews(sorted.slice(0, 5));
  }, [chapters]);

  useEffect(() => {
    const preTotal = [
      ...arts.map((art) => {
        return {
          name: art.title,
          value: art.ArtStats.Views,
          href: "/admin/stats/a/" + art.$id,
          color: "--primary",
        };
      }),
      ...chapters.map((chapter) => {
        return {
          name: chapter.title,
          value: chapter.ChapterStats.Views,
          href: "/admin/stats/c/" + chapter.$id,
          color: "--primary",
        };
      }),
    ];
    const sorted = [...preTotal].sort((a, b) => b.value - a.value);
    setTotalDataViews(sorted.slice(0, 10));
  }, [arts, chapters]);

  useEffect(() => {
    const preTotal = [
      ...arts.map((art) => {
        return {
          name: art.title,
          value: art.ArtStats.Likes,
          href: "/admin/stats/a/" + art.$id,
          color: "--primary",
        };
      }),
      ...chapters.map((chapter) => {
        return {
          name: chapter.title,
          value: chapter.ChapterStats.Likes,
          href: "/admin/stats/c/" + chapter.$id,
          color: "--primary",
        };
      }),
    ];
    const sorted = [...preTotal].sort((a, b) => b.value - a.value);
    setTotalDataLikes(sorted.slice(0, 5));
  }, [arts, chapters]);

  useEffect(() => {
    const preTotal = [
      ...arts.map((art) => {
        return {
          name: art.title,
          value: art.ArtStats.Shares,
          href: "/admin/stats/a/" + art.$id,
          color: "--primary",
        };
      }),
      ...chapters.map((chapter) => {
        return {
          name: chapter.title,
          value: chapter.ChapterStats.Shares,
          href: "/admin/stats/c/" + chapter.$id,
          color: "--primary",
        };
      }),
    ];
    const sorted = [...preTotal].sort((a, b) => b.value - a.value);
    setTotalDataShares(sorted.slice(0, 5));
  }, [arts, chapters]);

  return (
    <div className="grid w-full grid-cols-6 gap-2 h-fit">
      <div className="w-full h-full col-span-6 p-4 border-[--primary] border-b-2 flex flex-row gap-4 justify-center items-center text-[--primary]">
        <User size={64} />
        <div className="flex flex-col w-fit h-fit">
          <p className="text-lg font-semibold text-[--primaryText]">
            {author?.name}:
          </p>
          <h3 className="text-3xl font-bold text-[--primaryText]">
            <span className="text-[--primary]">
              {author?.AuthorStats.Followers}
            </span>{" "}
            Followers
          </h3>
        </div>
      </div>
      <div className="w-full h-full border-[--secondary] border-b-2 flex flex-col justify-center items-center col-span-2 p-4 text-[--primary]">
        <Eye size={48} />
        <h3 className="text-2xl font-bold text-[--primaryText] mt-2">
          {totalDataViews.reduce((acc, curr) => acc + curr.value, 0)}
        </h3>
      </div>
      <div className="w-full h-full border-[--secondary] border-b-2 flex flex-col justify-center items-center col-span-2 p-4 text-[--primary]">
        <HeartHandshake size={48} />
        <h3 className="text-2xl font-bold text-[--primaryText] mt-2">
          {totalDataLikes.reduce((acc, curr) => acc + curr.value, 0)}
        </h3>
      </div>
      <div className="w-full h-full border-[--secondary] border-b-2 flex flex-col justify-center items-center col-span-2 p-4 text-[--primary]">
        <Forward size={48} />
        <h3 className="text-2xl font-bold text-[--primaryText] mt-2">
          {totalDataShares.reduce((acc, curr) => acc + curr.value, 0)}
        </h3>
      </div>

      <div className="w-full h-full col-span-6 p-4 border-[--secondary] border-b-2">
        <h2 className="text-xl font-bold text-[--primaryText] mb-2">
          Top posts by Views
        </h2>
        <BarList data={totalDataViews} />
      </div>
      <div className="w-full h-full col-span-3 p-4">
        <h2 className="text-xl font-bold text-[--primaryText] mb-2">
          Top arts by Views
        </h2>
        <BarList data={artDataViews} />
      </div>
      <div className="w-full h-full col-span-3 p-4">
        <h2 className="text-xl font-bold text-[--primaryText] mb-2">
          Top chapters by Views
        </h2>
        <BarList data={chapterDataViews} />
      </div>
    </div>
  );
};

export default Analytics;
