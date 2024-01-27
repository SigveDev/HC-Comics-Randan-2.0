import { useState, useEffect } from 'react';
import { getArtImagePreview, getArtImage, giveArtView, likeArtToggle, shareArt } from '../lib/Appwrite';
import { Art } from '../assets/types';
import { calculateHowLongAgo } from '../functions/CalculateHowLongAgo';
import { Forward, Heart, HeartHandshake, MessageSquare, ExternalLink } from 'lucide-react';

const ArtViewH = ({ art, likedStatus, loggedIn, userId }: { art: Art, likedStatus: boolean, loggedIn: boolean, userId: string }) => {
    const [artImage, setArtImage] = useState<URL>();
    const [artImagePreview, setArtImagePreview] = useState<URL>();
    const [howLongAgo, setHowLongAgo] = useState<string>();
    const [modal, setModal] = useState<boolean>(false);
    const [liked, setLiked] = useState<boolean>(false);

    useEffect(() => {
        setLiked(likedStatus);
    }, [likedStatus]);
    
    useEffect(() => {
        const getArtImagePreviewFunc = async () => {
            const artImage: URL = await getArtImagePreview(art.image) as URL;
            setArtImagePreview(artImage);
        };
        getArtImagePreviewFunc();
    }, []);

    useEffect(() => {
        const getArtImageFunc = async () => {
            const artImage: URL = await getArtImage(art.image) as URL;
            setArtImage(artImage);
        };
        getArtImageFunc();
    }, [modal]);

    useEffect(() => {
        setHowLongAgo(calculateHowLongAgo(art.$createdAt));
    }, [art.$createdAt]);

    const handleLikeing = async () => {
        if (loggedIn && userId) {
            await likeArtToggle(art.$id, userId);
            setLiked(!liked);
        }
    }

    const handleShare = () => {
        if (art) {
            shareArt(art.$id);
            if (navigator.share) {
                const newUrl = window.location.pathname.split("/")[1]
                const plainUrl = window.location.href.replace(newUrl, '') + "a/" + art.$id;
                navigator.share({
                    title: art.title,
                    text: art.description,
                    url: plainUrl
                }).then(() => {
                    console.log('Thanks for sharing!');
                })
                .catch(console.error);
            } else {
                navigator.clipboard.writeText(window.location.href + "/c/" + art.$id);
            }
        }
    }

    const handleModal = async () => {
        setModal(!modal);
        if (!modal) {
            await giveArtView(art.$id);
        }
    };
    
    return (
        <div className='w-full h-fit'>
            <img src={artImagePreview?.href} alt="Art" className='w-full aspect-[2/3] cursor-pointer' onClick={handleModal} />

            {modal && <div className='fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center w-full h-full bg-black/40' onClick={handleModal}></div>}
            {modal &&
            <div className='fixed top-0 bottom-0 left-0 right-0 z-10 flex items-center justify-center w-full h-full pointer-events-none'>
                <div className='flex flex-row items-center justify-center gap-2 pointer-events-auto w-fit h-4/5'>
                    <img src={artImage?.href} alt="Art" className='h-full aspect-[2/3]' />
                    <div className='aspect-[2/3] h-full flex flex-col bg-[--secondary] p-2 relative'>
                        <h2 className='text-[--primaryText] font-bold text-lg mb-2'>{art.title}</h2>
                        <p className='text-[--primaryText] font-semibold text-md'>Description:</p>
                        <hr className='border-[--primaryText]' />
                        <p className='text-[--primaryText] font-medium text-sm grow w-full'>{art.description}</p>
                        <hr className='border-[--primaryText]' />
                        <p className='text-sm font-medium text-[--secondaryText]'>Posted {howLongAgo}</p>

                        <div className='absolute flex flex-row items-center justify-center gap-2 top-2 right-2'>
                            {loggedIn && (
                                liked ?
                                    <button type="button" className={`'flex items-center justify-center w-full font-semibold text-[--accentText] h-fit rounded p-1`} onClick={handleLikeing}><HeartHandshake /></button>
                                :
                                    <button type="button" className={`'flex items-center justify-center w-full font-semibold text-[--primaryText] h-fit rounded p-1`} onClick={handleLikeing}><Heart /></button>
                                )
                            }
                            {loggedIn && <button type="button" className='flex items-center justify-center w-full font-semibold text-[--primaryText] h-fit'><MessageSquare /></button>}
                            <button type="button" className='flex items-center justify-center w-full font-semibold text-[--primaryText] h-fit' onClick={handleShare}><Forward /></button>
                            <a href={"/a/" + art.$id} target="_blank" rel="noreferrer" className='flex items-center justify-center w-full font-semibold text-[--primaryText] h-fit ml-2'><ExternalLink /></a>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    );
};

export default ArtViewH;