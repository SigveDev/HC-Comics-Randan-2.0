import { useState, useEffect } from "react";
import { getSocialImage } from "../lib/Appwrite";
import { Socials } from "../assets/types";

const SocialViewH = (social: Socials) => {
  const [image, setImage] = useState<URL>();

  useEffect(() => {
    const fetchImage = async () => {
      const image: URL = (await getSocialImage(social.icon)) as URL;
      setImage(image);
    };
    fetchImage();
  }, []);

  return (
    <a
      href={social.link}
      className="flex flex-row items-center justify-start w-full gap-4 p-2 h-fit bg-[--secondary]"
    >
      {image && (
        <img className="w-10 h-10" src={image.href} alt={social.name} />
      )}
      <h2 className="text-lg font-bold text-[--primaryText]">{social.name}</h2>
    </a>
  );
};

export default SocialViewH;
