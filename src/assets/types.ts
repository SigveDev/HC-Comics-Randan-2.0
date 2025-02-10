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
  Retention: ChapterRetention;
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
  Comments: number;
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
  Art: Art[];
  AuthorStats: AuthorStats;
};
export type AuthorRequest = {
  documents: Author[];
  total: number;
};

export type AuthorStats = {
  $id: string;
  Author: Author;
  Followers: number;
};

export type AuthorStatsRequest = {
  documents: AuthorStats[];
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
  thumbnail: string;
  TitleStats: TitleStats;
  Frontpage: boolean;
};
export type TitleRequest = {
  documents: Title[];
  total: number;
};

export type TitleStats = {
  $id: string;
  Title: Title;
  Followers: number;
};

export type TitleStatsRequest = {
  documents: TitleStats[];
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

export type TempSocials = {
  link: string;
  type: string;
};

export type Socials = {
  $id: string;
  name: string;
  link: string;
  icon: string;
  type: string;
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
  ArtStats: ArtStats;
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

export type User = {
  $id: string;
  $createdAt: Date;
  $updatedAt: Date;
  name: string;
  registration: Date;
  status: boolean;
  labels: [];
  passwordUpdate: Date;
  email: string;
  phone: string;
  emailVerification: boolean;
  phoneVerification: boolean;
  prefs: UserPrefs;
  accessedAt: Date;
};

export type UserPrefs = {
  pfp: string;
  HC: string;
  current: string;
};

export type PublicProfile = {
  $id: string;
  $createdAt: Date;
  $updatedAt: Date;
  userId: string;
  username: string;
  pfp: string;
  Comments: Comments[];
  public: boolean;
};

export type PublicProfileRequest = {
  documents: PublicProfile[];
  total: number;
};

export type Comments = {
  $id: string;
  $createdAt: Date;
  $updatedAt: Date;
  Owner: PublicProfile;
  comment: string;
  ChapterId: string;
  ArtId: string;
};

export type CommentsRequest = {
  documents: Comments[];
  total: number;
};

export type ChapterRetention = {
  $id: string;
  Chapter: Chapter;
  readPagesList: number[];
};

export type History = {
  $id: string;
  $createdAt: Date;
  $updatedAt: Date;
  userId: string;
  ChapterIds: string[];
};
export type HistoryRequest = {
  documents: History[];
  total: number;
};

export type Following = {
  $id: string;
  $createdAt: Date;
  $updatedAt: Date;
  userId: string;
  Authors: Author[];
  Titles: Title[];
};

export type FollowingRequest = {
  documents: Following[];
  total: number;
};

export type BarListData = {
  name: string;
  value: number;
  href: string;
  color?: string;
};
