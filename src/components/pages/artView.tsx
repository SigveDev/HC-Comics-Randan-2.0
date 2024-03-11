import { useState, useEffect } from "react";
import {
  checkUserData,
  getArtImage,
  giveArtView,
  likeArtToggle,
  shareArt,
  getArtById,
  getLiked,
} from "../../lib/Appwrite";
import { Art, LikesRequest } from "../../assets/types";
import { calculateHowLongAgo } from "../../functions/CalculateHowLongAgo";
import { Forward, Heart, HeartHandshake, MessageSquare } from "lucide-react";
import CommentViewH from "../commentViewH";

const ArtView = () => {
  const artId = window.location.pathname.split("/")[2];
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>();
  const [art, setArt] = useState<Art>();
  const [artImage, setArtImage] = useState<URL>();
  const [howLongAgo, setHowLongAgo] = useState<string>();
  const [liked, setLiked] = useState<boolean>(false);
  const [viewGiven, setViewGiven] = useState<boolean>(false);

  useEffect(() => {
    const fetchLikedArt = async () => {
      const user = await checkUserData();
      if (user) {
        setIsLoggedIn(true);
        setUserId(user.$id as string);
      } else {
        setIsLoggedIn(false);
      }
      const likedArt: LikesRequest = (await getLiked(user.$id)) as LikesRequest;
      setLiked(
        likedArt.documents[0].Art.find(
          (likedArt: Art) => likedArt.$id === artId
        )
          ? true
          : false
      );
    };
    fetchLikedArt();
  }, []);

  useEffect(() => {
    const fetchArt = async () => {
      const art: Art = (await getArtById(artId)) as Art;
      setArt(art);
    };
    fetchArt();
  }, [artId]);

  useEffect(() => {
    const fetchArt = async () => {
      if (!viewGiven && artId) {
        (await giveArtView(artId)) as Art;
        setViewGiven(true);
      }
    };
    fetchArt();
  }, [artId]);

  useEffect(() => {
    const getArtImageFunc = async () => {
      const artImage: URL = (await getArtImage(art?.image as string)) as URL;
      setArtImage(artImage);
    };
    getArtImageFunc();
  }, [art]);

  useEffect(() => {
    setHowLongAgo(calculateHowLongAgo(art?.$createdAt as Date));
  }, [art?.$createdAt]);

  const handleLikeing = async () => {
    if (isLoggedIn && userId) {
      setLiked(!liked);
      await likeArtToggle(art?.$id as string, userId);
    }
  };

  const handleShare = () => {
    if (art) {
      shareArt(art.$id);
      if (navigator.share) {
        navigator
          .share({
            title: art.title,
            text: art.description,
            url: window.location.href,
          })
          .then(() => {
            console.log("Thanks for sharing!");
          })
          .catch(console.error);
      } else {
        navigator.clipboard.writeText(window.location.href);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-8 mt-8 mb-8 h-fit">
      <div className="flex flex-row max-w-[900px] h-fit gap-2">
        {artImage && (
          <img
            className="w-1/2 aspect-[2/3]"
            src={artImage.toString()}
            alt={art?.title}
          />
        )}
        <div className="w-1/2 h-full flex flex-col bg-[--secondary] relative aspect-[2/3] p-2">
          <h2 className="text-[--primaryText] font-bold text-lg mb-2">
            {art?.title}
          </h2>
          <p className="text-[--primaryText] font-semibold text-md">
            Description:
          </p>
          <hr className="border-[--primaryText]" />
          <p className="text-[--primaryText] font-medium text-sm grow w-full">
            {art?.description}
          </p>
          <hr className="border-[--primaryText]" />
          <p className="text-sm font-medium text-[--secondaryText]">
            Posted {howLongAgo}
          </p>

          <div className="absolute flex flex-row items-center justify-center gap-2 top-2 right-2">
            {isLoggedIn &&
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
            {isLoggedIn && (
              <a
                href="#comments"
                className="flex items-center justify-center w-full font-semibold text-[--primaryText] h-fit"
              >
                <MessageSquare />
              </a>
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
      </div>
      <div className="w-full max-w-[1000px]" id="comments">
        <CommentViewH id={artId} loggedIn={isLoggedIn} chapterOrNot={false} />
      </div>
    </div>
  );
};

export default ArtView;
