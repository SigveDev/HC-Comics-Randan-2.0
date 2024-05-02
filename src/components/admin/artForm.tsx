import { Loader2 } from "lucide-react";
import useAutosizeTextArea from "../../functions/useAutosizeTextArea";
import { getMyArt, createArt } from "../../lib/Appwrite";
import { useState, useEffect, useRef } from "react";

const ArtForm = () => {
  const [arts, setArts] = useState<string[]>([]);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [chosenArt, setChosenArt] = useState<string>();

  const [chooseArt, setChooseArt] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchArt = async () => {
      const tempArts = await getMyArt();
      setArts(tempArts as string[]);
    };
    fetchArt();
  }, []);

  useAutosizeTextArea(descriptionRef.current, description);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log({ title, description, chosenArt });
    if (title && description && chosenArt) {
      await createArt(title, description, chosenArt);
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
            Art title:
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
              Art:
            </label>
            {chosenArt === undefined ? (
              <button
                name="art"
                className="border-[--primary] border-2 bg-[--background] h-64 aspect-[2/3] text-[--secondaryText] text-lg"
                onClick={() => setChooseArt(true)}
                type="button"
              >
                Art
              </button>
            ) : (
              <button
                className="h-64 aspect-[2/3]"
                onClick={() => {
                  setChooseArt(true);
                }}
                type="button"
              >
                <img
                  src={arts.find((art) => String(art).includes(chosenArt))}
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
          </div>
        </div>
        <button
          className="w-2/3 h-10 p-2 text-[--primaryText] bg-gradient-to-r from-[--fourthly] via-[--primary] to-[--fourthly] mt-4"
          type="submit"
        >
          Post
        </button>
      </form>

      {chooseArt && (
        <div
          className="fixed inset-0 z-40 w-full h-full bg-black/50"
          onClick={() => setChooseArt(false)}
        ></div>
      )}
      {chooseArt && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center w-full h-full gap-2 pointer-events-none">
          <p className="flex items-center justify-start w-4/5 h-7 pl-2 font-semibold text-2xl text-[--primaryText] bg-gradient-to-r from-[--primary] via-[--thirdly] via-55% to-transparent">
            Choose art:
          </p>
          <div className="grid gap-2 xl:grid-cols-5 lg:grid-cols-5 grid-cols-2 w-4/5 h-[calc(80%_-_2.5rem)] overflow-y-scroll bg-[--secondary] pointer-events-auto pl-2 pr-2 pt-4 pb-4 ">
            {arts.map((art, index) => {
              const artId = String(art).split("/")[8];
              const isSelected = artId === chosenArt;
              return (
                <button
                  key={index}
                  className="w-full aspect-[2/3] relative"
                  onClick={() => {
                    setChosenArt(artId);
                  }}
                  type="button"
                >
                  <img src={art} alt="thumbnail" className="w-full h-full" />
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
              onClick={() => setChooseArt(false)}
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

export default ArtForm;
