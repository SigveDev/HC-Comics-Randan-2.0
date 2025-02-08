import { useState, useEffect } from "react";
import { Title, TitleRequest } from "../../assets/types";
import { getTitles } from "../../lib/Appwrite";
import TitleViewH from "../titleViewH";
import { SkeletonBox, SkeletonText } from "../skeleton";

const Titles = () => {
  const [titles, setTitles] = useState<Title[]>();

  useEffect(() => {
    const fetchTitles = async () => {
      const titles: TitleRequest = (await getTitles()) as TitleRequest;
      setTitles(titles.documents);
    };
    fetchTitles();
  }, []);

  return (
    <div className="grid w-full h-full grid-cols-1 gap-12 px-4 py-8 xl:px-12 lg:px-12 xl:grid-cols-5 lg:grid-cols-3">
      {titles ? (
        titles.map((title, index) => {
          return <TitleViewH key={index} title={title} />;
        })
      ) : (
        <>
          <div>
            <SkeletonText className="w-full mb-1 h-7" />
            <SkeletonBox className="w-full aspect-[2/3]" />
          </div>
          <div>
            <SkeletonText className="w-full mb-1 h-7" />
            <SkeletonBox className="w-full aspect-[2/3]" />
          </div>
          <div>
            <SkeletonText className="w-full mb-1 h-7" />
            <SkeletonBox className="w-full aspect-[2/3]" />
          </div>
        </>
      )}
    </div>
  );
};

export default Titles;
