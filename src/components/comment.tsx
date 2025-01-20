import { useState, useEffect } from "react";
import { Comments } from "../assets/types";
import { getPublicUserPFP } from "../lib/Appwrite";
import { calculateHowLongAgo } from "../functions/CalculateHowLongAgo";

const Comment = ({
  commentData,
  publicUserId,
}: {
  commentData: Comments;
  publicUserId: string;
}) => {
  const [userPFP, setUserPFP] = useState<string>();
  const [newComment, setNewComment] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserPFP = async () => {
      if (commentData) {
        const userPFP: string = (await getPublicUserPFP(
          commentData.Owner.userId
        )) as string;
        setUserPFP(userPFP);
      }
    };
    fetchUserPFP();
  }, []);

  useEffect(() => {
    const newComment = commentData.comment.split("\n");
    setNewComment(newComment);
  }, [commentData]);

  return (
    <>
      {(commentData.Owner.public === true ||
        commentData.Owner.$id === publicUserId) && (
        <div className="flex flex-row w-full gap-4 h-fit">
          <img src={userPFP} alt="UserPfp" className="w-12 h-12 rounded-full" />
          <div className="flex flex-col grow h-fit">
            <div className="flex flex-row items-end justify-start gap-4">
              <p className="text-[--primaryText] font-semibold text-base">
                {commentData.Owner.username}
              </p>
              <p className="text-[--secondaryText] text-sm">
                Posted at {calculateHowLongAgo(commentData.$createdAt)}
              </p>
            </div>
            <p
              className="text-[--primaryText] text-sm h-fit text-ellipsis"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {newComment.length > 0 &&
                newComment.map((commentPart: string, index: number) => {
                  const isIframe = commentPart.startsWith("<iframe");
                  return (
                    <div key={index}>
                      {isIframe ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: commentPart }}
                        />
                      ) : (
                        <>
                          {commentPart}
                          <br />
                        </>
                      )}
                    </div>
                  );
                })}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Comment;
