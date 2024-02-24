import { useState, useEffect } from 'react';
import { getArtImagePreview, getArtImage, giveArtView, likeArtToggle, shareArt, removeArtView } from '../lib/Appwrite';
import { Art } from '../assets/types';
import { calculateHowLongAgo } from '../functions/CalculateHowLongAgo';
import { Forward, Heart, HeartHandshake, MessageSquare, ExternalLink } from 'lucide-react';
import { Drawer } from 'vaul';
import CommentViewH from './commentViewH';

const ArtViewH = ({ art, likedStatus, loggedIn, userId }: { art: Art, likedStatus: boolean, loggedIn: boolean, userId: string }) => {
    const [artImage, setArtImage] = useState<URL>();
    const [artImagePreview, setArtImagePreview] = useState<URL>();
    const [howLongAgo, setHowLongAgo] = useState<string>();
    const [modal, setModal] = useState<boolean>(false);
    const [liked, setLiked] = useState<boolean>(false);

    const [snap, setSnap] = useState<number | string | null>(0.6);

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
            setLiked(!liked);
            await likeArtToggle(art.$id, userId);
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

    const removeView = () => {
        removeArtView(art.$id);
    }
    
    return (
        <Drawer.Root
            shouldScaleBackground
            snapPoints={[0.6, 1]}
            activeSnapPoint={snap}
            setActiveSnapPoint={(e) => {
                if (e !== undefined) {
                    setSnap(e);
                } else {
                    setSnap(0.6);
                }
            }}
        >
            <div className='w-full h-fit'>
                <img src={artImagePreview?.href} alt="Art" className='w-full aspect-[2/3] cursor-pointer' onClick={handleModal} />

                {modal && <div className='fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center w-full h-full bg-black/50' onClick={handleModal}></div>}
                {modal &&
                <div className='fixed top-0 bottom-0 left-0 right-0 z-10 flex items-center justify-center w-full h-full pointer-events-none'>
                    <div className='flex flex-col items-center justify-start gap-2 overflow-y-auto pointer-events-auto lg:overflow-visible xl:overflow-visible xl:flex-row lg:flex-row w-fit h-4/5'>
                        <img src={artImage?.href} alt="Art" className='xl:h-full lg:h-full h-fit md:w-2/3 sm:w-4/5 w-4/5 aspect-[2/3]' />
                        <div className='xl:aspect-[2/3] lg:aspect-[2/3] aspect-[4/2] xl:h-full lg:h-full h-fit md:w-2/3 sm:w-4/5 w-4/5 flex flex-col bg-[--secondary] p-2 relative'>
                            <h2 className='text-[--primaryText] font-bold text-lg mb-2'>{art.title}</h2>
                            <p className='text-[--primaryText] font-semibold text-md'>Description:</p>
                            <hr className='border-[--primaryText]' />
                            <p className='text-[--primaryText] font-medium text-sm grow w-full'>{art.description}</p>
                            <hr className='border-[--primaryText] xl:block lg:block hidden' />
                            <p className='text-sm font-medium text-[--secondaryText]'>Posted {howLongAgo}</p>

                            <div className='absolute top-auto flex flex-row items-center justify-center gap-2 xl:top-2 lg:top-2 xl:right-2 xl:bottom-auto lg:bottom-auto right-2 bottom-2'>
                                {loggedIn && (
                                    liked ?
                                        <button type="button" className={`'flex items-center justify-center w-full font-semibold text-[--accentText] h-fit rounded p-1`} onClick={handleLikeing}><HeartHandshake /></button>
                                    :
                                        <button type="button" className={`'flex items-center justify-center w-full font-semibold text-[--primaryText] h-fit rounded p-1`} onClick={handleLikeing}><Heart /></button>
                                    )
                                }
                                {loggedIn && <Drawer.Trigger type="button" className='flex items-center justify-center w-full font-semibold text-[--primaryText] h-fit'><MessageSquare /></Drawer.Trigger>}
                                <button type="button" className='flex items-center justify-center w-full font-semibold text-[--primaryText] h-fit' onClick={handleShare}><Forward /></button>
                                <a href={"/a/" + art.$id} target="_blank" rel="noreferrer" className='flex items-center justify-center w-full font-semibold text-[--primaryText] h-fit ml-2' onClick={removeView}><ExternalLink /></a>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
            <Drawer.Portal>
                <Drawer.Overlay className='fixed inset-0 z-40 bg-black/50' />
                    <Drawer.Content className='bg-[--background] border-2 z-50 border-[--primary] flex flex-col items-center rounded-t-[10px] max-h-[80%] fixed bottom-0 left-0 right-0'>
                        <div className="max-w-[1000px] w-full flex flex-col overflow-auto p-4 rounded-t-[10px]">
                            <div className="mx-auto w-16 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-4" />
                            <div className="w-full">
                                <CommentViewH id={art.$id} loggedIn={loggedIn} chapterOrNot={false} />
                            </div>
                        </div>
                    </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
};

export default ArtViewH;