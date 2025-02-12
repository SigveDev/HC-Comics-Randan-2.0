import { useState, useEffect } from "react";
import { Chapter } from "../assets/types";
import {
  getThumbnailPreview,
  likeChapterToggle,
  shareChapter,
} from "../lib/Appwrite";
import { calculateHowLongAgo } from "../functions/CalculateHowLongAgo";
import { Heart, HeartHandshake, MessageSquare, Forward } from "lucide-react";
import { Drawer } from "vaul";
import CommentViewH from "./commentViewH";
import { Link } from "react-router-dom";

const ChapterViewH = ({
  chapter,
  likedStatus,
  loggedIn,
  userId,
}: {
  chapter: Chapter;
  likedStatus: boolean;
  loggedIn: boolean;
  userId: string;
}) => {
  const [thumbnail, setThumbnail] = useState<URL>();
  const [formatedNumber, setFormatedNumber] = useState<string>();
  const [howLongAgo, setHowLongAgo] = useState<string>();
  const [liked, setLiked] = useState<boolean>(false);

  const [snap, setSnap] = useState<number | string | null>(0.6);

  useEffect(() => {
    setLiked(likedStatus);
  }, [likedStatus]);

  useEffect(() => {
    const fetchThumbnail = async () => {
      const thumbnail: URL = (await getThumbnailPreview(
        chapter.thumbnail
      )) as URL;
      setThumbnail(thumbnail);
    };
    fetchThumbnail();
  }, [chapter.thumbnail]);

  useEffect(() => {
    const formatedNumber = chapter.number.toString().padStart(3, "0");
    setFormatedNumber(formatedNumber);
  }, [chapter.number]);

  useEffect(() => {
    setHowLongAgo(calculateHowLongAgo(chapter.$createdAt));
  }, [chapter.$createdAt]);

  const handleLikeing = async () => {
    if (loggedIn && userId) {
      setLiked(!liked);
      await likeChapterToggle(chapter.$id, userId);
    }
  };

  const handleShare = () => {
    if (chapter) {
      shareChapter(chapter.$id);
      if (navigator.share) {
        navigator
          .share({
            title: chapter.title,
            text: chapter.description,
            url: window.location.href + "/c/" + chapter.$id,
          })
          .then(() => {
            console.log("Thanks for sharing!");
          })
          .catch(console.error);
      } else {
        navigator.clipboard.writeText(
          window.location.href + "/c/" + chapter.$id
        );
      }
    }
  };

  return (
    <Drawer.Root
      shouldScaleBackground
      snapPoints={[0.6, 1]}
      activeSnapPoint={snap}
      setActiveSnapPoint={(e) => {
        if (e !== undefined) {
          setSnap(e);
        } else {
          setSnap(0.6);
        }
      }}
    >
      <div className="flex flex-row w-full gap-2 h-52 bg-[--secondary]">
        <Link
          to={"/c/" + chapter.$id}
          className="flex flex-row w-full h-full gap-2"
        >
          {thumbnail && (
            <img
              className="h-full aspect-[2/3]"
              src={thumbnail.href}
              alt={chapter.title}
            />
          )}
          <div className="flex flex-col w-full h-full grow">
            <h2 className="text-xl font-bold text-[--primaryText] mb-2">
              {chapter.title}
            </h2>
            <h3 className="mb-1 text-sm font-medium text-[--primaryText]">
              {chapter.Titles && chapter.Titles.name + " "}#{formatedNumber}
            </h3>
            <h3 className="mb-2 text-sm font-medium text-[--primaryText]">
              By:{" "}
              <Link to={"/u/" + chapter.Author.$id} className="underline">
                {chapter.Author.name}
              </Link>
            </h3>
            <p className="mt-auto text-sm font-medium text-[--secondaryText] mb-2">
              Posted {howLongAgo}
            </p>
          </div>
        </Link>
        <div className="flex flex-col gap-3 mt-3 mr-3 h-fit w-fit">
          {loggedIn &&
            (liked ? (
              <button
                type="button"
                className={`'flex items-center justify-center w-full font-semibold text-[--accentText] h-fit rounded p-1`}
                onClick={handleLikeing}
              >
                <HeartHandshake />
              </button>
            ) : (
              <button
                type="button"
                className={`'flex items-center justify-center w-full font-semibold text-[--primaryText] h-fit rounded p-1`}
                onClick={handleLikeing}
              >
                <Heart />
              </button>
            ))}
          {loggedIn && (
            <Drawer.Trigger
              type="button"
              className="flex items-center justify-center w-full font-semibold text-[--primaryText] h-fit"
            >
              <MessageSquare />
            </Drawer.Trigger>
          )}
          <button
            type="button"
            className="flex items-center justify-center w-full font-semibold text-[--primaryText] h-fit"
            onClick={handleShare}
          >
            <Forward />
          </button>
        </div>
      </div>

      <Drawer.Overlay className="fixed inset-0 z-40 bg-black/50" />
      <Drawer.Portal>
        <Drawer.Content className="bg-[--background] border-2 z-50 border-[--primary] flex flex-col items-center rounded-t-[10px] h-full max-h-[80%] fixed bottom-0 left-0 right-0">
          <div
            className={`max-w-[1000px] w-full flex flex-col p-4 rounded-t-[10px] overflow-y-auto`}
          >
            <div className="mx-auto w-16 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-4" />
            <div className="w-full">
              <CommentViewH
                id={chapter.$id}
                loggedIn={loggedIn}
                chapterOrNot={true}
              />
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default ChapterViewH;
