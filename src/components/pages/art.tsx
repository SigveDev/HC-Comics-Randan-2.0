import { useState, useEffect } from "react";
import { Art, ArtRequest, LikesRequest } from "../../assets/types";
import {
  getArtPostsPagination,
  checkUserData,
  getLiked,
} from "../../lib/Appwrite";

import ArtViewH from "../artViewH";
import { SkeletonBox } from "../skeleton";

const ArtPage = () => {
  const [artPosts, setArtPosts] = useState<Art[]>();
  const [page, setPage] = useState<number>(0);
  const [likedArt, setLikedArt] = useState<Art[]>([]);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>();

  useEffect(() => {
    const fetchLikedArt = async () => {
      const user = await checkUserData();
      if (user) {
        setLoggedIn(true);
        setUserId(user.$id as string);
      } else {
        setLoggedIn(false);
      }
      const likedArt: LikesRequest = (await getLiked(user.$id)) as LikesRequest;
      setLikedArt(likedArt.documents[0].Art as Art[]);
    };
    fetchLikedArt();
  }, []);

  useEffect(() => {
    const getArtPosts = async () => {
      const newArtPosts: ArtRequest = (await getArtPostsPagination(
        page
      )) as ArtRequest;
      const arts: Art[] = newArtPosts.documents;

      if (artPosts !== undefined) {
        arts.forEach((art: Art) => {
          const existingArt = artPosts.find(
            (post: Art) => post.$id === art.$id
          );
          if (!existingArt) {
            setArtPosts((prevArtPosts) =>
              prevArtPosts ? [...prevArtPosts, art] : [art]
            );
          }
        });
      }
    };
    getArtPosts();
  }, [page, artPosts]);

  console.log(artPosts);

  return (
    <div className="flex flex-col w-full h-full gap-4 px-4 py-8 xl:px-12 lg:px-12">
      <div className="grid grid-cols-3 gap-2 xl:grid-cols-6 lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-3">
        {artPosts ? (
          artPosts.length > 0 ? (
            artPosts.map((post: Art, index: number) => {
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
            })
          ) : (
            <>
              <SkeletonBox className="w-full aspect-[2/3]" />
              <SkeletonBox className="w-full aspect-[2/3]" />
              <SkeletonBox className="w-full aspect-[2/3]" />
            </>
          )
        ) : (
          <div className="flex items-center justify-center w-full p-4 col-span-full h-fit">
            <h2 className="text-lg text-[--secondaryText] font-semibold">
              No art found
            </h2>
          </div>
        )}
      </div>
      {artPosts && artPosts.length >= 24 && (
        <div className="flex flex-col items-center">
          <button
            className="flex items-center justify-center w-1/3 h-12 text-[--primaryText] border-2 rounded-md border-[--primary] bg-[--secondary]"
            onClick={() => {
              setPage((prevPage) => {
                return prevPage + 1;
              });
            }}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default ArtPage;
