import { useState, useEffect } from "react";
import {
  Title,
  Author,
  Art,
  LikesRequest,
  FollowingRequest,
} from "../../assets/types";
import {
  getAuthorPFP,
  getAuthorById,
  checkUserData,
  getLiked,
  getFollowing,
  followAuthorToggle,
} from "../../lib/Appwrite";
import { Plus, Check } from "lucide-react";
import TitleViewH from "../titleViewH";
import ArtViewH from "../artViewH";

const AuthorPage = () => {
  const authorID = window.location.pathname.split("/")[2];
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>();
  const [author, setAuthor] = useState<Author>();
  const [followStatus, setFollowStatus] = useState<boolean>();
  const [authorPFP, setAuthorPFP] = useState<string>();
  const [titles, setTitles] = useState<Title[]>([]);
  const [arts, setArts] = useState<Art[]>([]);
  const [likedArt, setLikedArt] = useState<Art[]>([]);
  const [tabb, setTabb] = useState<string>("chapters");

  useEffect(() => {
    const fetchLoggedInUserInfo = async () => {
      const user = await checkUserData();
      if (user) {
        setLoggedIn(true);
        setUserId(user.$id as string);
      } else {
        setLoggedIn(false);
      }
      const likedArt: LikesRequest = (await getLiked(user.$id)) as LikesRequest;
      setLikedArt(likedArt.documents[0].Art as Art[]);

      const followersList: FollowingRequest = (await getFollowing(
        user.$id
      )) as FollowingRequest;
      if (
        followersList.documents[0].Authors.find(
          (author: Author) => author.$id === authorID
        )
      ) {
        setFollowStatus(true);
      } else {
        setFollowStatus(false);
      }
    };
    fetchLoggedInUserInfo();
  }, []);

  useEffect(() => {
    const fetchAuthorInfo = async () => {
      const author = (await getAuthorById(authorID)) as Author;
      setAuthor(author);

      setTitles(author.Titles);
      setArts(author.Art);

      const authorPFP: string = (await getAuthorPFP(authorID)) as string;
      setAuthorPFP(authorPFP);
    };
    fetchAuthorInfo();
  }, [authorID]);

  const toggleFollowing = async () => {
    if (followStatus) {
      setFollowStatus(false);
    } else {
      setFollowStatus(true);
    }
    await followAuthorToggle(authorID, userId as string);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-8 mt-8 mb-8 h-fit">
      <div className="w-full h-fit">
        <div className="flex flex-row w-full h-24 gap-4 px-4 mt-8 xl:px-28 lg:px-28">
          <img
            className="object-cover h-full rounded-full aspect-square"
            src={authorPFP}
            alt="Author Image"
          />
          <div className="flex flex-col w-full h-full">
            <div className="flex flex-row justify-between">
              <h1 className="text-2xl font-bold text-[--primaryText]">
                {author?.name}
              </h1>
              {loggedIn &&
                (followStatus ? (
                  <button
                    className="text-1xl font-semibold text-[--primaryText] flex flex-row gap-1 items-center"
                    onClick={toggleFollowing}
                  >
                    Following <Check />
                  </button>
                ) : (
                  <button
                    className="text-1xl font-semibold text-[--primaryText] flex flex-row gap-1 items-center"
                    onClick={toggleFollowing}
                  >
                    Follow Author <Plus />
                  </button>
                ))}
            </div>
            <hr className="w-full mt-2 border-[--secondaryText]" />
          </div>
        </div>
        <div className="flex justify-center w-full h-fit">
          <div className="flex flex-col w-full gap-4 mx-4 xl:w-1/2 lg:w-1/2">
            <h2 className="text-2xl font-bold text-[--primaryText] w-full flex justify-center">
              Creations:
            </h2>
            <div className="flex flex-row w-full gap-2">
              <button
                className={`flex flex-row items-center bg-[--secondary] justify-center w-full h-12 text-lg font-semibold text-[--primaryText] outline-none ${tabb === "chapters" ? "border-2 border-[--accentText]" : ""}`}
                onClick={() => setTabb("chapters")}
              >
                Chapters
              </button>
              <button
                className={`flex flex-row items-center bg-[--secondary] justify-center w-full h-12 text-lg font-semibold text-[--primaryText] outline-none ${tabb === "art" ? "border-2 border-[--accentText]" : ""}`}
                onClick={() => setTabb("art")}
              >
                Art
              </button>
            </div>
          </div>
        </div>
      </div>
      {tabb === "chapters" ? (
        <div className="grid w-full h-full grid-cols-1 gap-12 px-4 py-8 xl:px-12 lg:px-12 xl:grid-cols-3 lg:grid-cols-3">
          {titles?.map((title, index) => {
            return <TitleViewH title={title} key={index} />;
          })}
        </div>
      ) : (
        <div className="flex flex-col w-full h-full gap-4 px-4 py-8 xl:px-12 lg:px-12">
          <div className="grid grid-cols-3 gap-2 xl:grid-cols-6 lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-3">
            {arts.map((post: Art, index: number) => {
              const likedStatus = likedArt.find(
                (likedArt: Art) => likedArt.$id === post.$id
              )
                ? true
                : false;
              return (
                <ArtViewH
                  art={post}
                  likedStatus={likedStatus}
                  loggedIn={loggedIn}
                  userId={userId as string}
                  key={index}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorPage;
