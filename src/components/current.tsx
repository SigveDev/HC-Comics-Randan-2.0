import { useState, useEffect } from "react";
import { getChapterByID, getLiked } from "../lib/Appwrite";
import { User, Chapter, LikesRequest } from "../assets/types";

import ChapterViewH from "./chapterViewH";
import { SkeletonBox } from "./skeleton";

const Current = (user: User) => {
  const [chapter, setChapter] = useState<Chapter>();
  const [liked, setLiked] = useState<boolean>(false);

  useEffect(() => {
    const fetchChapters = async () => {
      if (user && user.prefs.current && user.prefs.current !== "") {
        const chapter: Chapter = (await getChapterByID(
          user.prefs.current
        )) as Chapter;
        setChapter(chapter);
      }
    };
    fetchChapters();
  }, [user]);

  useEffect(() => {
    const fetchLikedChapters = async () => {
      if (chapter !== undefined && user) {
        const liked: LikesRequest = (await getLiked(user.$id)) as LikesRequest;
        const likedChapters = liked.documents[0].Chapters as Chapter[];
        const likedStatus = likedChapters.find(
          (likedChapter: Chapter) => likedChapter.$id === chapter.$id
        )
          ? true
          : false;
        setLiked(likedStatus);
      }
    };
    fetchLikedChapters();
  }, [chapter]);

  return (
    <div className="flex flex-col w-full col-span-1 gap-2 xl:col-span-3 lg:col-span-3 h-fit">
      <p className="flex items-center justify-start h-7 pl-2 font-semibold text-lg text-[--primaryText] bg-gradient-to-r from-[--primary] via-[--thirdly] via-55% to-transparent">
        Reading
      </p>
      {chapter ? (
        <ChapterViewH
          chapter={chapter}
          likedStatus={liked}
          loggedIn={true}
          userId={user.$id as string}
        />
      ) : (
        <SkeletonBox className="w-full h-52" />
      )}
    </div>
  );
};

export default Current;
