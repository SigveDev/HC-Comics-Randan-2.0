import { useState } from "react";
import ChapterForm from "./chapterForm";

const CreatePost = () => {
  const [type, setType] = useState<string>("chapter");

  return (
    <div className="flex flex-col w-full gap-4 h-fit">
      <div className="grid w-full grid-cols-3 gap-4 h-fit">
        <button
          className={`flex items-center justify-center h-12 text-xl font-semibold text-[--primaryText] bg-transparent border-2 ${type === "chapter" ? "border-[--primary]" : "border-[--secondary] hover:border-[--primary]"}`}
          onClick={() => setType("chapter")}
        >
          Chapter
        </button>
        <button
          className={`flex items-center justify-center h-12 text-xl font-semibold text-[--primaryText] bg-transparent border-2 ${type === "art" ? "border-[--primary]" : "border-[--secondary] hover:border-[--primary]"}`}
          onClick={() => setType("art")}
        >
          Art
        </button>
        <button
          className={`flex items-center justify-center h-12 text-xl font-semibold text-[--primaryText] bg-transparent border-2 ${type === "title" ? "border-[--primary]" : "border-[--secondary] hover:border-[--primary]"}`}
          onClick={() => setType("title")}
        >
          Title
        </button>
      </div>
      {type === "chapter" && <ChapterForm />}
    </div>
  );
};

export default CreatePost;
