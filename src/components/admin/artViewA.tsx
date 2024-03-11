import { useState, useEffect } from "react";
import { getArtImage } from "../../lib/Appwrite";
import { Art } from "../../assets/types";
import { Pencil, BarChart3 } from "lucide-react";

const ArtViewA = ({ art }: { art: Art }) => {
  const [artImage, setArtImage] = useState<URL>();

  useEffect(() => {
    const getArtImagePreviewFunc = async () => {
      const artImage: URL = (await getArtImage(art.image)) as URL;
      setArtImage(artImage);
    };
    getArtImagePreviewFunc();
  }, []);

  return (
    <a className="relative w-full h-fit" href={"/a/" + art.$id}>
      <img src={artImage?.href} alt="Art" className="w-full aspect-[2/3]" />
      <div className="absolute top-0 right-0 flex flex-row justify-between w-full px-4 pt-4 pb-8 h-fit bg-gradient-to-b from-[#00000090] from-60% to-transparent">
        <a
          className="flex flex-row gap-2 text-[--primaryText]"
          href={"/admin/edit/a/" + art.$id}
        >
          <Pencil />
        </a>
        <a
          className="flex flex-row gap-2 text-[--primaryText]"
          href={"/admin/stats/a/" + art.$id}
        >
          <BarChart3 />
        </a>
      </div>
    </a>
  );
};

export default ArtViewA;
