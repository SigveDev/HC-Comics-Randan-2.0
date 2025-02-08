import { useState, useEffect } from "react";
import { getCommentsByUserId, getPublicUser } from "../lib/Appwrite";
import { PublicProfile, Comments, CommentsRequest } from "@/assets/types";

import Comment from "./comment";
import { SkeletonBox } from "./skeleton";

const ProfileCommentsView = () => {
  const [publicUser, setPublicUser] = useState<PublicProfile>();
  const [comments, setComments] = useState<Comments[]>();

  useEffect(() => {
    const fetchPublicUser = async () => {
      const publicUser: PublicProfile =
        (await getPublicUser()) as PublicProfile;
      setPublicUser(publicUser);
    };
    fetchPublicUser();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      if (!publicUser) return;
      const comments: CommentsRequest = (await getCommentsByUserId(
        publicUser.$id
      )) as CommentsRequest;
      setComments(comments.documents);
    };
    fetchComments();
  }, [publicUser]);

  return (
    <div className="flex flex-col w-full col-span-1 gap-2 xl:col-span-3 lg:col-span-3 h-fit">
      <p className="flex items-center justify-start h-7 pl-2 font-semibold text-lg text-[--primaryText] bg-gradient-to-r from-[--primary] via-[--thirdly] via-55% to-transparent">
        Comments
      </p>
      <div className="flex flex-col w-full gap-3 h-fit">
        {comments ? (
          comments.length > 0 ? (
            comments.map((commentData: Comments) => {
              return (
                <Comment
                  commentData={commentData}
                  publicUserId={publicUser?.$id as string}
                  key={commentData.$id}
                />
              );
            })
          ) : (
            <>
              <SkeletonBox className="w-full h-52" />
            </>
          )
        ) : (
          <div className="flex items-center justify-center w-full p-4 col-span-full h-fit">
            <h2 className="text-lg text-[--secondaryText] font-semibold">
              No Comments
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCommentsView;
