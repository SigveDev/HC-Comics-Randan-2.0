import { calculateHowLongAgo } from '../functions/CalculateHowLongAgo';
import { Chapter } from '../assets/types';
import { getThumbnail } from '../lib/Appwrite';
import { useEffect, useState } from 'react';

const LatestRelease = (chapter: Chapter) => {
    const [thumbnail, setThumbnail] = useState<URL>();
    const [formatedNumber, setFormatedNumber] = useState<string>();
    const [howLongAgo, setHowLongAgo] = useState<string>();

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

    return (
        <div className='w-full aspect-[4/7] flex flex-col gap-2'>
            <p className='flex items-center justify-start h-7 pl-2 font-semibold text-[--primaryText] bg-gradient-to-r from-[--primary] via-[--thirdly] via-55% to-transparent'>Latest release</p>
            <a href={"/c/" + chapter.$id} className='flex flex-col h-full gap-2'>
                <div className='relative w-full h-fit'>
                    {thumbnail && <img className='w-full aspect-[2/3]' src={thumbnail.href} alt={chapter.title} />}
                    <h3 className='absolute bottom-0 left-0 flex items-end justify-start w-full h-20 pb-4 pl-2 font-semibold text-[--primaryText] bg-gradient-to-t from-black to-transparent'>{chapter.title}</h3>
                </div>
                <hr className='w-full' />
                <div className='flex flex-row items-center justify-between w-full h-fit'>
                    <p className='text-lg font-bold text-[--primaryText]'>#{formatedNumber}</p>
                    <p className='text-sm font-medium text-[--secondaryText]'>Posted {howLongAgo}</p>
                </div>
            </a>
        </div>
    );
};

export default LatestRelease;