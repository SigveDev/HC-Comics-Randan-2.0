import {
  ColorPalette,
  TitleRequest,
  ColorPaletteRequest,
  Title,
} from "../../assets/types";
import useAutosizeTextArea from "../../functions/useAutosizeTextArea";
import {
  getMyTitles,
  getColorPalattes,
  getMyThumbnails,
  getMyPages,
  createChapter,
} from "../../lib/Appwrite";
import { Plus } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const ChapterForm = () => {
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [pages, setPages] = useState<string[]>([]);
  const [existingTitles, setExistingTitles] = useState<Title[]>([]);
  const [colorPalettes, setColorPalettes] = useState<ColorPalette[]>([]);

  const [title, setTitle] = useState<string>("");
  const [chosenThumbnail, setChosenThumbnail] = useState<string>();
  const [chosenPages, setChosenPages] = useState<string[]>([]);
  const [chosenTitle, setChosenTitle] = useState<string>();
  const [titleIndex, setChapterIndex] = useState<number>();
  const [description, setDescription] = useState<string>("");
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [chosenColorPalette, setChosenColorPalette] = useState<string>();
  const [subtitle, setSubtitle] = useState<string>("");

  const [chooseThumbnail, setChooseThumbnail] = useState<boolean>(false);
  const [choosePages, setChoosePages] = useState<boolean>(false);

  useEffect(() => {
    const fetchTitles = async () => {
      const titles: TitleRequest = (await getMyTitles()) as TitleRequest;
      setExistingTitles(titles.documents as Title[]);
    };
    fetchTitles();
  }, []);

  useEffect(() => {
    const fetchColorPalettes = async () => {
      const colorPalettes: ColorPaletteRequest =
        (await getColorPalattes()) as ColorPaletteRequest;
      setColorPalettes(colorPalettes.documents as ColorPalette[]);
    };
    fetchColorPalettes();
  }, []);

  useEffect(() => {
    const fetchThumbnails = async () => {
      const tempThumbnails = await getMyThumbnails();
      setThumbnails(tempThumbnails as string[]);
    };
    fetchThumbnails();
  }, []);

  useEffect(() => {
    const fetchPages = async () => {
      const tempPages = await getMyPages();
      setPages(tempPages as string[]);
    };
    fetchPages();
  }, []);

  useEffect(() => {
    if (chosenTitle !== "default") {
      const title = existingTitles.find((title) => title.$id === chosenTitle);
      const existingChapters = title?.Chapters.length;
      if (existingChapters) {
        setChapterIndex(existingChapters + 1);
      } else {
        if (title) {
          setChapterIndex(1);
        } else {
          setChapterIndex(undefined);
        }
      }
    } else {
      setChapterIndex(1);
    }
  }, [chosenTitle]);

  useAutosizeTextArea(descriptionRef.current, description);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({
      title,
      chosenThumbnail,
      chosenPages,
      chosenTitle,
      titleIndex,
      description,
      chosenColorPalette,
      subtitle,
    });
    if (
      title &&
      chosenThumbnail &&
      chosenPages.length > 0 &&
      chosenTitle &&
      titleIndex &&
      description &&
      chosenColorPalette &&
      subtitle
    ) {
      await createChapter(
        title,
        chosenThumbnail,
        chosenPages,
        chosenTitle,
        titleIndex,
        description,
        chosenColorPalette,
        subtitle
      );
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col w-full h-fit">
      <form
        className="flex flex-col items-center justify-center w-4/5 gap-4 mx-auto mt-8 h-fit"
        onSubmit={handleSubmit}
      >
        <div className="w-full h-fit">
          <label
            className="text-sm font-semibold text-[--primaryText]"
            htmlFor="Title"
          >
            Chapter title:
          </label>
          <input
            name="title"
            className="w-full h-10 p-2 text-[--primaryText] bg-[--background] border-[--primary] border-2 focus-visible:outline-none rounded-none"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-col w-fit h-fit">
            <label
              className="text-sm font-semibold text-[--primaryText]"
              htmlFor="thumbnail"
            >
              Thumbnail:
            </label>
            {chosenThumbnail === undefined ? (
              <button
                name="thumbnail"
                className="border-[--primary] border-2 bg-[--background] h-64 aspect-[2/3] text-[--secondaryText] text-lg"
                onClick={() => setChooseThumbnail(true)}
                type="button"
              >
                Thumbnail
              </button>
            ) : (
              <button
                className="h-64 aspect-[2/3]"
                onClick={() => {
                  setChooseThumbnail(true);
                }}
                type="button"
              >
                <img
                  src={thumbnails.find((thumbnail) =>
                    String(thumbnail).includes(chosenThumbnail)
                  )}
                  alt="thumbnail"
                  className="w-64 h-64"
                />
              </button>
            )}
          </div>
          <div className="flex flex-col items-end w-48 h-fit">
            <label
              className="text-sm font-semibold text-[--primaryText] flex justify-start flex-col w-full"
              htmlFor="pages"
            >
              Add pages:
            </label>
            {chosenPages.length <= 0 ? (
              <button
                name="pages"
                className="relative border-[--primary] border-2 bg-[--background] h-64 aspect-[2/3] w-fit text-[--secondaryText] flex flx-col justify-center items-center"
                onClick={() => setChoosePages(true)}
                type="button"
              >
                <div className="absolute h-full w-6 top-0 left-[-1.5rem] flex flex-col justify-center">
                  <div className="h-[95%] w-6 border-y-2 border-l-2 border-[--primary]"></div>
                </div>
                <Plus size={32} />
              </button>
            ) : (
              <button
                name="pages"
                className="h-64 aspect-[2/3] w-fit relative flex justify-center items-center"
                onClick={() => setChoosePages(true)}
                type="button"
              >
                {chosenPages.length > 1 ? (
                  <div className="w-6 h-full flex justify-center flex-col top-0 left-[-1.5rem] absolute my-auto bg-black">
                    <img
                      src={pages.find((page) =>
                        String(page).includes(chosenPages[1])
                      )}
                      alt="page 2"
                      className="object-cover w-6 h-[95%] opacity-40"
                    />
                  </div>
                ) : (
                  <div className="absolute h-full w-6 top-0 left-[-1.5rem] flex flex-col justify-center">
                    <div className="h-[95%] w-6 border-y-2 border-l-2 border-[--primary]"></div>
                  </div>
                )}
                <img
                  src={pages.find((thumbnail) =>
                    String(thumbnail).includes(chosenPages[0])
                  )}
                  alt="thumbnail"
                  className="w-full h-full"
                />
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-row w-full gap-2 h-fit">
          <div className="grow h-fit">
            <label
              className="text-sm font-semibold text-[--primaryText]"
              htmlFor="Title"
            >
              Title:
            </label>
            <select
              name="Title"
              className="w-full h-10 p-2 text-[--primaryText] bg-[--background] border-[--primary] border-2 focus-visible:outline-none rounded-none"
              value={chosenTitle}
              onChange={(e) => setChosenTitle(e.target.value)}
            >
              <option value="default">Select a title</option>
              {existingTitles.map((title, index) => (
                <option key={index} value={title.$id}>
                  {title.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/4 h-fit">
            <label
              className="text-sm font-semibold text-[--primaryText]"
              htmlFor="chapterIndex"
            >
              Chapter Index:
            </label>
            <input
              name="chapterIndex"
              className="w-full h-10 p-2 text-[--primaryText] bg-[--background] border-[--primary] border-2 focus-visible:outline-none rounded-none"
              type="number"
              placeholder="001"
              value={titleIndex}
              onChange={(e) => setChapterIndex(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="w-full h-fit">
          <label
            className="text-sm font-semibold text-[--primaryText]"
            htmlFor="description"
          >
            Description:
          </label>
          <textarea
            className="w-full p-2 bg-[--background] border-2 border-[--primary] caret-[--primaryText] text-[--primaryText] outline-none resize-none overflow-hidden rounded-none"
            placeholder="Description..."
            onChange={(e) => setDescription(e.target.value)}
            ref={descriptionRef}
            rows={1}
            value={description}
            maxLength={128}
            name="description"
          />
          <p className="text-[--secondaryText] text-sm text-right flex flex-row w-full justify-end">
            {description.length}/128
          </p>
        </div>
        <h2 className="text-2xl font-bold text-[--primaryText]">
          Advanced settings:
        </h2>
        <div className="flex flex-row w-full gap-4 h-fit">
          <div className="flex flex-col w-1/3 h-fit">
            <label
              className="text-sm font-semibold text-[--primaryText]"
              htmlFor="colorPalette"
            >
              Color Palette:
            </label>
            <select
              name="colorPalette"
              className="w-full h-10 p-2 text-[--primaryText] bg-[--background] border-[--primary] border-2 focus-visible:outline-none rounded-none"
              value={chosenColorPalette}
              onChange={(e) => setChosenColorPalette(e.target.value)}
            >
              {colorPalettes.map((palette, index) => (
                <option key={index} value={palette.$id}>
                  {palette.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col w-2/3 h-fit">
            <label
              className="text-sm font-semibold text-[--primaryText]"
              htmlFor="subtitle"
            >
              Subtitle:
            </label>
            <input
              name="subtitle"
              className="w-full h-10 p-2 text-[--primaryText] bg-[--background] border-[--primary] border-2 focus-visible:outline-none rounded-none"
              type="text"
              placeholder="Subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>
        </div>
        <button
          className="w-2/3 h-10 p-2 text-[--primaryText] bg-gradient-to-r from-[--fourthly] via-[--primary] to-[--fourthly] mt-4"
          type="submit"
        >
          Post
        </button>
      </form>

      {chooseThumbnail && (
        <div
          className="fixed inset-0 z-40 w-full h-full bg-black/50"
          onClick={() => setChooseThumbnail(false)}
        ></div>
      )}
      {chooseThumbnail && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center w-full h-full gap-2 pointer-events-none">
          <p className="flex items-center justify-start w-4/5 h-7 pl-2 font-semibold text-2xl text-[--primaryText] bg-gradient-to-r from-[--primary] via-[--thirdly] via-55% to-transparent">
            Choose thumbnail:
          </p>
          <div className="grid gap-2 xl:grid-cols-5 lg:grid-cols-5 grid-cols-2 w-4/5 h-[calc(80%_-_2.5rem)] overflow-y-scroll bg-[--secondary] pointer-events-auto pl-2 pr-2 pt-4 pb-4 ">
            {thumbnails.map((thumbnail, index) => {
              const thumbnailId = String(thumbnail).split("/")[8];
              const isSelected = thumbnailId === chosenThumbnail;
              return (
                <button
                  key={index}
                  className="w-full aspect-[2/3] relative"
                  onClick={() => {
                    setChosenThumbnail(thumbnailId);
                  }}
                  type="button"
                >
                  <img
                    src={thumbnail}
                    alt="thumbnail"
                    className="w-full h-full"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <p className="text-3xl text-[--primaryText]">✓</p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex justify-center w-4/5 h-10 pointer-events-auto">
            <button
              className="w-2/3 h-10 p-2 text-[--primaryText] bg-gradient-to-r from-[--fourthly] via-[--primary] to-[--fourthly] cursor-pointer"
              onClick={() => setChooseThumbnail(false)}
              type="button"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {choosePages && (
        <div
          className="fixed inset-0 z-40 w-full h-full bg-black/50"
          onClick={() => setChoosePages(false)}
        ></div>
      )}
      {choosePages && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center w-full h-full gap-2 pointer-events-none">
          <p className="flex items-center justify-start w-4/5 h-7 pl-2 font-semibold text-2xl text-[--primaryText] bg-gradient-to-r from-[--primary] via-[--thirdly] via-55% to-transparent">
            Choose thumbnail:
          </p>
          <div className="grid gap-2 xl:grid-cols-5 lg:grid-cols-5 grid-cols-2 w-4/5 h-[calc(80%_-_2.5rem)] overflow-y-scroll bg-[--secondary] pointer-events-auto pl-2 pr-2 pt-4 pb-4 ">
            {pages.map((page, index) => {
              const pageId = String(page).split("/")[8];
              const isSelected = chosenPages?.includes(pageId);
              return (
                <button
                  key={index}
                  className="w-full aspect-[2/3] relative"
                  onClick={() => {
                    if (isSelected && chosenPages) {
                      setChosenPages((prev) =>
                        prev?.filter((page) => page !== pageId)
                      );
                    } else {
                      setChosenPages((prev) => {
                        if (prev) {
                          return [...prev, pageId];
                        } else {
                          return [pageId];
                        }
                      });
                    }
                  }}
                  type="button"
                >
                  <img src={page} alt="thumbnail" className="w-full h-full" />
                  {isSelected && chosenPages && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <p className="text-3xl text-[--primaryText]">
                        {chosenPages.indexOf(pageId) + 1}
                      </p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex justify-center w-4/5 h-10 pointer-events-auto">
            <button
              className="w-2/3 h-10 p-2 text-[--primaryText] bg-gradient-to-r from-[--fourthly] via-[--primary] to-[--fourthly] cursor-pointer"
              onClick={() => setChoosePages(false)}
              type="button"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChapterForm;
