import { useState, useEffect } from "react";
import { Chapter, Following, FollowingRequest, LikesRequest, Title } from "../../assets/types";
import { checkUserData, getFollowing, getLiked, getTitleByID, followTitleToggle } from "../../lib/Appwrite";
import ChapterViewH from "../chapterViewH";
import { Plus, Check } from 'lucide-react';

const TitleView = () => {
    const titleId = window.location.pathname.split("/")[2];
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>();
    const [followStatus, setFollowStatus] = useState<boolean>();
    const [likedChapters, setLikedChapters] = useState<Chapter[]>([]);
    const [title, setTitle] = useState<Title>();

    useEffect(() => {
        const fetchLoggedInUserInfo = async () => {
            const user = await checkUserData();
            if (user) {
                setLoggedIn(true);
                setUserId(user.$id as string);
            } else {
                setLoggedIn(false);
            }
            const likedArt: LikesRequest = await getLiked(user.$id) as LikesRequest;
            setLikedChapters(likedArt.documents[0].Chapters as Chapter[]);

            const followersList: FollowingRequest = await getFollowing(user.$id) as FollowingRequest;
            if (followersList.documents[0].Titles.find((title: Title) => title.$id === titleId)) {
                setFollowStatus(true);
            } else {
                setFollowStatus(false);
            }
        }
        fetchLoggedInUserInfo();
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
            const likedChapters: LikesRequest = await getLiked(user.$id) as LikesRequest;
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

    const toggleFollowing = async () => {
        if (followStatus) {
            setFollowStatus(false);
        } else {
            setFollowStatus(true);
        }
        followTitleToggle(titleId, userId as string);
    }

    return (
        <div className='flex flex-col w-full h-full gap-4 px-4 py-8 xl:px-12 lg:px-12'>
            <h1 className='flex items-center justify-between h-7 pl-2 font-semibold text-[--primaryText] bg-gradient-to-r from-[--primary] via-[--thirdly] via-55% to-transparent mb-1'>
                {title?.name}
                {loggedIn && (
                    followStatus ?
                    <button className="text-1xl font-semibold text-[--primaryText] flex flex-row gap-1 items-center" onClick={toggleFollowing}>Following <Check /></button>
                    :
                    <button className="text-1xl font-semibold text-[--primaryText] flex flex-row gap-1 items-center" onClick={toggleFollowing}>Follow Title <Plus /></button>
                )}
            </h1>
            <div className="grid w-full grid-cols-1 gap-2 xl:grid-cols-2 lg:grid-cols-2 h-fit">
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