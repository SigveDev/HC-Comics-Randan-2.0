import { useState, useEffect } from "react";
import { Art } from "../../assets/types";
import ArtViewA from "./artViewA";

const ArtListA = ({ arts }: { arts: Art[] }) => {
  const [artList, setArtList] = useState<Art[]>([]);

  useEffect(() => {
    const preArts = arts;
    const sorted = [...preArts].sort((a, b) => b.title.localeCompare(a.title));
    setArtList(sorted);
  }, [arts]);

  return (
    <div className="grid w-full grid-cols-3 gap-4 h-fit">
      {artList &&
        artList.map((art, index) => <ArtViewA key={index} art={art} />)}
    </div>
  );
};

export default ArtListA;
