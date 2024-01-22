import { useState, useEffect } from "react";
import { Title, TitleRequest } from "../../assets/types";
import { getTitles } from "../../lib/Appwrite";
import TitleViewH from "../titleViewH";

const Titles = () => {
    const [titles, setTitles] = useState<Title[]>();

    useEffect(() => {
        const fetchTitles = async () => {
            const titles: TitleRequest = await getTitles() as TitleRequest;
            setTitles(titles.documents);
        }
        fetchTitles();
    }, []);

    return (
        <div className='grid w-full h-full grid-cols-3 gap-12 pt-8 pb-8 pl-12 pr-12'>
            {titles && titles.map((title, index) => {
                return (
                    <TitleViewH key={index} title={title} />
                );
            })}
        </div>
    );
};

export default Titles;