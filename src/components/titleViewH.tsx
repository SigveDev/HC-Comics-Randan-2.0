import { useState, useEffect } from "react";
import { Title } from "../assets/types";
import { getTitleImage } from "../lib/Appwrite";

const TitleViewH = ({ title }: { title: Title }) => {
  const [thumbnail, setThumbnail] = useState<URL>();

  useEffect(() => {
    const fetchThumbnail = async () => {
      const thumbnail: URL = (await getTitleImage(title.thumbnail)) as URL;
      setThumbnail(thumbnail);
    };
    fetchThumbnail();
  }, [title.thumbnail]);

  return (
    <a href={"/t/" + title.$id} className="w-full h-fit">
      <h2 className="flex items-center justify-start h-7 pl-2 font-semibold text-[--primaryText] bg-gradient-to-r from-[--primary] via-[--thirdly] via-55% to-transparent mb-1">
        {title.name}
      </h2>
      {thumbnail && (
        <img
          className="w-full aspect-[2/3]"
          src={thumbnail.href}
          alt={title.name}
        />
      )}
      <p className="text-[--primaryText]">
        Chapters released: {title.Chapters.length}
      </p>
    </a>
  );
};

export default TitleViewH;
