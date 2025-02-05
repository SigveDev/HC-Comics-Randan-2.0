import { useEffect, useState } from "react";
import { Author, AuthorRequest } from "../../../assets/types";
import {
  getMyAuthor,
  checkAuthorTeamsMembership,
  createAuthor,
} from "../../../lib/Appwrite";
import ChaptersListA from "../../../components/admin/chaptersListA";
import ArtListA from "../../../components/admin/artListA";
import Analytics from "../../../components/admin/analytics";
import Upload from "../../../components/admin/upload";
import CreatePost from "../../../components/admin/createPost";
import { useDropzone } from "react-dropzone";
import TitlesListA from "../../../components/admin/titlesListA";
import PageSettings from "../../../components/admin/pageSettings";

const AdminHome = () => {
  const [author, setAuthor] = useState<Author | null>(null);
  const [createAuthorModal, setCreateAuthorModal] = useState<boolean>(false);
  const [tabb, setTabb] = useState<string>("chapters");

  const [name, setName] = useState<string>("");

  const [tempPfp, setTempPfp] = useState<string>();
  const [tempFile, setTempFile] = useState<File>();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
      "image/JPG": [],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setTempPfp(URL.createObjectURL(file));
      setTempFile(file);
    },
  });

  useEffect(() => {
    const fetchAuthor = async () => {
      const isAuthor = await checkAuthorTeamsMembership();
      if (!isAuthor) {
        window.location.href = "/";
      }
      const author: AuthorRequest =
        ((await getMyAuthor()) as AuthorRequest) || undefined;
      if (author !== undefined) {
        setAuthor(author.documents[0] as Author);
      } else {
        setCreateAuthorModal(true);
      }
    };
    fetchAuthor();
  }, []);

  const handleCreateAuthor = async () => {
    if (name && tempFile) {
      await createAuthor(name, tempFile);
      window.location.reload();
    }
  };

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
          className={`flex items-center justify-start h-12 text-xl ${tabb === "titles" ? "w-full pl-6" : "pl-2 w-2/3 hover:pl-4 hover:w-5/6"} font-semibold text-[--primaryText] bg-gradient-to-r from-[--primary] via-[--thirdly] via-55% to-transparent`}
          onClick={() => setTabb("titles")}
        >
          My Titles
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
          New
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
          Page Settings
        </button>
      </div>
      <div className="flex flex-col w-full col-span-7 gap-6 px-16 h-fit">
        {tabb === "chapters" && author && (
          <ChaptersListA chapters={author.Chapters} />
        )}
        {tabb === "arts" && author && <ArtListA arts={author.Art} />}
        {tabb === "titles" && author && <TitlesListA titles={author.Titles} />}
        {tabb === "analytics" && author && (
          <Analytics
            author={author}
            arts={author.Art}
            chapters={author.Chapters}
          />
        )}
        {tabb === "newPosts" && <CreatePost />}
        {tabb === "upload" && <Upload />}
        {tabb === "settings" && <PageSettings />}
      </div>

      {createAuthorModal && (
        <div
          className="fixed inset-0 z-40 w-full h-full bg-black/50"
          onClick={() => setCreateAuthorModal(false)}
        ></div>
      )}
      {createAuthorModal && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center w-full h-full gap-2 pointer-events-none">
          <p className="flex items-center justify-start w-2/5 h-7 pl-2 font-semibold text-2xl text-[--primaryText] bg-gradient-to-r from-[--primary] via-[--thirdly] via-55% to-transparent">
            Create Author:
          </p>
          <div className="flex flex-col gap-2 w-2/5 h-fit overflow-y-scroll bg-[--secondary] pointer-events-auto pl-2 pr-2 pt-4 pb-4 ">
            <div className="flex flex-col items-center justify-center w-full h-fit">
              <div className="flex justify-center w-full h-64">
                {!tempPfp ? (
                  <div
                    {...getRootProps()}
                    className="flex flex-col items-center justify-center w-64 h-64 border-dashed border-2 border-[--primary] rounded-full cursor-pointer"
                  >
                    <input {...getInputProps()} />
                    <p className="font-semibold text-lg text-[--primaryText]">
                      Image
                    </p>
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-center w-64 h-64"
                    onClick={() => setTempPfp(undefined)}
                  >
                    <img
                      className="w-64 h-64 rounded-full"
                      src={tempPfp}
                      alt="Profile Picture"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="w-full h-fit">
              <label
                className="text-sm font-semibold text-[--primaryText]"
                htmlFor="Title"
              >
                Author username:
              </label>
              <input
                name="title"
                className="w-full h-10 p-2 text-[--primaryText] bg-[--background] border-[--primary] border-2 focus-visible:outline-none rounded-none"
                type="text"
                placeholder="Title"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-center w-2/5 h-10 pointer-events-auto">
            <button
              className="w-2/3 h-10 p-2 text-[--primaryText] bg-gradient-to-r from-[--fourthly] via-[--primary] to-[--fourthly] cursor-pointer"
              onClick={handleCreateAuthor}
              type="button"
            >
              Create
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHome;
