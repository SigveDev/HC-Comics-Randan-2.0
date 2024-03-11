import { useEffect, useState } from "react";
import { Chapter, LikesRequest } from "@/assets/types";
import { ChevronUp, ChevronDown } from "lucide-react";
import { getLiked, checkUserData } from "../lib/Appwrite";
import ChapterViewH from "./chapterViewH";

const ChaptersList = ({ chapters }: { chapters: Chapter[] }) => {
  const [sortedChapters, setSortedChapters] = useState<Chapter[]>(chapters);
  const [likedChapters, setLikedChapters] = useState<Chapter[]>([]);
  const [isASC, setIsASC] = useState<boolean>(true);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>();

  useEffect(() => {
    const fetchLikedChapters = async () => {
      const user = await checkUserData();
      if (user) {
        setLoggedIn(true);
        setUserId(user.$id as string);
      } else {
        setLoggedIn(false);
      }
      const likedChapters: LikesRequest = (await getLiked(
        user.$id
      )) as LikesRequest;
      setLikedChapters(likedChapters.documents[0].Chapters as Chapter[]);
    };
    fetchLikedChapters();
  }, []);

  const handleSort = () => {
    if (isASC) {
      const sorted = [...chapters].sort((a, b) =>
        b.title.localeCompare(a.title)
      );
      setSortedChapters(sorted);
    } else {
      const sorted = [...chapters].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      setSortedChapters(sorted);
    }
    setIsASC(!isASC);
  };

  return (
    <div className="flex flex-col w-full gap-2 h-fit">
      <p className="flex items-center justify-start h-7 pl-2 font-semibold text-[--primaryText] bg-gradient-to-r from-[--primary] via-[--thirdly] via-55% to-transparent">
        Chapters{" "}
        <button onClick={handleSort}>
          {isASC ? <ChevronDown /> : <ChevronUp />}
        </button>
      </p>
      {sortedChapters.map((chapter: Chapter) => {
        const likedStatus = likedChapters.find(
          (likedChapter: Chapter) => likedChapter.$id === chapter.$id
        )
          ? true
          : false;
        return (
          <ChapterViewH
            chapter={chapter}
            likedStatus={likedStatus}
            loggedIn={loggedIn}
            userId={userId as string}
            key={chapter.$id}
          />
        );
      })}
    </div>
  );
};

export default ChaptersList;
