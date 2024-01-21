import { useEffect, useState } from "react";
import { UserRound } from 'lucide-react';
import { account } from "../lib/Appwrite";
import Cookies from "js-cookie";

const Header = ({ user }: any) => {
    const [page, setPage] = useState<string>("");
    const [menuSataus, setMenuStatus] = useState<boolean>(false);

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
        setMenuStatus(!menuSataus);
    };
    
    return (
        <>
            <header className={`relative z-50 flex flex-row items-center justify-center border-b-2 h-14 gap-32 border-[--primary] bg-gradient-to-b from-[--fourthly] to-transparent`}>
                <a href="/" className={`flex items-center justify-center h-full pl-6 pr-6 font-semibold text-[--primaryText] w-fit ${page === "" ? `bg-gradient-to-b from-[--primary] to-transparent` : `hover:bg-gradient-to-b hover:from-[--secondary] hover:to-transparent`}`}>Home</a>
                <a href="/titles" className={`flex items-center justify-center h-full pl-6 pr-6 font-semibold text-[--primaryText] w-fit ${page === "titles" ? `bg-gradient-to-b from-[--primary] to-transparent` : `hover:bg-gradient-to-b hover:from-[--secondary] hover:to-transparent`}`}>Titles</a>
                <a href="/art" className={`flex items-center justify-center h-full pl-6 pr-6 font-semibold text-[--primaryText] w-fit ${page === "art" ? `bg-gradient-to-b from-[--primary] to-transparent` : `hover:bg-gradient-to-b hover:from-[--secondary] hover:to-transparent`}`}>Art</a>
                <a href="/search" className={`flex items-center justify-center h-full pl-6 pr-6 font-semibold text-[--primaryText] w-fit ${page === "search" ? `bg-gradient-to-b from-[--primary] to-transparent` : `hover:bg-gradient-to-b hover:from-[--secondary] hover:to-transparent`}`}>Search</a>
                <div className="absolute right-0 h-full w-fit">
                    {user && user !== "error" ?
                        <button className="flex items-center justify-center h-full pl-6 pr-6 font-semibold text-[--primaryText] w-fit" onClick={toggleMenuState}><UserRound /></button>
                    :
                        <a href="/login" className="flex items-center justify-center h-full pl-6 pr-6 font-semibold text-[--primaryText] w-fit"><UserRound /></a>
                    }
                </div>
            </header>
            {menuSataus === true && <div className={`fixed right-0 z-50 flex flex-col top-14 w-fit h-fit bg-[--fourthly]`}>
                <a href="/profile" className={`flex items-center justify-center w-full h-full p-4 pl-10 pr-10 text-[--primaryText] hover:bg-[--secondary]`}>Profile</a>
                <button className={`flex items-center justify-center w-full h-full p-4 pl-10 pr-10 text-[--primaryText] hover:bg-[--secondary]`} onClick={handleLogout}>Logout</button>
            </div>}
            {menuSataus === true && <div className="fixed inset-0 z-10 w-full h-full bg-black/25" onClick={toggleMenuState}></div>}
        </>
    );
};

export default Header;