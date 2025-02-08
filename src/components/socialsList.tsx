import { useState, useEffect } from "react";
import { Socials, SocialsRequest } from "../assets/types";
import { getSocials } from "../lib/Appwrite";
import SocialViewH from "./socialViewH";
import { SkeletonBox, SkeletonText } from "./skeleton";

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
      {socials.length > 0 ? (
        <p className="flex items-center justify-start h-7 pl-2 font-semibold text-[--primaryText] bg-gradient-to-r from-[--primary] via-[--thirdly] via-55% to-transparent">
          Socials
        </p>
      ) : (
        <SkeletonText className="w-full h-7" />
      )}
      <div className="flex flex-col w-full gap-1 h-fit">
        {socials.length > 0 ? (
          socials.map((social, index) => (
            <SocialViewH {...social} key={index} />
          ))
        ) : (
          <>
            <SkeletonBox className="w-full h-14" />
            <SkeletonBox className="w-full h-14" />
            <SkeletonBox className="w-full h-14" />
          </>
        )}
      </div>
    </div>
  );
};

export default SocialsList;
