import { useState, useEffect } from "react";
import { Socials, SocialsRequest } from "../assets/types";
import { getSocials } from "../lib/Appwrite";
import SocialViewH from "./socialViewH";

const SocialsList = () => {
  const [socials, setSocials] = useState<Socials[]>([]);

  useEffect(() => {
    const fetchSocials = async () => {
      const socials: SocialsRequest = (await getSocials()) as SocialsRequest;
      setSocials(socials.documents);
    };
    fetchSocials();
  }, []);

  return (
    <div className="flex flex-col w-full gap-2 h-fit">
      <p className="flex items-center justify-start h-7 pl-2 font-semibold text-[--primaryText] bg-gradient-to-r from-[--primary] via-[--thirdly] via-55% to-transparent">
        Socials
      </p>
      <div className="flex flex-col w-full gap-1 h-fit">
        {socials.map((social, index) => (
          <SocialViewH {...social} key={index} />
        ))}
      </div>
    </div>
  );
};

export default SocialsList;
