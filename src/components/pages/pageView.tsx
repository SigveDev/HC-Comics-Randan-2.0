import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getChapterByID, getPage } from '../../lib/Appwrite';
import { useSwipeable } from 'react-swipeable';

const PageView = () => {
    const chapterID = window.location.pathname.split('/')[2];
    const page = window.location.pathname.split('/')[3];
    const [pageURL, setPageURL] = useState<URL>();
    const [maxPage, setMaxPage] = useState<number>();

    useEffect(() => {
        const fetchURL = async () => {
            const chapter: any = await getChapterByID(chapterID) as any;
            const pageID: string = chapter.pages[Number(page) - 1];
            const pageURL: URL = await getPage(pageID) as URL;
            setPageURL(pageURL);
            setMaxPage(chapter.pages.length);
        }
        fetchURL();
    }, [chapterID]);

    const handleNextPage = () => {
        window.location.href = `/p/${chapterID}/${Number(page) + 1}`;
    }

    const handlePreviousPage = () => {
        window.location.href = `/p/${chapterID}/${Number(page) - 1}`;
    }

    const handleSwipable = useSwipeable({
        onSwipedLeft: () => {
            console.log(Number(page), maxPage);
            if (Number(page) !== maxPage) {
                handleNextPage();
            }
        },
        onSwipedRight: () => {
            if (Number(page) !== 1) {
                handlePreviousPage();
            }
        },
        onSwipedDown: () => {
            window.location.href = `/c/${chapterID}`;
        }
    });

    return (
        <div className='relative flex items-center justify-center w-full h-fullpage'>
            {pageURL && 
                <img {...handleSwipable} className='aspect-[2/3] xl:h-full lg:h-full md:h-full sm:h-fit xl:w-fit lg:w-fit md:w-fit sm:w-full z-10' src={pageURL.href} alt={pageURL.href} />
            }
            {Number(page) !== 1 && <button className='flex justify-start items-center absolute top-0 left-0 w-1/2 h-full text-[--primaryText] hover:text-[--accentText]' onClick={handlePreviousPage}><ChevronLeft className='w-8 h-8' /></button>}
            {Number(page) !== maxPage && <button className='flex justify-end items-center absolute top-0 right-0 w-1/2 h-full text-[--primaryText] hover:text-[--accentText]' onClick={handleNextPage}><ChevronRight className='w-8 h-8' /></button>}
        </div>
    );
};

export default PageView;