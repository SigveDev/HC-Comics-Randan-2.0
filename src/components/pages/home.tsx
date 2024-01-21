import { useEffect, useState } from "react";
import LatestRelease from "../latestRelease";
import ChaptersList from "../chaptersList";
import SocialsList from "../socialsList";
import { Chapter, ChapterRequest } from "../../assets/types";
import { getChapters } from "../../lib/Appwrite";

const Home = () => {
    const [chapters, setChapters] = useState<Chapter[]>([]);

    useEffect(() => {
        const fetchChapters = async () => {
            const chapters: ChapterRequest = await getChapters(true) as ChapterRequest;
            setChapters(chapters.documents);
        }
        fetchChapters();
    }, []);

    return (
        <div className="grid w-full gap-8 pt-8 pb-8 pl-12 pr-12 grow lg:grid-cols-8 md:grid-cols-6">
            <div className="w-full col-span-2 h-fit">
                {chapters.length > 0 && <LatestRelease {...chapters[0]} />}
            </div>
            <div className="w-full col-span-4 h-fit">
                {chapters.length > 0 && <ChaptersList chapters={chapters.slice(1)} />}
            </div>
            <div className="w-full col-span-2 h-fit">
                <SocialsList />
            </div>
        </div>
    );
};

export default Home;