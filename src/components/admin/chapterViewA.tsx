import { useState, useEffect } from "react";
import { Chapter } from "../../assets/types";
import { getThumbnailPreview } from "../../lib/Appwrite";
import { calculateHowLongAgo } from "../../functions/CalculateHowLongAgo";
import { BarChart3, Pencil } from "lucide-react";
import { Link } from "react-router-dom";

const ChapterViewA = ({ chapter }: { chapter: Chapter }) => {
  const [thumbnail, setThumbnail] = useState<URL>();
  const [formatedNumber, setFormatedNumber] = useState<string>();
  const [howLongAgo, setHowLongAgo] = useState<string>();

  useEffect(() => {
    const fetchThumbnail = async () => {
      const thumbnail: URL = (await getThumbnailPreview(
        chapter.thumbnail
      )) as URL;
      setThumbnail(thumbnail);
    };
    fetchThumbnail();
  }, [chapter.thumbnail]);

  useEffect(() => {
    const formatedNumber = chapter.number.toString().padStart(3, "0");
    setFormatedNumber(formatedNumber);
  }, [chapter.number]);

  useEffect(() => {
    setHowLongAgo(calculateHowLongAgo(chapter.$createdAt));
  }, [chapter.$createdAt]);

  return (
    <div className="flex flex-row w-full gap-2 h-52 bg-[--secondary]">
      <Link
        to={"/c/" + chapter.$id}
        className="flex flex-row w-full h-full gap-2"
      >
        {thumbnail && (
          <img
            className="h-full aspect-[2/3]"
            src={thumbnail.href}
            alt={chapter.title}
          />
        )}
        <div className="flex flex-col w-full h-full grow">
          <h2 className="text-xl font-bold text-[--primaryText] mb-2">
            {chapter.title}
          </h2>
          <h3 className="mb-1 text-sm font-medium text-[--primaryText]">
            {chapter.Titles && chapter.Titles.name + " "}#{formatedNumber}
          </h3>
          <p className="mt-auto text-sm font-medium text-[--secondaryText] mb-2">
            Posted {howLongAgo}
          </p>
        </div>
      </Link>
      <div className="flex flex-col justify-between h-full gap-3 py-3 pr-3 w-fit">
        <Link
          className="flex flex-row gap-2 text-[--primaryText]"
          to={"/admin/edit/c/" + chapter.$id}
        >
          <Pencil />
        </Link>
        <Link
          className="flex flex-row gap-2 text-[--primaryText]"
          to={"/admin/stats/c/" + chapter.$id}
        >
          <BarChart3 />
        </Link>
      </div>
    </div>
  );
};

export default ChapterViewA;
