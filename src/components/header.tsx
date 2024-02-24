import { useEffect, useState } from "react";
import { UserRound, Menu } from 'lucide-react';
import { account } from "../lib/Appwrite";
import Cookies from "js-cookie";

const Header = ({ user }: any) => {
    const [page, setPage] = useState<string>("");
    const [menuSataus, setMenuStatus] = useState<boolean>(false);
    const [smallMenu, setSmallMenu] = useState<boolean>(false);

    useEffect(() => {
        const { pathname } = window.location;
        const page: string = pathname.split('/').pop()?.toString() || "";
        setPage(page);
    }, []);
    
    const handleLogout = async () => {
        const logout = await account.deleteSession('current');
        if (logout) {
            Cookies.remove('token');
            localStorage.removeItem('pfp');
            localStorage.removeItem('autoLogin');
            window.location.reload();
        }
    };

    const toggleMenuState = () => {
        if (smallMenu === true) {
            setSmallMenu(false);
        }
        setMenuStatus(!menuSataus);
    };

    const toggleSmallMenu = () => {
        if (menuSataus === true) {
            setMenuStatus(false);
        }
        setSmallMenu(!smallMenu);
    };
    
    return (
        <>
            <header className={`relative z-50 flex flex-row items-center justify-center border-b-2 h-header lg:gap-32 md:gap-16 border-[--primary] bg-gradient-to-b from-[--fourthly] to-transparent`}>
                <button onClick={toggleSmallMenu} className="xl:hidden lg:hidden md:hidden sm:flex flex text-[--primaryText] absolute left-4 h-full w-fit justify-center items-center font-semibold"><Menu size="32" /></button>
                <a href="/" className={`xl:flex lg:flex md:flex sm:hidden hidden items-center justify-center h-full pl-6 pr-6 font-semibold text-[--primaryText] w-fit ${page === "" ? `bg-gradient-to-b from-[--primary] to-transparent` : `hover:bg-gradient-to-b hover:from-[--secondary] hover:to-transparent`}`}>Home</a>
                <a href="/titles" className={`xl:flex lg:flex md:flex sm:hidden hidden items-center justify-center h-full pl-6 pr-6 font-semibold text-[--primaryText] w-fit ${page === "titles" ? `bg-gradient-to-b from-[--primary] to-transparent` : `hover:bg-gradient-to-b hover:from-[--secondary] hover:to-transparent`}`}>Titles</a>
                <a href="/art" className={`xl:flex lg:flex md:flex sm:hidden hidden items-center justify-center h-full pl-6 pr-6 font-semibold text-[--primaryText] w-fit ${page === "art" ? `bg-gradient-to-b from-[--primary] to-transparent` : `hover:bg-gradient-to-b hover:from-[--secondary] hover:to-transparent`}`}>Art</a>
                <a href="/search" className={`xl:flex lg:flex md:flex sm:hidden hidden items-center justify-center h-full pl-6 pr-6 font-semibold text-[--primaryText] w-fit ${page === "search" ? `bg-gradient-to-b from-[--primary] to-transparent` : `hover:bg-gradient-to-b hover:from-[--secondary] hover:to-transparent`}`}>Search</a>
                <div className="absolute right-0 h-full w-fit">
                    {user && user !== "error" ?
                        <button className="flex items-center justify-center h-full px-6 font-semibold text-[--primaryText] w-fit" onClick={toggleMenuState}><UserRound /></button>
                    :
                        <a href="/login" className="flex items-center justify-center h-full pl-6 pr-6 font-semibold text-[--primaryText] w-fit"><UserRound /></a>
                    }
                </div>
            </header>
            {menuSataus === true && <button onClick={toggleMenuState} className={`lg:hidden xl-hidden z-[51] fixed right-0 h-header flex justify-center items-center px-6 text-[--primaryText]`}><UserRound /></button>}
            {menuSataus === true && <div className={`fixed xl:pb-0 lg:pb-0 pb-4 pt-14 xl:pt-0 lg:pt-0 right-0 z-50 flex flex-col xl:top-14 lg:top-14 top-0 w-fit h-fit bg-[--fourthly]`}>
                <a href="/profile" className={`flex items-center justify-end w-full h-full xl:py-4 lg:py-4 py-6 pl-10 xl:pr-10 lg:pr-10 pr-6 text-[--primaryText] hover:bg-[--secondary]`}>Profile</a>
                <button className={`flex items-center justify-end w-full h-full xl:py-4 lg:py-4 py-6 pl-10 xl:pr-10 lg:pr-10 pr-6 text-[--primaryText] hover:bg-[--secondary]`} onClick={handleLogout}>Logout</button>
            </div>}
            {menuSataus === true && <div className="fixed inset-0 z-40 w-full h-full bg-black/50" onClick={toggleMenuState}></div>}

            {smallMenu === true && <div className={`fixed top-0 left-0 z-50 flex flex-col w-2/3 h-full bg-[--fourthly]`}>
                <div className="flex items-center justify-start w-full h-header pl-4 text-[--primaryText]" onClick={toggleSmallMenu}><Menu size="32" /></div>
                <a href="/" className={`flex items-center justify-start w-full h-fit px-4 py-2 text-[--primaryText] ${page === "" ? `bg-gradient-to-r from-[--primary] via-[--thirdly] via-55% to-transparent` : `hover:bg-gradient-to-r hover:from-[--secondary] hover:to-transparent`}`}>Home</a>
                <a href="/titles" className={`flex items-center justify-start w-full h-fit px-4 py-2 text-[--primaryText] ${page === "titles" ? `bg-gradient-to-r from-[--primary] via-[--thirdly] via-55% to-transparent` : `hover:bg-gradient-to-r hover:from-[--secondary] hover:to-transparent`}`}>Titles</a>
                <a href="/art" className={`flex items-center justify-start w-full h-fit px-4 py-2 text-[--primaryText] ${page === "art" ? `bg-gradient-to-r from-[--primary] via-[--thirdly] via-55% to-transparent` : `hover:bg-gradient-to-r hover:from-[--secondary] hover:to-transparent`}`}>Art</a>
                <a href="/search" className={`flex items-center justify-start w-full h-fit px-4 py-2 text-[--primaryText] ${page === "search" ? `bg-gradient-to-r from-[--primary] via-[--thirdly] via-55% to-transparent` : `hover:bg-gradient-to-r hover:from-[--secondary] hover:to-transparent`}`}>Search</a>
            </div>}
            {smallMenu === true && <div className="fixed inset-0 z-40 w-full h-full bg-black/50" onClick={toggleSmallMenu}></div>}
        </>
    );
};

export default Header;