import { useState, useEffect } from "react";
import { Chapter, LikesRequest } from "../../assets/types";
import { checkUserData, getChapterByID, getThumbnail, getLikedChapters, likeChapterToggle, shareChapter } from "../../lib/Appwrite";
import { calculateHowLongAgo } from "../../functions/CalculateHowLongAgo";
import { Heart, HeartHandshake, MessageSquare, Forward } from 'lucide-react';
import MiniPageView from "../miniPageView";

const ChapterView = () => {
    const chapterID = window.location.pathname.split('/')[2];
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>();
    const [chapter, setChapter] = useState<Chapter>();
    const [thumbnail, setThumbnail] = useState<URL>();
    const [formatedNumber, setFormatedNumber] = useState<string>();
    const [howLongAgo, setHowLongAgo] = useState<string>();
    const [liked, setLiked] = useState<boolean>(false);

    useEffect(() => {
        const user = checkUserData();
        user.then((user: any) => {
            setLoggedIn(true);
            setUserId(user.$id);
        }).catch(() => {
            setLoggedIn(false);
        });
    }, []);

    useEffect(() => {
        const fetchChapter = async () => {
            const chapter: Chapter = await getChapterByID(chapterID) as Chapter;
            setChapter(chapter);
        }
        fetchChapter();
    }, [chapterID]);

    useEffect(() => {
        const fetchThumbnail = async () => {
            if (chapter) {
                const thumbnail: URL = await getThumbnail(chapter.thumbnail) as URL;
                setThumbnail(thumbnail);
            }
        }
        fetchThumbnail();
    }, [chapter]);

    useEffect(() => {
        const formatedNumber = chapter?.number.toString().padStart(3, '0');
        setFormatedNumber(formatedNumber);
    }, [chapter]);

    useEffect(() => {
        if (chapter) {
            setHowLongAgo(calculateHowLongAgo(chapter.$createdAt));
        }
    }, [chapter]);

    useEffect(() => {
        const fetchLikedChapters = async () => {
            if (userId) {
                const likedChapters: LikesRequest = await getLikedChapters(userId) as LikesRequest;
                const likedStatus = likedChapters.documents[0].Chapters.find((likedChapter: Chapter) => likedChapter.$id === chapterID) ? true : false;
                setLiked(likedStatus);
            }
        }
        fetchLikedChapters();
    }, [chapterID, userId]);

    const handleLikeing = async () => {
        if (chapter && userId) {
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
                    url: window.location.href
                }).then(() => {
                    console.log('Thanks for sharing!');
                })
                .catch(console.error);
            } else {
                navigator.clipboard.writeText(window.location.href);
            }
        }
    }

    return (
        <div className='flex flex-col w-full h-fit'>
            <div className="flex flex-col max-w-[1000px] w-full h-fit ml-auto mr-auto mt-12 gap-12">
                <div className="flex flex-row gap-4 h-fit">
                    <div className='flex flex-col h-full gap-2'>
                        <div className='relative h-full w-fit'>
                            {thumbnail && <img className='w-80 aspect-[2/3]' src={thumbnail.href} alt={chapter?.title} />}
                            <h3 className='absolute bottom-0 left-0 flex items-end justify-start w-full h-20 pb-4 pl-2 font-semibold text-[--primaryText] bg-gradient-to-t from-black to-transparent'>{chapter?.title}</h3>
                        </div>
                        <hr className='w-full' />
                        <div className='flex flex-row items-center justify-between w-full h-fit'>
                            <p className='text-lg font-bold text-[--primaryText]'>#{formatedNumber}</p>
                            <p className='text-sm font-medium text-[--secondaryText]'>Posted {howLongAgo}</p>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2 grow bg-[--secondary]'>
                        <div className="flex flex-row w-full h-fit">
                            <div className='flex flex-col w-full h-full m-4'>
                                <h2 className='text-2xl font-bold text-[--primaryText]'>{chapter?.title}</h2>
                                <h3 className='mb-2 text-lg font-medium text-[--primaryText]'>#{formatedNumber}</h3>
                                <p className='text-sm font-medium text-[--primaryText] text-ellipsis'>{chapter?.subtitle}</p>
                                <p className='mt-2 text-sm font-medium text-[--secondaryText]'>Posted {howLongAgo}</p>
                            </div>
                            <div className='flex flex-col items-center justify-between h-10 gap-4 mt-4 mr-4 w-fit'>
                                {loggedIn && (
                                    liked ?
                                        <button type="button" className={`'flex items-center justify-center w-full font-semibold text-[--accentText] h-fit rounded p-1`} onClick={handleLikeing}><HeartHandshake /></button>
                                    :
                                        <button type="button" className={`'flex items-center justify-center w-full font-semibold text-[--primaryText] h-fit rounded p-1`} onClick={handleLikeing}><Heart /></button>
                                    )
                                }
                                {loggedIn && <button type="button" className='flex items-center justify-center w-full font-semibold text-[--primaryText] h-fit'><MessageSquare /></button>}
                                <button type="button" className='flex items-center justify-center w-full font-semibold text-[--primaryText] h-fit' onClick={handleShare}><Forward /></button>
                            </div>
                        </div>
                        <p className='flex flex-col w-full ml-4 text-[--primaryText] h-fit'>Descripton:</p>
                        <hr className='w-auto mt-2 mb-1 ml-4 mr-4' />
                        <p className="w-full h-full mb-4 ml-4 mr-4 text-[--primaryText]">{chapter?.description}</p>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center w-full gap-1 mb-12">
                    <h3 className="text-lg font-bold text-[--primaryText]">Pages</h3>
                    <div className="grid w-full grid-cols-4 gap-2 p-2 bg-[--secondary]">
                        {chapter?.pages.map((page: string, index: number) => {
                            return (
                                <MiniPageView pageId={page} index={index} key={index} />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChapterView;