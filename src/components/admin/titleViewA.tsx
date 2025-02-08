import { useState, useEffect } from "react";
import { Title } from "../../assets/types";
import { getTitleImage } from "../../lib/Appwrite";
import { BarChart3, Pencil } from "lucide-react";
import { Link } from "react-router-dom";

const TitleViewA = ({ title }: { title: Title }) => {
  const [thumbnail, setThumbnail] = useState<URL>();

  useEffect(() => {
    const fetchThumbnail = async () => {
      const thumbnail: URL = (await getTitleImage(title.thumbnail)) as URL;
      setThumbnail(thumbnail);
    };
    fetchThumbnail();
  }, [title.thumbnail]);

  return (
    <Link to={"/t/" + title.$id} className="relative w-full h-fit">
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
      <div className="absolute bottom-0 right-0 flex flex-row justify-between w-full px-4 pt-8 pb-4 h-fit bg-gradient-to-b to-[#00000090] from-60% from-transparent">
        <Link
          className="flex flex-row gap-2 text-[--primaryText]"
          to={"/admin/edit/t/" + title.$id}
        >
          <Pencil />
        </Link>
        <Link
          className="flex flex-row gap-2 text-[--primaryText]"
          to={"/admin/stats/t/" + title.$id}
        >
          <BarChart3 />
        </Link>
      </div>
    </Link>
  );
};

export default TitleViewA;
