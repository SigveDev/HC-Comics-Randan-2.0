import { useState, useEffect } from "react";
import { Chapter, LikesRequest, Title } from "../../assets/types";
import { checkUserData, getLikedChapters, getTitleByID } from "../../lib/Appwrite";
import ChapterViewH from "../chapterViewH";

const TitleView = () => {
    const titleId = window.location.pathname.split("/")[2];
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>();
    const [likedChapters, setLikedChapters] = useState<Chapter[]>([]);
    const [title, setTitle] = useState<Title>();

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
        const fetchLikedChapters = async () => {
            const user = await checkUserData();
            if (user) {
                setLoggedIn(true);
                setUserId(user.$id as string);
            } else {
                setLoggedIn(false);
            }
            const likedChapters: LikesRequest = await getLikedChapters(user.$id) as LikesRequest;
            setLikedChapters(likedChapters.documents[0].Chapters as Chapter[]);
        }
        fetchLikedChapters();
    }, []);

    useEffect(() => {
        const fetchTitle = async () => {
            const title: Title = await getTitleByID(titleId) as Title;
            setTitle(title);
        }
        fetchTitle();
    }, [titleId]);

    return (
        <div className='flex flex-col w-full h-full gap-4 pt-8 pb-8 pl-12 pr-12'>
            <h1 className='flex items-center justify-start h-7 pl-2 font-semibold text-[--primaryText] bg-gradient-to-r from-[--primary] via-[--thirdly] via-55% to-transparent mb-1'>{title?.name}</h1>
            <div className="grid w-full grid-cols-2 gap-2 h-fit">
                {title?.Chapters.map((chapter, index) => {
                    const likedStatus = likedChapters.find((likedChapter: Chapter) => likedChapter.$id === chapter.$id) ? true : false;
                    return (
                        <ChapterViewH chapter={chapter} likedStatus={likedStatus} loggedIn={loggedIn} userId={userId as string} key={index} />
                    );
                })}
            </div>
        </div>
    );
};

export default TitleView;