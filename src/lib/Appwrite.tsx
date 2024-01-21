import { Chapter, LikesRequest } from '@/assets/types';
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
        const image = storage.getFileView(
            (import.meta as any).env.VITE_STORAGE_SOCIALS_ID || '',
            id
        );
        return image;
    } catch (error) {
        return error;
    }
};

export const getLikedChapters = async (userId: string) => {
    try {
        const likedChapters = await databases.listDocuments(
            (import.meta as any).env.VITE_HC_COMIC_DB_ID || '',
            (import.meta as any).env.VITE_LIKED_TABLE_ID || '',
            [
                Query.equal('userId', userId),
            ]
        );
        if (likedChapters.total === 0) {
            const newLikedChapters = await databases.createDocument(
                (import.meta as any).env.VITE_HC_COMIC_DB_ID || '',
                (import.meta as any).env.VITE_LIKED_TABLE_ID || '',
                ID.unique(),
                {
                    userId: userId,
                    Chapters: [],
                }
            );
            return newLikedChapters;
        } else {
            return likedChapters;
        }
    } catch (error) {
        return error;
    }
};

export const likeChapterToggle = async (chapterId: string, userId: string) => {
    try {
        const likedChapters: LikesRequest = await getLikedChapters(userId) as LikesRequest;
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