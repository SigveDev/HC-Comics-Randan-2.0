import {
  ColorPalette,
  TitleRequest,
  ColorPaletteRequest,
  Title,
} from "../../assets/types";
import useAutosizeTextArea from "../../functions/useAutosizeTextArea";
import { getMyTitles, getColorPalattes } from "../../lib/Appwrite";
import { Plus } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const ChapterForm = () => {
  const [title, setTitle] = useState<string>("");
  const [existingTitles, setExistingTitles] = useState<Title[]>([]);
  const [colorPalettes, setColorPalettes] = useState<ColorPalette[]>([]);
  const [chosenTitle, setChosenTitle] = useState<string>();
  const [titleIndex, setChapterIndex] = useState<number>();
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [description, setDescription] = useState<string>("");

  const [chooseThumbnail, setChooseThumbnail] = useState<boolean>(false);

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(title);
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
            <button
              name="thumbnail"
              className="border-[--primary] border-2 bg-[--background] h-64 aspect-[2/3] text-[--secondaryText] text-lg"
              onClick={() => setChooseThumbnail(!chooseThumbnail)}
            >
              Thumbnail
            </button>
          </div>
          <div className="flex flex-col items-end w-48 h-fit">
            <label
              className="text-sm font-semibold text-[--primaryText] flex justify-start flex-col w-full"
              htmlFor="pages"
            >
              Add pages:
            </label>
            <button
              name="pages"
              className="relative border-[--primary] border-2 bg-[--background] h-64 aspect-[2/3] w-fit text-[--secondaryText] flex flx-col justify-center items-center"
            >
              <div className="absolute h-full w-6 top-0 left-[-1.5rem] border-y-2 border-l-2 border-[--primary]"></div>
              <Plus size={32} />
            </button>
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

      {chooseThumbnail && <div className="flex flex-col w-4/5 h-4/5"></div>}
      {chooseThumbnail && (
        <div
          className="fixed inset-0 z-50 w-full h-full bg-black/50"
          onClick={() => setChooseThumbnail(false)}
        ></div>
      )}
    </div>
  );
};

export default ChapterForm;
