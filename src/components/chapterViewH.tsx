import { useState, useEffect } from 'react';
import { Chapter } from '../assets/types';
import { getThumbnail, likeChapterToggle, shareChapter } from '../lib/Appwrite';
import { calculateHowLongAgo } from '../functions/CalculateHowLongAgo';
import { Heart, MessageSquare, Forward } from 'lucide-react';

const ChapterViewH = ({chapter, likedStatus, loggedIn, userId }: { chapter: Chapter, likedStatus: boolean, loggedIn: boolean, userId: string }) => {
    const [thumbnail, setThumbnail] = useState<URL>();
    const [formatedNumber, setFormatedNumber] = useState<string>();
    const [howLongAgo, setHowLongAgo] = useState<string>();
    const [liked, setLiked] = useState<boolean>(false);

    useEffect(() => {
        setLiked(likedStatus);
    }, [likedStatus]);

    useEffect(() => {
        const fetchThumbnail = async () => {
            const thumbnail: URL = await getThumbnail(chapter.thumbnail) as URL;
            setThumbnail(thumbnail);
        }
        fetchThumbnail();
    }, [chapter.thumbnail]);

    useEffect(() => {
        const formatedNumber = chapter.number.toString().padStart(3, '0');
        setFormatedNumber(formatedNumber);
    }, [chapter.number]);

    useEffect(() => {
        setHowLongAgo(calculateHowLongAgo(chapter.$createdAt));
    }, [chapter.$createdAt]);

    const handleLikeing = async () => {
        if (loggedIn && userId) {
            await likeChapterToggle(chapter.$id, userId);
            setLiked(!liked);
        }
    }

    const handleShare = () => {
        if (chapter) {
            shareChapter(chapter.$id);
            if (navigator.share) {
                navigator.share({
                    title: chapter.title,
                    text: chapter.description,
                    url: window.location.href + "/v/" + chapter.$id
                }).then(() => {
                    console.log('Thanks for sharing!');
                })
                .catch(console.error);
            } else {
                navigator.clipboard.writeText(window.location.href + "/v/" + chapter.$id);
            }
        }
    }

    return (
        <div className='flex flex-row w-full gap-2 h-52 bg-[--secondary]'>
            <a href={"/v/" + chapter.$id} className='flex flex-row w-full h-full gap-2'>
                {thumbnail && <img className='h-full aspect-[2/3]' src={thumbnail.href} alt={chapter.title} />}
                <div className='flex flex-col w-full h-full grow'>
                    <h2 className='text-lg font-bold text-[--primaryText]'>{chapter.title}</h2>
                    <h3 className='mb-2 text-sm font-medium text-[--primaryText]'>#{formatedNumber}</h3>
                    <p className='text-sm text-[--primaryText] text-ellipsis'>{chapter.description}</p>
                    <p className='mt-2 text-sm font-medium text-[--secondaryText]'>Posted {howLongAgo}</p>
                </div>
            </a>
            <div className='flex flex-col gap-3 mt-3 mr-3 h-fit w-fit'>
                {loggedIn && <button type="button" className={`'flex items-center justify-center w-full font-semibold text-[--primaryText] h-fit rounded p-1 ${liked && "bg-[--primary]"}`} onClick={handleLikeing}><Heart /></button>}
                {loggedIn && <button type="button" className='flex items-center justify-center w-full font-semibold text-[--primaryText] h-fit'><MessageSquare /></button>}
                <button type="button" className='flex items-center justify-center w-full font-semibold text-[--primaryText] h-fit' onClick={handleShare}><Forward /></button>
            </div>
        </div>
    );
}

export default ChapterViewH;