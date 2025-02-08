import { useState, useEffect } from "react";
import { getPagePreview } from "../lib/Appwrite";
import { Link } from "react-router-dom";

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
    <Link to={"/p/" + chapterId + "/" + (index + 1)} className="w-full h-fit">
      {page && (
        <img className="w-full aspect-[2/3]" src={page.href} alt={pageId} />
      )}
    </Link>
  );
};

export default MiniPageView;
