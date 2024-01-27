import { Art, Chapter, LikesRequest } from '@/assets/types';
import { Client, Account, Databases, Storage, Query, ID } from 'appwrite';

const client = new Client();

client
    .setEndpoint((import.meta as any).env.VITE_PROJECT_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject((import.meta as any).env.VITE_PROJECT_ID || '65a423a318436867af35');

export const account = new Account(client);

export const databases = new Databases(client);

export const storage = new Storage(client);

export const logout = () => {
    try {
        const user = account.deleteSession('current');
        return user;
    } catch (error) {
        return error;
    }
};

export const loginHCUser = (email: string, password: string) => {
    try {
        const user = account.createEmailSession(email, password);
        return user;
    } catch (error) {
        return error;
    }
};

export const createHCUser = (id: string, email: string, name: string) => {
    try {
        const user = account.create(id, email, id, name);
        return user;
    } catch (error) {
        return error;
    }
};

export const checkUserData = async () => {
    try{
        return account.get();
    } catch {
        const appwriteError = new Error('Appwrite Error');
        throw new Error(appwriteError.message);
    }
};

export const updateEmail = (email: string, id: string) => {
    try {
        const user = account.updateEmail(email, id);
        return user;
    } catch (error) {
        return error;
    }
};

export const updateName = (name: string) => {
    try {
        const user = account.updateName(name);
        return user;
    } catch (error) {
        return error;
    }
};

export const updatePhone = (phone: string, id: string) => {
    try {
        const user = account.updatePhone(phone, id);
        return user;
    } catch (error) {
        return error;
    }
};

export const createUser = (email: string, password: string, name: string) => {
    try {
        const user = account.create(ID.unique(), email, password, name);
        return user;
    } catch (error) {
        return error;
    }
};

export const loginUser = async (email: string, password: string) => {
    try {
        const user = await account.createEmailSession(email, password);
        return user;
    } catch (error) {
        return error;
    }
};

export const getChapters = async (asc: boolean) => {
    try {
        if (asc) {
            const chapters = await databases.listDocuments(
                (import.meta as any).env.VITE_HC_COMIC_DB_ID || '',
                (import.meta as any).env.VITE_CHAPTERS_TABLE_ID || '',
                [
                    Query.orderDesc("$createdAt"),
                    Query.limit(10)
                ]
            );
            return chapters;
        } else {
            const chapters = await databases.listDocuments(
                (import.meta as any).env.VITE_HC_COMIC_DB_ID || '',
                (import.meta as any).env.VITE_CHAPTERS_TABLE_ID || '',
                [
                    Query.orderAsc("$createdAt"),
                    Query.limit(10)
                ]
            );
            return chapters;
        }
    } catch (error) {
        return error;
    }
};

export const getChapterByID = async (id: string) => {
    try {
        const chapter = await databases.getDocument(
            (import.meta as any).env.VITE_HC_COMIC_DB_ID || '',
            (import.meta as any).env.VITE_CHAPTERS_TABLE_ID || '',
            id
        );
        return chapter;
    } catch (error) {
        return error;
    }
};

export const getLatestChapter = async () => {
    try {
        const chapter = await databases.listDocuments(
            (import.meta as any).env.VITE_HC_COMIC_DB_ID || '',
            (import.meta as any).env.VITE_CHAPTERS_TABLE_ID || '',
            [
                Query.orderDesc("$createdAt"),
                Query.limit(1)
            ]
        );
        return chapter;
    } catch (error) {
        return error;
    }
};

export const getThumbnail = (id: string) => {
    try {
        const thumbnail = storage.getFileView(
            (import.meta as any).env.VITE_STORAGE_THUMBNAIL_ID || '',
            id
        );
        return thumbnail;
    } catch (error) {
        return error;
    }
};

export const getThumbnailPreview = (id: string) => {
    try {
        const thumbnail = storage.getFilePreview(
            (import.meta as any).env.VITE_STORAGE_THUMBNAIL_ID || '',
            id,
            800,
            1200,
            undefined,
            50,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            "webp"
        );
        return thumbnail;
    } catch (error) {
        return error;
    }
}

export const getPage = (id: string) => {
    try {
        const page = storage.getFileView(
            (import.meta as any).env.VITE_STORAGE_PAGES_ID || '',
            id
        );
        return page;
    } catch (error) {
        return error;
    }
};

export const getPagePreview = (id: string) => {
    try {
        const page = storage.getFilePreview(
            (import.meta as any).env.VITE_STORAGE_PAGES_ID || '',
            id,
            400,
            600,
            undefined,
            50,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            "webp"
        );
        return page;
    } catch (error) {
        return error;
    }
};

export const getSocials = async () => {
    try {
        const socials = await databases.listDocuments(
            (import.meta as any).env.VITE_HC_COMIC_DB_ID || '',
            (import.meta as any).env.VITE_SOCIALS_TABLE_ID || '',
        );
        return socials;
    } catch (error) {
        return error;
    }
};

export const getSocialImage = (id: string) => {
    try {
        const image = storage.getFilePreview(
            (import.meta as any).env.VITE_STORAGE_SOCIALS_ID || '',
            id,
            150,
            150,
            undefined,
            80,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            "webp"
        );
        return image;
    } catch (error) {
        return error;
    }
};

export const getLiked = async (userId: string) => {
    try {
        const liked = await databases.listDocuments(
            (import.meta as any).env.VITE_HC_COMIC_DB_ID || '',
            (import.meta as any).env.VITE_LIKED_TABLE_ID || '',
            [
                Query.equal('userId', userId),
            ]
        );
        if (liked.total === 0) {
            const newLiked = await databases.createDocument(
                (import.meta as any).env.VITE_HC_COMIC_DB_ID || '',
                (import.meta as any).env.VITE_LIKED_TABLE_ID || '',
                ID.unique(),
                {
                    userId: userId,
                    Chapters: [],
                    Art: [],
                }
            );
            return newLiked;
        } else {
            return liked;
        }
    } catch (error) {
        return error;
    }
};

export const likeChapterToggle = async (chapterId: string, userId: string) => {
    try {
        const likedChapters: LikesRequest = await getLiked(userId) as LikesRequest;
        const likedChapter = likedChapters.documents[0].Chapters.find((chapter: Chapter) => chapter.$id === chapterId);

        const chapter = await databases.getDocument(
            (import.meta as any).env.VITE_HC_COMIC_DB_ID || '',
            (import.meta as any).env.VITE_CHAPTERS_TABLE_ID || '',
            chapterId
        );

        if (likedChapter) {
            const newLikedChapters = await databases.updateDocument(
                (import.meta as any).env.VITE_HC_COMIC_DB_ID || '',
                (import.meta as any).env.VITE_LIKED_TABLE_ID || '',
                likedChapters.documents[0].$id,
                {
                    Chapters: likedChapters.documents[0].Chapters.filter((chapter: Chapter) => chapter.$id !== chapterId),
                }
            );
            await databases.updateDocument(
                (import.meta as any).env.VITE_HC_COMIC_DB_ID || '',
                (import.meta as any).env.VITE_CHAPTERSTATS_TABLE_ID || '',
                chapter.ChapterStats.$id,
                {
                    Likes: chapter.ChapterStats.Likes - 1,
                }
            );
            return newLikedChapters;
        } else {
            const newLikedChapters = await databases.updateDocument(
                (import.meta as any).env.VITE_HC_COMIC_DB_ID || '',
                (import.meta as any).env.VITE_LIKED_TABLE_ID || '',
                likedChapters.documents[0].$id,
                {
                    Chapters: [...likedChapters.documents[0].Chapters, chapter],
                }
            );
            await databases.updateDocument(
                (import.meta as any).env.VITE_HC_COMIC_DB_ID || '',
                (import.meta as any).env.VITE_CHAPTERSTATS_TABLE_ID || '',
                chapter.ChapterStats.$id,
                {
                    Likes: chapter.ChapterStats.Likes + 1,
                }
            );
            return newLikedChapters;
        }
    } catch (error) {
        return error;
    }
};

export const likeArtToggle = async (artId: string, userId: string) => {
    try {
        const likedArt: LikesRequest = await getLiked(userId) as LikesRequest;
        const likedArtPost = likedArt.documents[0].Art.find((art: Art) => art.$id === artId);

        const art = await databases.getDocument(
            (import.meta as any).env.VITE_HC_COMIC_DB_ID || '',
            (import.meta as any).env.VITE_ART_TABLE_ID || '',
            artId
        );

        if (likedArtPost) {
            const newLikedArt = await databases.updateDocument(
                (import.meta as any).env.VITE_HC_COMIC_DB_ID || '',
                (import.meta as any).env.VITE_LIKED_TABLE_ID || '',
                likedArt.documents[0].$id,
                {
                    Art: likedArt.documents[0].Art.filter((art: Art) => art.$id !== artId),
                }
            );
            await databases.updateDocument(
                (import.meta as any).env.VITE_HC_COMIC_DB_ID || '',
                (import.meta as any).env.VITE_ARTSTATS_TABLE_ID || '',
                art.ArtStats.$id,
                {
                    Likes: art.ArtStats.Likes - 1,
                }
            );
            return newLikedArt;
        } else {
            const newLikedArt = await databases.updateDocument(
                (import.meta as any).env.VITE_HC_COMIC_DB_ID || '',
                (import.meta as any).env.VITE_LIKED_TABLE_ID || '',
                likedArt.documents[0].$id,
                {
                    Art: [...likedArt.documents[0].Art, art],
                }
            );
            await databases.updateDocument(
                (import.meta as any).env.VITE_HC_COMIC_DB_ID || '',
                (import.meta as any).env.VITE_ARTSTATS_TABLE_ID || '',
                art.ArtStats.$id,
                {
                    Likes: art.ArtStats.Likes + 1,
                }
            );
            return newLikedArt;
        }
    } catch (error) {
        return error;
    }
};

export const shareChapter = async (chapterId: string) => {
    try {
        const chapter = await databases.getDocument(
            (import.meta as any).env.VITE_HC_COMIC_DB_ID || '',
            (import.meta as any).env.VITE_CHAPTERS_TABLE_ID || '',
            chapterId
        );
        await databases.updateDocument(
            (import.meta as any).env.VITE_HC_COMIC_DB_ID || '',
            (import.meta as any).env.VITE_CHAPTERSTATS_TABLE_ID || '',
            chapter.ChapterStats.$id,
            {
                Shares: chapter.ChapterStats.Shares + 1,
            }
        );
        return true;
    } catch (error) {
        return error;
    }
};

export const shareArt = async (artId: string) => {
    try {
        const art = await databases.getDocument(
            (import.meta as any).env.VITE_HC_COMIC_DB_ID || '',
            (import.meta as any).env.VITE_ART_TABLE_ID || '',
            artId
        );
        await databases.updateDocument(
            (import.meta as any).env.VITE_HC_COMIC_DB_ID || '',
            (import.meta as any).env.VITE_ARTSTATS_TABLE_ID || '',
            art.ArtStats.$id,
            {
                Shares: art.ArtStats.Shares + 1,
            }
        );
        return true;
    } catch (error) {
        return error;
    }
};

export const getTitles = async () => {
    try {
        const titles = await databases.listDocuments(
            (import.meta as any).env.VITE_HC_COMIC_DB_ID || '',
            (import.meta as any).env.VITE_TITLES_TABLE_ID || '',
        );
        return titles;
    } catch (error) {
        return error;
    }
};

export const getTitleByID = async (id: string) => {
    try {
        const title = await databases.getDocument(
            (import.meta as any).env.VITE_HC_COMIC_DB_ID || '',
            (import.meta as any).env.VITE_TITLES_TABLE_ID || '',
            id,
        );
        return title;
    } catch (error) {
        return error;
    }
};

export const getTitleImage = (id: string) => {
    try {
        const image = storage.getFileView(
            (import.meta as any).env.VITE_STORAGE_TITLETHUMBNAIL_ID || '',
            id,
        );
        return image;
    } catch (error) {
        return error;
    }
};

export const getArtPostsPagination = async (placement: number) => {
    try {
        const offset = placement * 24;
        const artPosts = await databases.listDocuments(
            (import.meta as any).env.VITE_HC_COMIC_DB_ID || '',
            (import.meta as any).env.VITE_ART_TABLE_ID || '',
            [
                Query.orderDesc("$createdAt"),
                Query.limit(24),
                Query.offset(offset)
            ]
        );
        return artPosts;
    } catch (error) {
        return error;
    }
};

export const getArtById = async (id: string) => {
    try {
        const art = await databases.getDocument(
            (import.meta as any).env.VITE_HC_COMIC_DB_ID || '',
            (import.meta as any).env.VITE_ART_TABLE_ID || '',
            id
        );
        return art;
    } catch (error) {
        return error;
    }
};

export const getArtImagePreview = (id: string) => {
    try {
        const image = storage.getFilePreview(
            (import.meta as any).env.VITE_STORAGE_ART_ID || '',
            id,
            400,
            600,
            undefined,
            50,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            "webp"
        );
        return image;
    } catch (error) {
        return error;
    }
};

export const getArtImage = (id: string) => {
    try {
        const image = storage.getFileView(
            (import.meta as any).env.VITE_STORAGE_ART_ID || '',
            id
        );
        return image;
    } catch (error) {
        return error;
    }
};

export const giveArtView = async (artId: string) => {
    try {
        const art = await databases.getDocument(
            (import.meta as any).env.VITE_HC_COMIC_DB_ID || '',
            (import.meta as any).env.VITE_ART_TABLE_ID || '',
            artId
        );
        await databases.updateDocument(
            (import.meta as any).env.VITE_HC_COMIC_DB_ID || '',
            (import.meta as any).env.VITE_ARTSTATS_TABLE_ID || '',
            art.ArtStats.$id,
            {
                Views: art.ArtStats.Views + 1,
            }
        );
        return true;
    } catch (error) {
        return error;
    }
};