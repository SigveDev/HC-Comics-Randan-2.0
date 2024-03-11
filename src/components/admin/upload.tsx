import { useState, useEffect } from "react";
import {
  uploadPages,
  uploadThumbnail,
  uploadArt,
  getMyPages,
  getMyThumbnails,
  getMyArt,
  removeThumbnail,
  removePage,
  removeArt,
} from "../../lib/Appwrite";
import { useDropzone } from "react-dropzone";
import { Loader2, Trash } from "lucide-react";

const Upload = () => {
  const [type, setType] = useState<string>("thumbnail");
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [tempFiles, setTempFiles] = useState<URL[]>([]);
  const [oldFiles, setOldFiles] = useState<URL[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(true);

  useEffect(() => {
    const fetchOldFiles = async () => {
      if (type === "thumbnail") {
        const files: URL[] = (await getMyThumbnails()) as URL[];
        setOldFiles(files.reverse());
      } else if (type === "page") {
        const files: URL[] = (await getMyPages()) as URL[];
        setOldFiles(files.reverse());
      } else if (type === "art") {
        const files: URL[] = (await getMyArt()) as URL[];
        setOldFiles(files.reverse());
      }
    };
    if (refresh) {
      fetchOldFiles();
      setRefresh(false);
    }
  }, [refresh]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
      "image/JPG": [],
    },
    maxSize: 5368709120,
    onDrop: (acceptedFiles) => {
      setNewFiles(acceptedFiles);
      setTempFiles(
        acceptedFiles.map((file) => URL.createObjectURL(file) as unknown as URL)
      );
    },
  });

  const handleUpload = async () => {
    setLoading(true);
    if (type === "thumbnail") {
      newFiles.forEach(async (file) => {
        await uploadThumbnail(file);
        setNewFiles([]);
        setTempFiles([]);
        setLoading(false);
        setRefresh(true);
      });
    } else if (type === "page") {
      newFiles.forEach(async (file) => {
        await uploadPages(file);
        setNewFiles([]);
        setTempFiles([]);
        setLoading(false);
        setRefresh(true);
      });
    } else if (type === "art") {
      newFiles.forEach(async (file) => {
        await uploadArt(file);
        setNewFiles([]);
        setTempFiles([]);
        setLoading(false);
        setRefresh(true);
      });
    }
  };

  return (
    <div className="flex flex-col w-full gap-4 h-fit">
      <div className="grid w-full grid-cols-3 gap-4 h-fit">
        <button
          className={`flex items-center justify-center h-12 text-xl font-semibold text-[--primaryText] bg-transparent border-2 ${type === "thumbnail" ? "border-[--primary]" : "border-[--secondary] hover:border-[--primary]"}`}
          onClick={() => {
            setType("thumbnail");
            setRefresh(true);
          }}
        >
          Thumbnail
        </button>
        <button
          className={`flex items-center justify-center h-12 text-xl font-semibold text-[--primaryText] bg-transparent border-2 ${type === "page" ? "border-[--primary]" : "border-[--secondary] hover:border-[--primary]"}`}
          onClick={() => {
            setType("page"), setRefresh(true);
          }}
        >
          Page
        </button>
        <button
          className={`flex items-center justify-center h-12 text-xl font-semibold text-[--primaryText] bg-transparent border-2 ${type === "art" ? "border-[--primary]" : "border-[--secondary] hover:border-[--primary]"}`}
          onClick={() => {
            setType("art");
            setRefresh(true);
          }}
        >
          Art
        </button>
      </div>
      <div
        {...getRootProps()}
        className="flex flex-col justify-center items-center w-full h-60 bg-transparent border-dashed border-2 border-[--primary] rounded-lg cursor-pointer"
      >
        <input {...getInputProps()} />
        <p className="text-[--primaryText] text-center">
          Drag and drop files here, or click to select files
        </p>
      </div>
      {tempFiles.length > 0 && (
        <>
          <h2 className="text-lg text-[--primaryText] font-semibold">
            New {type} files:
          </h2>
          <div className="grid w-full grid-cols-4 gap-4 h-fit">
            {tempFiles.map((file, index) => (
              <div
                className="w-full aspect-[2/3] cursor-pointer group/file relative"
                key={index}
                onClick={() => {
                  const temp = tempFiles.filter((_, i) => i !== index);
                  setTempFiles(temp);
                  const temp2 = newFiles.filter((_, i) => i !== index);
                  setNewFiles(temp2);
                }}
              >
                <div className="absolute top-0 right-0 items-center justify-center hidden w-full h-full bg-black bg-opacity-50 group-hover/file:flex">
                  <p className="text-lg font-semibold text-red-600">
                    <Trash size={32} />
                  </p>
                </div>
                <img
                  key={index}
                  src={file.toString()}
                  alt="thumbnail"
                  className="w-full aspect-[2/3]"
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center justify-center w-full h-fit">
            <button
              className="w-2/3 h-10 p-2 text-[--primaryText] bg-gradient-to-r from-[--fourthly] via-[--primary] to-[--fourthly]"
              onClick={handleUpload}
            >
              Save
            </button>
          </div>
        </>
      )}
      <h2 className="text-lg text-[--primaryText] font-semibold">
        Existing {type} files:
      </h2>
      <div className="grid w-full grid-cols-4 gap-4 h-fit">
        {oldFiles.map((file, index) => (
          <div
            className="w-full aspect-[2/3] cursor-pointer group/file relative"
            key={index}
            onClick={() => {
              const fileId = file.pathname.toString().split("/")[6];
              if (type === "thumbnail") removeThumbnail(fileId);
              if (type === "page") removePage(fileId);
              if (type === "art") removeArt(fileId);
              const temp = oldFiles.filter((_, i) => i !== index);
              setOldFiles(temp);
            }}
          >
            <div className="absolute top-0 right-0 items-center justify-center hidden w-full h-full bg-black bg-opacity-50 group-hover/file:flex">
              <p className="text-lg font-semibold text-red-600">
                <Trash size={32} />
              </p>
            </div>
            <img
              key={index}
              src={file.toString()}
              alt="thumbnail"
              className="w-full aspect-[2/3]"
            />
          </div>
        ))}
      </div>
      {loading && (
        <div className="fixed top-0 right-0 flex flex-col items-center justify-center w-dvw h-dvh bg-black/50">
          <Loader2 className="w-12 h-12 text-[--primary] animate-spin" />
        </div>
      )}
    </div>
  );
};

export default Upload;
