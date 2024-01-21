import { useState, useEffect } from "react";
import { getPage } from "../lib/Appwrite";

const MiniPageView = ({ pageId }: { pageId: string }) => {
    const [page, setPage] = useState<URL>();

    useEffect(() => {
        const fetchPage = async () => {
            const page: URL = await getPage(pageId) as URL;
            setPage(page);
        }
        fetchPage();
    }, []);

    return (
        <div className='w-full h-fit'>
            {page && <img className='w-full aspect-[2/3]' src={page.href} alt={pageId} />}
        </div>
    );
};

export default MiniPageView;