import { useEffect, useState } from "react";
import { Author, AuthorRequest } from "../../../assets/types";
import { getMyAuthor, checkAuthorTeamsMembership } from "../../../lib/Appwrite";
import ChaptersListA from "../../../components/admin/chaptersListA";
import ArtListA from "../../../components/admin/artListA";
import Analytics from "../../../components/admin/analytics";
import Upload from "../../../components/admin/upload";
import CreatePost from "../../../components/admin/createPost";

const AdminHome = () => {
  const [author, setAuthor] = useState<Author | null>(null);
  const [tabb, setTabb] = useState<string>("chapters");

  useEffect(() => {
    const fetchAuthor = async () => {
      const isAuthor = await checkAuthorTeamsMembership();
      if (!isAuthor) {
        window.location.href = "/";
      }
      const author: AuthorRequest =
        ((await getMyAuthor()) as AuthorRequest) || Boolean;
      if (author) {
        setAuthor(author.documents[0] as Author);
      }
    };
    fetchAuthor();
  }, []);

  return (
    <div className="grid w-full h-full grid-cols-10 gap-4 py-8 grow">
      <div className="flex flex-col w-full col-span-3 gap-6 h-fit">
        <button
          className={`flex items-center justify-start h-12 text-xl ${tabb === "chapters" ? "w-full pl-6" : "pl-2 w-2/3 hover:pl-4 hover:w-5/6"} font-semibold text-[--primaryText] bg-gradient-to-r from-[--primary] via-[--thirdly] via-55% to-transparent`}
          onClick={() => setTabb("chapters")}
        >
          My Chapters
        </button>
        <button
          className={`flex items-center justify-start h-12 text-xl ${tabb === "arts" ? "w-full pl-6" : "pl-2 w-2/3 hover:pl-4 hover:w-5/6"} font-semibold text-[--primaryText] bg-gradient-to-r from-[--primary] via-[--thirdly] via-55% to-transparent`}
          onClick={() => setTabb("arts")}
        >
          My Art
        </button>
        <button
          className={`flex items-center justify-start h-12 text-xl ${tabb === "analytics" ? "w-full pl-6" : "pl-2 w-2/3 hover:pl-4 hover:w-5/6"} font-semibold text-[--primaryText] bg-gradient-to-r from-[--primary] via-[--thirdly] via-55% to-transparent`}
          onClick={() => setTabb("analytics")}
        >
          Analytics
        </button>
        <button
          className={`flex items-center justify-start h-12 text-xl ${tabb === "newPosts" ? "w-full pl-6" : "pl-2 w-2/3 hover:pl-4 hover:w-5/6"} font-semibold text-[--primaryText] bg-gradient-to-r from-[--primary] via-[--thirdly] via-55% to-transparent`}
          onClick={() => setTabb("newPosts")}
        >
          New Posts
        </button>
        <button
          className={`flex items-center justify-start h-12 text-xl ${tabb === "upload" ? "w-full pl-6" : "pl-2 w-2/3 hover:pl-4 hover:w-5/6"} font-semibold text-[--primaryText] bg-gradient-to-r from-[--primary] via-[--thirdly] via-55% to-transparent`}
          onClick={() => setTabb("upload")}
        >
          Upload
        </button>
        <br />
        <button
          className={`flex items-center justify-start h-12 text-xl ${tabb === "settings" ? "w-full pl-6" : "pl-2 w-2/3 hover:pl-4 hover:w-5/6"} font-semibold text-[--primaryText] bg-gradient-to-r from-[--primary] via-[--thirdly] via-55% to-transparent`}
          onClick={() => setTabb("settings")}
        >
          Settings
        </button>
      </div>
      <div className="flex flex-col w-full col-span-7 gap-6 px-16 h-fit">
        {tabb === "chapters" && author && (
          <ChaptersListA chapters={author.Chapters} />
        )}
        {tabb === "arts" && author && <ArtListA arts={author.Art} />}
        {tabb === "analytics" && author && (
          <Analytics
            author={author}
            arts={author.Art}
            chapters={author.Chapters}
          />
        )}
        {tabb === "newPosts" && <CreatePost />}
        {tabb === "upload" && <Upload />}
        {tabb === "settings" && <p>Settings</p>}
      </div>
    </div>
  );
};

export default AdminHome;
