import { useState, useEffect } from 'react';
import { getLiked } from '../lib/Appwrite';
import { Chapter, Likes, LikesRequest, User } from '../assets/types';

import ChapterViewH from './chapterViewH';

const LikedView = (user: User) => {
    const [liked, setLiked] = useState<Chapter[]>();
    
    useEffect(() => {
        const fetchLiked = async () => {
            const liked: LikesRequest = await getLiked(user.$id) as LikesRequest;
            const likedChapters = liked.documents[0].Chapters as Chapter[];
            setLiked(likedChapters);
        }
        fetchLiked();
    }, []);

    return (
        <div className='flex flex-col w-full col-span-1 gap-2 xl:col-span-3 lg:col-span-3 h-fit'>
            <p className='flex items-center justify-start h-7 pl-2 font-semibold text-lg text-[--primaryText] bg-gradient-to-r from-[--primary] via-[--thirdly] via-55% to-transparent'>Liked</p>
            <div className="flex flex-col w-full gap-2 h-fit">
                {liked && liked.map((chapter: Chapter) => {
                    return <ChapterViewH chapter={chapter} likedStatus={true} loggedIn={true} userId={user.$id as string} key={chapter.$id} />
                })}
            </div>
        </div>
    );
}

export default LikedView;