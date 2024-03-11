import { useState, useEffect } from "react";
import { getAuthorPFP } from "../lib/Appwrite";
import { Author } from "@/assets/types";

const AuthorViewH = ({ author }: { author: Author }) => {
  const [pfp, setPfp] = useState<string>();

  useEffect(() => {
    const fetchPfp = async () => {
      const pfp: string = (await getAuthorPFP(author.$id)) as string;
      setPfp(pfp);
    };
    fetchPfp();
  }, []);

  return (
    <a
      href={"/u/" + author.$id}
      className="w-full aspect-[5/1] flex flex-row p-2 bg-[--secondary] gap-4"
    >
      <img className="h-full rounded-full aspect-square" src={pfp} />
      <div className="flex flex-col justify-center w-3/4 h-full">
        <h1 className="text-4xl font-bold text-[--primaryText]">
          {author.name}
        </h1>
      </div>
    </a>
  );
};

export default AuthorViewH;
