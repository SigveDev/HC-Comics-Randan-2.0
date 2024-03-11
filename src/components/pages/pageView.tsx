import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import {
  getChapterByID,
  getPage,
  updateCurrent,
  giveChapterView,
  addChapterToHistory,
  getHistory,
} from "../../lib/Appwrite";
import { useSwipeable } from "react-swipeable";
import { History } from "../../assets/types";

const PageView = () => {
  const chapterID = window.location.pathname.split("/")[2];
  const page = window.location.pathname.split("/")[3];
  const [pageURL, setPageURL] = useState<URL>();
  const [maxPage, setMaxPage] = useState<number>();

  useEffect(() => {
    const fetchURL = async () => {
      const chapter: any = (await getChapterByID(chapterID)) as any;
      const pageID: string = chapter.pages[Number(page) - 1];
      const pageURL: URL = (await getPage(pageID)) as URL;
      setPageURL(pageURL);
      setMaxPage(chapter.pages.length);
      await updateCurrent(chapterID);
    };
    fetchURL();
  }, [chapterID]);

  useEffect(() => {
    const addPageToLocalStorage = () => {
      const currentPage = localStorage.getItem("currentChapter");
      if (currentPage === null) {
        const chapterStorage = [chapterID, page];
        localStorage.setItem("currentChapter", JSON.stringify(chapterStorage));
      } else {
        const chapterStorage = JSON.parse(currentPage);
        if (chapterStorage[0] !== chapterID) {
          const chapterStorage = [chapterID, page];
          localStorage.setItem(
            "currentChapter",
            JSON.stringify(chapterStorage)
          );
        } else {
          if (!chapterStorage.includes(page)) {
            chapterStorage.push(page);
            localStorage.setItem(
              "currentChapter",
              JSON.stringify(chapterStorage)
            );
          }
        }
      }
    };
    const addRetentionToLocalStorage = async () => {
      const retention = localStorage.getItem("retention");
      if (retention === null) {
        localStorage.setItem("retention", chapterID + "-" + page);
      } else {
        if (Number(retention.split("-")[1]) < Number(page)) {
          localStorage.setItem("retention", chapterID + "-" + page);
        }
      }
    };
    addPageToLocalStorage();
    addRetentionToLocalStorage();
  }, [chapterID, page]);

  useEffect(() => {
    const checkAmountOfPages = async () => {
      const currentPage = localStorage.getItem("currentChapter");
      if (currentPage !== null) {
        const chapterStorage = JSON.parse(currentPage);
        const history = (await getHistory()) as History;
        let chapterState = undefined;
        if (history?.ChapterIds) {
          chapterState = history?.ChapterIds.includes(chapterID) ? true : false;
        } else {
          chapterState = undefined;
        }
        if (
          maxPage &&
          chapterStorage.length - 1 >= maxPage * 0.55 &&
          chapterState === false
        ) {
          await giveChapterView(chapterID);
          localStorage.removeItem("currentChapter");
          await addChapterToHistory(chapterID);
        } else if (
          maxPage &&
          chapterStorage.length - 1 >= maxPage * 0.75 &&
          chapterState === true
        ) {
          await giveChapterView(chapterID);
          localStorage.removeItem("currentChapter");
        } else if (
          maxPage &&
          chapterStorage.length - 1 >= maxPage * 0.55 &&
          chapterState === undefined
        ) {
          await giveChapterView(chapterID);
          localStorage.removeItem("currentChapter");
        }
      }
    };
    checkAmountOfPages();
  }, [chapterID, maxPage, page]);

  const handleNextPage = () => {
    window.location.href = `/p/${chapterID}/${Number(page) + 1}`;
  };

  const handlePreviousPage = () => {
    window.location.href = `/p/${chapterID}/${Number(page) - 1}`;
  };

  const handleSwipable = useSwipeable({
    onSwipedLeft: () => {
      if (Number(page) !== maxPage) {
        handleNextPage();
      } else {
        window.location.href = `/c/${chapterID}`;
      }
    },
    onSwipedRight: () => {
      if (Number(page) !== 1) {
        handlePreviousPage();
      } else {
        window.location.href = `/c/${chapterID}`;
      }
    },
    onSwipedDown: () => {
      window.location.href = `/c/${chapterID}`;
    },
  });

  return (
    <div className="relative flex items-center justify-center w-full h-fullpage">
      {pageURL && (
        <img
          {...handleSwipable}
          className="aspect-[2/3] xl:h-full lg:h-full md:h-full sm:h-fit xl:w-fit lg:w-fit md:w-fit sm:w-full z-10 max-h-fullpage"
          src={pageURL.href}
          alt={pageURL.href}
        />
      )}
      {Number(page) !== 1 && (
        <button
          className="xl:flex lg:flex hidden justify-start items-center absolute top-0 left-0 w-1/2 h-full text-[--primaryText] hover:text-[--accentText]"
          onClick={handlePreviousPage}
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}
      {Number(page) !== maxPage && (
        <button
          className="xl:flex lg:flex hidden justify-end items-center absolute top-0 right-0 w-1/2 h-full text-[--primaryText] hover:text-[--accentText]"
          onClick={handleNextPage}
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}
    </div>
  );
};

export default PageView;
