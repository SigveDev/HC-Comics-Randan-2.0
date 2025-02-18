import { ChevronLeft, Loader2 } from "lucide-react";
import useAutosizeTextArea from "../../../functions/useAutosizeTextArea";
import {
  getMyThumbnails,
  getTitleByID,
  updateTitle,
} from "../../../lib/Appwrite";
import { useState, useEffect, useRef } from "react";
import { Title } from "@/assets/types";

const EditTitleForm = () => {
  const titleId = window.location.pathname.split("/")[4];
  const [thumbnails, setThumbnails] = useState<string[]>([]);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [chosenImage, setChosenImage] = useState<string>();

  const [chooseImage, setChooseImage] = useState<boolean>(false);
  const [frontpage, setFrontpage] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchTitle = async () => {
      const title: Title = (await getTitleByID(titleId)) as Title;
      setTitle(title.name);
      setDescription(title.description);
      setChosenImage(title.thumbnail);
      setFrontpage(title.Frontpage);
    };
    fetchTitle();
  }, [titleId]);

  useEffect(() => {
    const fetchThumbnails = async () => {
      const tempArts = await getMyThumbnails();
      setThumbnails(tempArts as string[]);
    };
    fetchThumbnails();
  }, []);

  useAutosizeTextArea(descriptionRef.current, description);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log({ title, description, chosenImage });
    if (title && description && chosenImage) {
      await updateTitle(titleId, title, description, chosenImage, frontpage);
      window.location.href = "/admin";
    }
  };

  return (
    <div className="flex flex-col w-full mb-8 h-fit">
      <button
        className="w-fit h-fit pr-6 py-2 border border-transparent bg-[--background] text-[--primaryText] font-semibold flex flex-row gap-2 justify-center items-center"
        onClick={() => window.history.back()}
      >
        <ChevronLeft />
        <p>Back</p>
      </button>
      <form
        className="flex flex-col items-center justify-center w-4/5 gap-4 mx-auto mt-8 h-fit"
        onSubmit={handleSubmit}
      >
        <div className="w-full h-fit">
          <label
            className="text-sm font-semibold text-[--primaryText]"
            htmlFor="Title"
          >
            Title title:
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
              htmlFor="art"
            >
              Thumbnail:
            </label>
            {chosenImage === undefined ? (
              <button
                name="art"
                className="border-[--primary] border-2 bg-[--background] h-64 aspect-[2/3] text-[--secondaryText] text-lg"
                onClick={() => setChooseImage(true)}
                type="button"
              >
                Thumbnail
              </button>
            ) : (
              <button
                className="h-64 aspect-[2/3]"
                onClick={() => {
                  setChooseImage(true);
                }}
                type="button"
              >
                <img
                  src={thumbnails.find((thumbnail) =>
                    String(thumbnail).includes(chosenImage)
                  )}
                  alt="art"
                  className="w-64 h-64"
                />
              </button>
            )}
          </div>
          <div className="flex flex-col w-1/2 h-fit">
            <label
              className="text-sm font-semibold text-[--primaryText]"
              htmlFor="description"
            >
              Description:
            </label>
            <textarea
              ref={descriptionRef}
              name="description"
              className="w-full h-fit p-2 text-[--primaryText] bg-[--background] border-[--primary] border-2 focus-visible:outline-none"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <p className="text-[--secondaryText] text-sm text-right flex flex-row w-full justify-end">
              {description.length}/128
            </p>
            <br />
            <div className="flex flex-row items-center justify-start gap-2 w-fit h-fit">
              <p className="text-sm font-semibold text-[--primaryText]">
                Frontpage:
              </p>
              <label className="relative inline-flex items-center ml-2 cursor-pointer w-fit">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  onClick={() => setFrontpage(!frontpage)}
                  defaultChecked={frontpage}
                />
                <div className="w-11 h-6 peer-focus:outline-none rounded-full peer bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[--primary]"></div>
              </label>
            </div>
          </div>
        </div>
        <button
          className="w-2/3 h-10 p-2 text-[--primaryText] bg-gradient-to-r from-[--fourthly] via-[--primary] to-[--fourthly] mt-4"
          type="submit"
        >
          Update title
        </button>
      </form>

      {chooseImage && (
        <div
          className="fixed inset-0 z-40 w-full h-full bg-black/50"
          onClick={() => setChooseImage(false)}
        ></div>
      )}
      {chooseImage && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center w-full h-full gap-2 pointer-events-none">
          <p className="flex items-center justify-start w-4/5 h-7 pl-2 font-semibold text-2xl text-[--primaryText] bg-gradient-to-r from-[--primary] via-[--thirdly] via-55% to-transparent">
            Choose thumbnail:
          </p>
          <div className="grid gap-2 xl:grid-cols-5 lg:grid-cols-5 grid-cols-2 w-4/5 h-[calc(80%_-_2.5rem)] overflow-y-scroll bg-[--secondary] pointer-events-auto pl-2 pr-2 pt-4 pb-4 ">
            {thumbnails.map((thumbnail, index) => {
              const thumbnailId = String(thumbnail).split("/")[8];
              const isSelected = thumbnailId === chosenImage;
              return (
                <button
                  key={index}
                  className="w-full aspect-[2/3] relative"
                  onClick={() => {
                    setChosenImage(thumbnailId);
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
              onClick={() => setChooseImage(false)}
              type="button"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed top-0 right-0 flex flex-col items-center justify-center w-dvw h-dvh bg-black/50">
          <Loader2 className="w-12 h-12 text-[--primary] animate-spin" />
        </div>
      )}
    </div>
  );
};

export default EditTitleForm;
