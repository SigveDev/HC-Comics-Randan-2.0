export type Chapter = {
    $id: string;
    $createdAt: Date;
    $updatedAt: Date;
    title: string;
    description: string;
    pages: string[];
    thumbnail: string;
    Author: Author;
    Titles: Title;
    ColorPalette: ColorPalette;
    number: number;
    subtitle: string;
    ChapterStats: ChapterStats;
};
export type ChapterRequest = {
    documents: Chapter[];
    total: number;
};

export type ChapterStats = {
    $id: string;
    Chapter: Chapter;
    Views: number;
    Likes: number;
    Shares: number;
};
export type ChapterStatsRequest = {
    documents: ChapterStats[];
    total: number;
};

export type Author = {
    $id: string;
    $createdAt: Date;
    $updatedAt: Date;
    userId: string;
    name: string;
    pfp: string;
    Chapters: Chapter[];
    Titles: Title[];
    Followers: number;
    Art: Art[];
};
export type AuthorRequest = {
    documents: Author[];
    total: number;
};

export type Title = {
    $id: string;
    $createdAt: Date;
    $updatedAt: Date;
    name: string;
    description: string;
    Author: Author;
    Chapters: Chapter[];
    Followers: number;
    thumbnail: string;
};
export type TitleRequest = {
    documents: Title[];
    total: number;
};

export type ColorPalette = {
    $id: string;
    $createdAt: Date;
    $updatedAt: Date;
    name: string;
    primary: string;
    secondary: string;
    thirdly: string;
    fourthly: string;
    primaryText: string;
    secondaryText: string;
    accentText: string;
    background: string;
};
export type ColorPaletteRequest = {
    documents: ColorPalette[];
    total: number;
};

export type Socials = {
    $id: string;
    name: string;
    link: string;
    icon: string;
};

export type SocialsRequest = {
    documents: Socials[];
    total: number;
};

export type Likes = {
    $id: string;
    userId: string;
    Chapters: Chapter[];
    Art: Art[];
};

export type LikesRequest = {
    documents: Likes[];
    total: number;
};

export type Art = {
    $id: string;
    $createdAt: Date;
    $updatedAt: Date;
    title: string;
    description: string;
    image: string;
    Author: Author;
};

export type ArtRequest = {
    documents: Art[];
    total: number;
};

export type ArtStats = {
    $id: string;
    Art: Art;
    Views: number;
    Likes: number;
    Shares: number;
};

export type Search = {
    chapters: Chapter[];
    titles: Title[];
    authors: Author[];
    art: Art[];
};