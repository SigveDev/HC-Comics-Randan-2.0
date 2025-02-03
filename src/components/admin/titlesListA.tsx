import { useState, useEffect } from "react";
import { Title } from "../../assets/types";
import TitleViewA from "./titleViewA";

const TitlesListA = ({ titles }: { titles: Title[] }) => {
  const [titlesList, setTitlesList] = useState<Title[]>([]);

  useEffect(() => {
    const preChapters = titles;
    const sorted = [...preChapters].sort((a, b) =>
      b.name.localeCompare(a.name)
    );
    setTitlesList(sorted);
  }, [titles]);

  return (
    <div className="grid grid-cols-3 gap-4">
      {titlesList &&
        titlesList.map((title, index) => (
          <TitleViewA key={index} title={title} />
        ))}
    </div>
  );
};

export default TitlesListA;
