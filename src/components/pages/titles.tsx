import { useState, useEffect } from "react";
import { Title, TitleRequest } from "../../assets/types";
import { getTitles } from "../../lib/Appwrite";
import TitleViewH from "../titleViewH";

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
    <div className="grid w-full h-full grid-cols-1 gap-12 px-4 py-8 xl:px-12 lg:px-12 xl:grid-cols-3 lg:grid-cols-3">
      {titles &&
        titles.map((title, index) => {
          return <TitleViewH key={index} title={title} />;
        })}
    </div>
  );
};

export default Titles;
