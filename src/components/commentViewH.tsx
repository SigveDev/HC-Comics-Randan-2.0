import { useState, useEffect, useRef } from 'react';
import { getUserPFP, postComment, getCommentsByChapterId, getCommentsByArtId, getPublicUser } from '../lib/Appwrite';
import { Comments, CommentsRequest, PublicProfile } from '../assets/types';
import useAutosizeTextArea from '../functions/useAutosizeTextArea';
import Comment from './comment';
import { SendHorizonal } from 'lucide-react';

const CommentViewH = ({ id, loggedIn, chapterOrNot }: { id: string, loggedIn: boolean, chapterOrNot: boolean }) => {
    const [publicUserId, setPublicUserId] = useState<string>();
    const [commentList, setCommentList] = useState<Comments[]>([]);
    const [userPFP, setUserPFP] = useState<string>();
    const [comment, setComment] = useState<string>("");
    const commentRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const fetchComments = async () => {
            if (chapterOrNot) {
                const comments: CommentsRequest = await getCommentsByChapterId(id) as CommentsRequest;
                setCommentList(comments.documents);
            } else {
                const comments: CommentsRequest = await getCommentsByArtId(id) as CommentsRequest;
                setCommentList(comments.documents);
            }
        }
        fetchComments();
    }, [id]);

    useEffect(() => {
        const fetchPublicUser = async () => {
            const publicUser: PublicProfile = await getPublicUser() as PublicProfile;
            setPublicUserId(publicUser.$id);
        }
        fetchPublicUser();
    }, []);

    useEffect(() => {
        const fetchUserPFP = async () => {
            const userPFP: string = await getUserPFP() as string;
            setUserPFP(userPFP);
        }
        fetchUserPFP();
    }, []);

    const handlePost = async () => {
        if (comment.length > 0) {
            if (chapterOrNot) {
                await postComment(id, comment, true);
            } else {
                await postComment(id, comment, false);
            }
            window.location.reload();
        }
    }

    useAutosizeTextArea(commentRef.current, comment);

    const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = evt.target?.value;
        setComment(val);
    };

    return (
        <div className="flex flex-col w-full gap-2 h-fit">
            <h3 className='text-[--primaryText] font-semibold text-xl'>Comments:</h3>
            {loggedIn && <div className='flex flex-row w-full gap-4 mb-4 h-fit'>
                <img src={userPFP} alt="UserPfp" className='rounded-full w-14 h-14' />
                <div className='grow h-fit'>
                    <textarea className='w-full p-2 bg-[--background] border-b-2 border-[--primary] caret-[--primaryText] text-[--primaryText] outline-none resize-none overflow-hidden'
                        placeholder='Comment something...'
                        onChange={handleChange}
                        ref={commentRef}
                        rows={1}
                        value={comment}
                        maxLength={512}
                    />
                    <div className='flex flex-row items-center justify-end w-full'>
                        <button type="button" className='flex items-center justify-center w-8 h-8 font-semibold text-[--primaryText] rounded' onClick={handlePost}><SendHorizonal /></button>
                    </div>
                </div>
            </div>}
            <div className='flex flex-col w-full gap-3 h-fit'>
                {commentList.length > 0 && commentList.map((commentData: Comments) => {
                    return <Comment commentData={commentData} publicUserId={publicUserId as string} key={commentData.$id} />
                })}
            </div>
        </div>
    );
}

export default CommentViewH;