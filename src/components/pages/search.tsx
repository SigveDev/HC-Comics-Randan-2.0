import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { getSearchResults, checkUserData, getLiked } from "../../lib/Appwrite";
import {
  Art,
  Chapter,
  LikesRequest,
  Search as SearchType,
} from "../../assets/types";

import ChapterViewH from "../chapterViewH";
import TitleViewH from "../titleViewH";
import ArtViewH from "../artViewH";
import AuthorViewH from "../authorViewH";

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState<SearchType>();
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>();
  const [likedChapters, setLikedChapters] = useState<Chapter[]>();
  const [likedArt, setLikedArt] = useState<Art[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>();
  const [tabb, setTabb] = useState<string>("chapters");

  const handleSearch = async (e: any) => {
    e.preventDefault();
    if (!searchQuery) return;
    const res: SearchType = (await getSearchResults(searchQuery)) as SearchType;
    setSearchResults(res);
  };

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

      const likedArt: LikesRequest = (await getLiked(user.$id)) as LikesRequest;
      setLikedArt(likedArt.documents[0].Art as Art[]);
    };
    fetchLikedChapters();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex flex-col items-center justify-center w-full gap-2 mt-8 xl:w-2/5 lg:w-2/5 h-fit">
        <div className="flex flex-row items-center justify-start w-full p-2 h-1/2">
          <form onSubmit={handleSearch} className="flex flex-row w-full h-full">
            <input
              className="w-full h-12 text-lg font-semibold text-[--primaryText] bg-[--secondary] outline-none p-2 border-[--primary] border-t-2 border-b-2 border-l-2 rounded-none"
              placeholder="Search"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <Search className="w-12 h-12 p-2 text-[--primaryText] bg-[--secondary] border-[--primary] border-t-2 border-b-2 border-r-2" />
            </button>
          </form>
        </div>
        <div className="flex flex-row items-center justify-end w-full gap-2 p-2 h-1/2">
          <button
            className={`flex flex-row items-center bg-[--secondary] justify-center w-full h-12 text-lg font-semibold text-[--primaryText] outline-none ${tabb === "chapters" ? "border-2 border-[--accentText]" : ""}`}
            onClick={() => setTabb("chapters")}
          >
            Chapters
          </button>
          <button
            className={`flex flex-row items-center bg-[--secondary] justify-center w-full h-12 text-lg font-semibold text-[--primaryText] outline-none ${tabb === "titles" ? "border-2 border-[--accentText]" : ""}`}
            onClick={() => setTabb("titles")}
          >
            Titles
          </button>
          <button
            className={`flex flex-row items-center bg-[--secondary] justify-center w-full h-12 text-lg font-semibold text-[--primaryText] outline-none ${tabb === "authors" ? "border-2 border-[--accentText]" : ""}`}
            onClick={() => setTabb("authors")}
          >
            Authors
          </button>
          <button
            className={`flex flex-row items-center bg-[--secondary] justify-center w-full h-12 text-lg font-semibold text-[--primaryText] outline-none ${tabb === "art" ? "border-2 border-[--accentText]" : ""}`}
            onClick={() => setTabb("art")}
          >
            Art
          </button>
        </div>
      </div>
      <div
        className={`grid w-full ${tabb === "chapters" && "xl:grid-cols-2 lg:grid-cols-2 grid-cols-1"} ${tabb === "art" && "xl:grid-cols-6 lg:grid-cols-6 grid-cols-3"} ${tabb === "titles" && "xl:grid-cols-3 lg:grid-cols-3 grid-cols-1"} ${tabb === "authors" && "grid-cols-1"} gap-2 py-8 xl:px-12 lg:px-12 px-4 h-fit`}
      >
        {tabb === "chapters" &&
          searchResults?.chapters.map((chapter, index) => {
            const likedStatus = likedChapters?.find(
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
                key={index}
              />
            );
          })}
        {tabb === "titles" &&
          searchResults?.titles.map((title, index) => {
            return <TitleViewH title={title} key={index} />;
          })}
        {tabb === "authors" &&
          searchResults?.authors.map((author, index) => {
            return (
              <div className="w-3/5 justify-self-center">
                <AuthorViewH author={author} key={index} />
              </div>
            );
          })}
        {tabb === "art" &&
          searchResults?.art.map((post, index) => {
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
  );
};

export default SearchPage;
