import { useState, useEffect } from "react";
import { getPagePreview } from "../lib/Appwrite";

const MiniPageView = ({ pageId, index }: { pageId: string; index: number }) => {
  const chapterId = window.location.pathname.split("/")[2];
  const [page, setPage] = useState<URL>();

  useEffect(() => {
    const fetchPage = async () => {
      const page: URL = (await getPagePreview(pageId)) as URL;
      setPage(page);
    };
    fetchPage();
  }, []);

  return (
    <a href={"/p/" + chapterId + "/" + (index + 1)} className="w-full h-fit">
      {page && (
        <img className="w-full aspect-[2/3]" src={page.href} alt={pageId} />
      )}
    </a>
  );
};

export default MiniPageView;
