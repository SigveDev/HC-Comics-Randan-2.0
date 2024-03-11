import {
  Art,
  Author,
  Chapter,
  ColorPalette,
  FollowingRequest,
  LikesRequest,
  Title,
} from "@/assets/types";
import {
  Client,
  Account,
  Databases,
  Storage,
  Query,
  ID,
  Avatars,
  Permission,
  Role,
  Teams,
} from "appwrite";

const client = new Client();

client
  .setEndpoint(
    (import.meta as any).env.VITE_PROJECT_ENDPOINT ||
      "https://cloud.appwrite.io/v1"
  )
  .setProject(
    (import.meta as any).env.VITE_PROJECT_ID || "65a423a318436867af35"
  );

export const account = new Account(client);

export const databases = new Databases(client);

export const storage = new Storage(client);

export const avatars = new Avatars(client);

export const teams = new Teams(client);

export const logout = () => {
  try {
    const user = account.deleteSession("current");
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

export const createHCUser = async (id: string, email: string, name: string) => {
  try {
    const user = await account.create(id, email, id, name);
    setTimeout(async () => {
      await account.createEmailSession(email, id);
      await account.updatePrefs({ pfp: "", HC: "true", current: "" });
      await databases.createDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_PUBLIC_PROFILE_TABLE_ID || "",
        ID.unique(),
        {
          userId: id,
          username: name,
          pfp: "",
          public: true,
          Comments: [],
        },
        [
          Permission.read(Role.any()),
          Permission.update("user:" + id),
          Permission.delete("user:" + id),
        ]
      );
      await databases.createDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_LIKED_TABLE_ID || "",
        ID.unique(),
        {
          userId: id,
          Chapters: [],
          Art: [],
        },
        [
          Permission.read("user:" + id),
          Permission.update("user:" + id),
          Permission.delete("user:" + id),
        ]
      );
      await databases.createDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_FOLLOWING_TABLE_ID || "",
        ID.unique(),
        {
          userId: id,
          Authors: [],
          Titles: [],
        },
        [
          Permission.read("user:" + id),
          Permission.update("user:" + id),
          Permission.delete("user:" + id),
        ]
      );
      await databases.createDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_HISTORY_TABLE_ID || "",
        ID.unique(),
        {
          userId: id,
          ChapterIds: [],
        },
        [
          Permission.read("user:" + id),
          Permission.update("user:" + id),
          Permission.delete("user:" + id),
        ]
      );
      await databases.createDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_HCUSERS_TABLE_ID || "",
        ID.unique(),
        {
          email: email,
          userId: id,
        }
      );
      return user;
    }, 1000);
  } catch (error) {
    return error;
  }
};

export const checkUserData = async () => {
  try {
    return account.get();
  } catch {
    const appwriteError = new Error("Appwrite Error");
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

export const updatePFP = async (file: File) => {
  try {
    const userInf = await account.get();
    let prevPrefs = await account.getPrefs();
    if (prevPrefs.pfp !== "") {
      await storage.deleteFile(
        (import.meta as any).env.VITE_STORAGE_USERPFP_ID || "",
        prevPrefs.pfp
      );
    }
    const newPFP = await storage.createFile(
      (import.meta as any).env.VITE_STORAGE_USERPFP_ID || "",
      ID.unique(),
      file,
      [
        Permission.read(Role.any()),
        Permission.update("user:" + userInf.$id),
        Permission.delete("user:" + userInf.$id),
      ]
    );
    prevPrefs.pfp = newPFP.$id;
    const user = await account.updatePrefs(prevPrefs);
    const publicProfileList = await databases.listDocuments(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_PUBLIC_PROFILE_TABLE_ID || "",
      [Query.equal("userId", userInf.$id)]
    );
    await databases.updateDocument(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_PUBLIC_PROFILE_TABLE_ID || "",
      publicProfileList.documents[0].$id,
      {
        pfp: newPFP.$id,
      }
    );
    return user;
  } catch (error) {
    return error;
  }
};

export const getUserPFP = async () => {
  try {
    const userPrefs = await account.getPrefs();
    const pfp = userPrefs.pfp;
    if (pfp !== "") {
      const pfpURL = storage.getFilePreview(
        (import.meta as any).env.VITE_STORAGE_USERPFP_ID || "",
        pfp,
        100,
        100,
        "center",
        100,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        "webp"
      );
      return pfpURL;
    } else {
      const avatar = avatars.getInitials();
      return avatar;
    }
  } catch (error) {
    return error;
  }
};

export const getAuthorPFP = async (id: string) => {
  try {
    const author = await databases.getDocument(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_AUTHORS_TABLE_ID || "",
      id
    );
    const pfp = author.pfp;
    if (pfp !== "") {
      const pfpURL = storage.getFilePreview(
        (import.meta as any).env.VITE_STORAGE_AUTHORPFP_ID || "",
        pfp,
        300,
        300,
        "center",
        100,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        "webp"
      );
      return pfpURL;
    } else {
      const avatar = avatars.getInitials();
      return avatar;
    }
  } catch (error) {
    return error;
  }
};

export const getPublicUserPFP = async (id: string) => {
  try {
    const author = await databases.listDocuments(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_PUBLIC_PROFILE_TABLE_ID || "",
      [Query.equal("userId", id)]
    );
    const pfp = author.documents[0].pfp;
    if (pfp !== "") {
      const pfpURL = storage.getFilePreview(
        (import.meta as any).env.VITE_STORAGE_USERPFP_ID || "",
        pfp,
        100,
        100,
        "center",
        100,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        "webp"
      );
      return pfpURL;
    } else {
      const avatar = avatars.getInitials(author.documents[0].username);
      return avatar;
    }
  } catch (error) {
    return error;
  }
};

export const updateCurrent = async (id: string) => {
  try {
    let userPrefs = await account.getPrefs();
    userPrefs.current = id;
    const user = account.updatePrefs(userPrefs);
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

export const createUser = async (
  email: string,
  password: string,
  name: string
) => {
  try {
    const user = await account.create(ID.unique(), email, password, name);
    setTimeout(async () => {
      await account.createEmailSession(email, user.$id);
      await account.updatePrefs({ pfp: "", HC: "false", current: "" });
      await databases.createDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_PUBLIC_PROFILE_TABLE_ID || "",
        ID.unique(),
        {
          userId: user.$id,
          username: name,
          pfp: "",
          public: true,
          Comments: [],
        },
        [
          Permission.read(Role.any()),
          Permission.update("user:" + user.$id),
          Permission.delete("user:" + user.$id),
        ]
      );
      await databases.createDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_LIKED_TABLE_ID || "",
        ID.unique(),
        {
          userId: user.$id,
          Chapters: [],
          Art: [],
        },
        [
          Permission.read("user:" + user.$id),
          Permission.update("user:" + user.$id),
          Permission.delete("user:" + user.$id),
        ]
      );
      await databases.createDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_FOLLOWING_TABLE_ID || "",
        ID.unique(),
        {
          userId: user.$id,
          Authors: [],
          Titles: [],
        },
        [
          Permission.read("user:" + user.$id),
          Permission.update("user:" + user.$id),
          Permission.delete("user:" + user.$id),
        ]
      );
      await databases.createDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_HISTORY_TABLE_ID || "",
        ID.unique(),
        {
          userId: user.$id,
          ChapterIds: [],
        },
        [
          Permission.read("user:" + user.$id),
          Permission.update("user:" + user.$id),
          Permission.delete("user:" + user.$id),
        ]
      );
      return user;
    }, 1000);
  } catch (error) {
    return error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const HCUser = await databases.listDocuments(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_HCUSERS_TABLE_ID || "",
      [Query.equal("email", email)]
    );
    if (HCUser.total === 0) {
      const user = await account.createEmailSession(email, password);
      return user;
    } else {
      return "HC";
    }
  } catch (error) {
    return error;
  }
};

export const getPublicUser = async () => {
  try {
    const realUser = await account.get();
    const user = await databases.listDocuments(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_PUBLIC_PROFILE_TABLE_ID || "",
      [Query.equal("userId", realUser.$id)]
    );
    return user.documents[0];
  } catch (error) {
    return error;
  }
};

export const togglePublicUser = async () => {
  try {
    const realUser = await account.get();
    const user = await databases.listDocuments(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_PUBLIC_PROFILE_TABLE_ID || "",
      [Query.equal("userId", realUser.$id)]
    );
    await databases.updateDocument(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_PUBLIC_PROFILE_TABLE_ID || "",
      user.documents[0].$id,
      {
        public: !user.documents[0].public,
      }
    );
    return !user.documents[0].public;
  } catch (error) {
    return error;
  }
};

export const sendPasswordResetLoggedIn = async () => {
  try {
    const user = await account.get();
    account.createRecovery(user.email, "http://localhost:5173/password/reset");
    return true;
  } catch (error) {
    return error;
  }
};

export const sendPasswordReset = async (email: string) => {
  try {
    account.createRecovery(email, "http://localhost:5173/password/reset");
    return true;
  } catch (error) {
    return error;
  }
};

export const resetPassword = async (
  userId: string,
  secret: string,
  password: string,
  password2: string
) => {
  try {
    account.updateRecovery(userId, secret, password, password2);
    return true;
  } catch (error) {
    return error;
  }
};

export const sendEmailVerification = async () => {
  try {
    account.createVerification("http://localhost:5173/email/verify");
    return true;
  } catch (error) {
    return error;
  }
};

export const verifyEmail = async (userId: string, secret: string) => {
  try {
    account.updateVerification(userId, secret);
    return true;
  } catch (error) {
    return error;
  }
};

export const postComment = async (
  postToId: string,
  comment: string,
  chapter: boolean
) => {
  try {
    const user = await account.get();
    const publicProfile = await databases.listDocuments(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_PUBLIC_PROFILE_TABLE_ID || "",
      [Query.equal("userId", user.$id)]
    );
    if (chapter) {
      const chapter = await databases.getDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_CHAPTERS_TABLE_ID || "",
        postToId
      );
      await databases.createDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_COMMENTS_TABLE_ID || "",
        ID.unique(),
        {
          comment: comment,
          ChapterId: chapter.$id,
          ArtId: null,
          Owner: publicProfile.documents[0].$id,
        },
        [
          Permission.read(Role.any()),
          Permission.update("user:" + user.$id),
          Permission.delete("user:" + user.$id),
        ]
      );
      await databases.updateDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_CHAPTERSTATS_TABLE_ID || "",
        chapter.ChapterStats.$id,
        {
          Comments: chapter.ChapterStats.Comments + 1,
        }
      );
    } else {
      const art = await databases.getDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_ART_TABLE_ID || "",
        postToId
      );
      await databases.createDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_COMMENTS_TABLE_ID || "",
        ID.unique(),
        {
          comment: comment,
          ChapterId: null,
          ArtId: art.$id,
          Owner: publicProfile.documents[0].$id,
        },
        [
          Permission.read(Role.any()),
          Permission.update("user:" + user.$id),
          Permission.delete("user:" + user.$id),
        ]
      );
      await databases.updateDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_ARTSTATS_TABLE_ID || "",
        art.ArtStats.$id,
        {
          Comments: art.ArtStats.Comments + 1,
        }
      );
    }
    return true;
  } catch (error) {
    return error;
  }
};

export const getCommentsByChapterId = async (chapterId: string) => {
  try {
    const comments = await databases.listDocuments(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_COMMENTS_TABLE_ID || "",
      [Query.equal("ChapterId", chapterId), Query.orderDesc("$createdAt")]
    );
    return comments;
  } catch (error) {
    return error;
  }
};

export const getCommentsByArtId = async (artId: string) => {
  try {
    const comments = await databases.listDocuments(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_COMMENTS_TABLE_ID || "",
      [Query.equal("ArtId", artId), Query.orderDesc("$createdAt")]
    );
    return comments;
  } catch (error) {
    return error;
  }
};

export const getCommentsByUserId = async (userId: string) => {
  try {
    const comments = await databases.listDocuments(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_COMMENTS_TABLE_ID || "",
      [Query.equal("Owner", userId), Query.orderDesc("$createdAt")]
    );
    return comments;
  } catch (error) {
    return error;
  }
};

export const addChapterToHistory = async (chapterId: string) => {
  try {
    const user = await account.get();
    const history = await databases.listDocuments(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_HISTORY_TABLE_ID || "",
      [Query.equal("userId", user.$id)]
    );
    const chapter = await databases.getDocument(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_CHAPTERS_TABLE_ID || "",
      chapterId
    );
    if (history.total === 0) {
      await databases.createDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_HISTORY_TABLE_ID || "",
        ID.unique(),
        {
          userId: user.$id,
          ChapterIds: [chapter.$id],
        },
        [
          Permission.read("user:" + user.$id),
          Permission.update("user:" + user.$id),
          Permission.delete("user:" + user.$id),
        ]
      );
    } else {
      await databases.updateDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_HISTORY_TABLE_ID || "",
        history.documents[0].$id,
        {
          ChaptersIds: [...history.documents[0].ChapterIds, chapter.$id],
        }
      );
    }
    return true;
  } catch (error) {
    return error;
  }
};

export const getHistory = async () => {
  try {
    const user = await account.get();
    const history = await databases.listDocuments(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_HISTORY_TABLE_ID || "",
      [Query.equal("userId", user.$id)]
    );
    if (history.total === 0) {
      const newHistory = await databases.createDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_HISTORY_TABLE_ID || "",
        ID.unique(),
        {
          userId: user.$id,
          ChapterIds: [],
        },
        [
          Permission.read("user:" + user.$id),
          Permission.update("user:" + user.$id),
          Permission.delete("user:" + user.$id),
        ]
      );
      return newHistory;
    } else {
      return history.documents[0];
    }
  } catch (error) {
    return error;
  }
};

export const getChapters = async (asc: boolean) => {
  try {
    if (asc) {
      const chapters = await databases.listDocuments(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_CHAPTERS_TABLE_ID || "",
        [Query.orderDesc("$createdAt"), Query.limit(10)]
      );
      return chapters;
    } else {
      const chapters = await databases.listDocuments(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_CHAPTERS_TABLE_ID || "",
        [Query.orderAsc("$createdAt"), Query.limit(10)]
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
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_CHAPTERS_TABLE_ID || "",
      id
    );
    return chapter;
  } catch (error) {
    return error;
  }
};

export const giveChapterView = async (id: string) => {
  try {
    const chapter = await databases.getDocument(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_CHAPTERS_TABLE_ID || "",
      id
    );
    await databases.updateDocument(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_CHAPTERSTATS_TABLE_ID || "",
      chapter.ChapterStats.$id,
      {
        Views: chapter.ChapterStats.Views + 1,
      }
    );
    return true;
  } catch (error) {
    return error;
  }
};

export const postChapterRetention = async (id: string, readPages: number) => {
  try {
    const chapter = await databases.getDocument(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_CHAPTERS_TABLE_ID || "",
      id
    );
    const retention = await databases.getDocument(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_RETENTION_TABLE_ID || "",
      chapter.Retention.$id
    );
    await databases.updateDocument(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_RETENTION_TABLE_ID || "",
      chapter.Retention.$id,
      {
        readPagesList: [...retention.readPagesList, readPages],
      }
    );
    return true;
  } catch (error) {
    return error;
  }
};

export const getLatestChapter = async () => {
  try {
    const chapter = await databases.listDocuments(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_CHAPTERS_TABLE_ID || "",
      [Query.orderDesc("$createdAt"), Query.limit(1)]
    );
    return chapter;
  } catch (error) {
    return error;
  }
};

export const getThumbnail = (id: string) => {
  try {
    const thumbnail = storage.getFileView(
      (import.meta as any).env.VITE_STORAGE_THUMBNAIL_ID || "",
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
      (import.meta as any).env.VITE_STORAGE_THUMBNAIL_ID || "",
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
};

export const getPage = (id: string) => {
  try {
    const page = storage.getFileView(
      (import.meta as any).env.VITE_STORAGE_PAGES_ID || "",
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
      (import.meta as any).env.VITE_STORAGE_PAGES_ID || "",
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
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_SOCIALS_TABLE_ID || ""
    );
    return socials;
  } catch (error) {
    return error;
  }
};

export const getSocialImage = (id: string) => {
  try {
    const image = storage.getFilePreview(
      (import.meta as any).env.VITE_STORAGE_SOCIALS_ID || "",
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
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_LIKED_TABLE_ID || "",
      [Query.equal("userId", userId)]
    );
    if (liked.total === 0) {
      const newLiked = await databases.createDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_LIKED_TABLE_ID || "",
        ID.unique(),
        {
          userId: userId,
          Chapters: [],
          Art: [],
        },
        [
          Permission.read("user:" + userId),
          Permission.update("user:" + userId),
          Permission.delete("user:" + userId),
        ]
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
    const likedChapters: LikesRequest = (await getLiked(
      userId
    )) as LikesRequest;
    const likedChapter = likedChapters.documents[0].Chapters.find(
      (chapter: Chapter) => chapter.$id === chapterId
    );

    const chapter = await databases.getDocument(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_CHAPTERS_TABLE_ID || "",
      chapterId
    );

    if (likedChapter) {
      const newLikedChapters = await databases.updateDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_LIKED_TABLE_ID || "",
        likedChapters.documents[0].$id,
        {
          Chapters: likedChapters.documents[0].Chapters.filter(
            (chapter: Chapter) => chapter.$id !== chapterId
          ),
        }
      );
      await databases.updateDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_CHAPTERSTATS_TABLE_ID || "",
        chapter.ChapterStats.$id,
        {
          Likes: chapter.ChapterStats.Likes - 1,
        }
      );
      return newLikedChapters;
    } else {
      const newLikedChapters = await databases.updateDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_LIKED_TABLE_ID || "",
        likedChapters.documents[0].$id,
        {
          Chapters: [...likedChapters.documents[0].Chapters, chapter],
        }
      );
      await databases.updateDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_CHAPTERSTATS_TABLE_ID || "",
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
    const likedArt: LikesRequest = (await getLiked(userId)) as LikesRequest;
    const likedArtPost = likedArt.documents[0].Art.find(
      (art: Art) => art.$id === artId
    );

    const art = await databases.getDocument(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_ART_TABLE_ID || "",
      artId
    );

    if (likedArtPost) {
      const newLikedArt = await databases.updateDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_LIKED_TABLE_ID || "",
        likedArt.documents[0].$id,
        {
          Art: likedArt.documents[0].Art.filter(
            (art: Art) => art.$id !== artId
          ),
        }
      );
      await databases.updateDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_ARTSTATS_TABLE_ID || "",
        art.ArtStats.$id,
        {
          Likes: art.ArtStats.Likes - 1,
        }
      );
      return newLikedArt;
    } else {
      const newLikedArt = await databases.updateDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_LIKED_TABLE_ID || "",
        likedArt.documents[0].$id,
        {
          Art: [...likedArt.documents[0].Art, art],
        }
      );
      await databases.updateDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_ARTSTATS_TABLE_ID || "",
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
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_CHAPTERS_TABLE_ID || "",
      chapterId
    );
    await databases.updateDocument(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_CHAPTERSTATS_TABLE_ID || "",
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
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_ART_TABLE_ID || "",
      artId
    );
    await databases.updateDocument(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_ARTSTATS_TABLE_ID || "",
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
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_TITLES_TABLE_ID || ""
    );
    return titles;
  } catch (error) {
    return error;
  }
};

export const getTitleByID = async (id: string) => {
  try {
    const title = await databases.getDocument(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_TITLES_TABLE_ID || "",
      id
    );
    return title;
  } catch (error) {
    return error;
  }
};

export const getTitleImage = (id: string) => {
  try {
    const image = storage.getFileView(
      (import.meta as any).env.VITE_STORAGE_TITLETHUMBNAIL_ID || "",
      id
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
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_ART_TABLE_ID || "",
      [Query.orderDesc("$createdAt"), Query.limit(24), Query.offset(offset)]
    );
    return artPosts;
  } catch (error) {
    return error;
  }
};

export const getArtById = async (id: string) => {
  try {
    const art = await databases.getDocument(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_ART_TABLE_ID || "",
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
      (import.meta as any).env.VITE_STORAGE_ART_ID || "",
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
      (import.meta as any).env.VITE_STORAGE_ART_ID || "",
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
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_ART_TABLE_ID || "",
      artId
    );
    await databases.updateDocument(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_ARTSTATS_TABLE_ID || "",
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

export const removeArtView = async (artId: string) => {
  try {
    const art = await databases.getDocument(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_ART_TABLE_ID || "",
      artId
    );
    await databases.updateDocument(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_ARTSTATS_TABLE_ID || "",
      art.ArtStats.$id,
      {
        Views: art.ArtStats.Views - 1,
      }
    );
    return true;
  } catch (error) {
    return error;
  }
};

export const getAuthorById = async (id: string) => {
  try {
    const author = await databases.getDocument(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_AUTHORS_TABLE_ID || "",
      id
    );
    return author;
  } catch (error) {
    return error;
  }
};

export const getSearchResults = async (query: string) => {
  try {
    const searchResults = await databases.listDocuments(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_CHAPTERS_TABLE_ID || "",
      [Query.search("title", query), Query.limit(10)]
    );
    const titlesResults = await databases.listDocuments(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_TITLES_TABLE_ID || "",
      [Query.search("name", query), Query.limit(10)]
    );
    const authorsResults = await databases.listDocuments(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_AUTHORS_TABLE_ID || "",
      [Query.search("name", query), Query.limit(10)]
    );
    const artResults = await databases.listDocuments(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_ART_TABLE_ID || "",
      [Query.search("title", query), Query.limit(10)]
    );
    const all = {
      chapters: searchResults.documents,
      titles: titlesResults.documents,
      authors: authorsResults.documents,
      art: artResults.documents,
    };
    return all;
  } catch (error) {
    return error;
  }
};

export const getFollowing = async (userId: string) => {
  try {
    const following = await databases.listDocuments(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_FOLLOWING_TABLE_ID || "",
      [Query.equal("userId", userId)]
    );
    if (following.total === 0) {
      const newFollowing = await databases.createDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_FOLLOWING_TABLE_ID || "",
        ID.unique(),
        {
          userId: userId,
          Authors: [],
          Titles: [],
        },
        [
          Permission.read("user:" + userId),
          Permission.update("user:" + userId),
          Permission.delete("user:" + userId),
        ]
      );
      return newFollowing;
    } else {
      return following;
    }
  } catch (error) {
    return error;
  }
};

export const followAuthorToggle = async (authorId: string, userId: string) => {
  try {
    const following: FollowingRequest = (await getFollowing(
      userId
    )) as FollowingRequest;
    const followingAuthor = following.documents[0].Authors.find(
      (author: Author) => author.$id === authorId
    );

    const author: Author = (await databases.getDocument(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_AUTHORS_TABLE_ID || "",
      authorId
    )) as unknown as Author;

    if (followingAuthor) {
      const newFollowing = await databases.updateDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_FOLLOWING_TABLE_ID || "",
        following.documents[0].$id,
        {
          Authors: following.documents[0].Authors.filter(
            (author: Author) => author.$id !== authorId
          ),
        }
      );
      await databases.updateDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_AUTHORSTATS_TABLE_ID || "",
        author.AuthorStats.$id,
        {
          Followers: author.AuthorStats.Followers - 1,
        }
      );
      return newFollowing;
    } else {
      const newFollowing = await databases.updateDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_FOLLOWING_TABLE_ID || "",
        following.documents[0].$id,
        {
          Authors: [...following.documents[0].Authors, author],
        }
      );
      await databases.updateDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_AUTHORSTATS_TABLE_ID || "",
        author.AuthorStats.$id,
        {
          Followers: author.AuthorStats.Followers + 1,
        }
      );
      return newFollowing;
    }
  } catch (error) {
    return error;
  }
};

export const followTitleToggle = async (titleId: string, userId: string) => {
  try {
    const following: FollowingRequest = (await getFollowing(
      userId
    )) as FollowingRequest;
    const followingTitle = following.documents[0].Titles.find(
      (title: Title) => title.$id === titleId
    );

    const title: Title = (await databases.getDocument(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_TITLES_TABLE_ID || "",
      titleId
    )) as unknown as Title;

    if (followingTitle) {
      const newFollowing = await databases.updateDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_FOLLOWING_TABLE_ID || "",
        following.documents[0].$id,
        {
          Titles: following.documents[0].Titles.filter(
            (title: Title) => title.$id !== titleId
          ),
        }
      );
      await databases.updateDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_TITLESTATS_TABLE_ID || "",
        title.TitleStats.$id,
        {
          Followers: title.TitleStats.Followers - 1,
        }
      );
      return newFollowing;
    } else {
      const newFollowing = await databases.updateDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_FOLLOWING_TABLE_ID || "",
        following.documents[0].$id,
        {
          Titles: [...following.documents[0].Titles, title],
        }
      );
      await databases.updateDocument(
        (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
        (import.meta as any).env.VITE_TITLESTATS_TABLE_ID || "",
        title.TitleStats.$id,
        {
          Followers: title.TitleStats.Followers + 1,
        }
      );
      return newFollowing;
    }
  } catch (error) {
    return error;
  }
};

export const getMyAuthor = async () => {
  try {
    const user = await account.get();
    const author = await databases.listDocuments(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_AUTHORS_TABLE_ID || "",
      [Query.equal("userId", user.$id)]
    );
    if (author.total > 0) {
      return author;
    } else {
      return false;
    }
  } catch (error) {
    return error;
  }
};

export const uploadPages = async (file: File) => {
  try {
    const user = await account.get();
    const pages = await storage.createFile(
      (import.meta as any).env.VITE_STORAGE_PAGES_ID || "",
      ID.unique(),
      file,
      [
        Permission.read("user:" + user.$id),
        Permission.update("user:" + user.$id),
        Permission.delete("user:" + user.$id),
      ]
    );
    await databases.createDocument(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_UPLOADES_TABLE_ID || "",
      ID.unique(),
      {
        fileId: pages.$id,
        type: "page",
      },
      [
        Permission.read("user:" + user.$id),
        Permission.update("user:" + user.$id),
        Permission.delete("user:" + user.$id),
      ]
    );
    return pages;
  } catch (error) {
    return error;
  }
};

export const uploadThumbnail = async (file: File) => {
  try {
    const user = await account.get();
    const thumbnail = await storage.createFile(
      (import.meta as any).env.VITE_STORAGE_THUMBNAIL_ID || "",
      ID.unique(),
      file,
      [
        Permission.read("user:" + user.$id),
        Permission.update("user:" + user.$id),
        Permission.delete("user:" + user.$id),
      ]
    );
    await databases.createDocument(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_UPLOADES_TABLE_ID || "",
      ID.unique(),
      {
        fileId: thumbnail.$id,
        type: "thumbnail",
      },
      [
        Permission.read("user:" + user.$id),
        Permission.update("user:" + user.$id),
        Permission.delete("user:" + user.$id),
      ]
    );
    return thumbnail;
  } catch (error) {
    return error;
  }
};

export const uploadArt = async (file: File) => {
  try {
    const user = await account.get();
    const art = await storage.createFile(
      (import.meta as any).env.VITE_STORAGE_ART_ID || "",
      ID.unique(),
      file,
      [
        Permission.read("user:" + user.$id),
        Permission.update("user:" + user.$id),
        Permission.delete("user:" + user.$id),
      ]
    );
    await databases.createDocument(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_UPLOADES_TABLE_ID || "",
      ID.unique(),
      {
        fileId: art.$id,
        type: "art",
      },
      [
        Permission.read("user:" + user.$id),
        Permission.update("user:" + user.$id),
        Permission.delete("user:" + user.$id),
      ]
    );
    return art;
  } catch (error) {
    return error;
  }
};

export const getMyThumbnails = async () => {
  try {
    const fileIDlist = await databases.listDocuments(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_UPLOADES_TABLE_ID || ""
    );
    const thumbnails: URL[] = [];
    fileIDlist.documents.forEach(async (uplaodInfo: any) => {
      if (uplaodInfo.type === "thumbnail") {
        const thumbnail = await storage.getFileView(
          (import.meta as any).env.VITE_STORAGE_THUMBNAIL_ID || "",
          uplaodInfo.fileId
        );
        thumbnails.push(thumbnail);
      }
    });
    return thumbnails;
  } catch (error) {
    return error;
  }
};

export const getMyPages = async () => {
  try {
    const fileIDlist = await databases.listDocuments(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_UPLOADES_TABLE_ID || ""
    );
    const pages: URL[] = [];
    fileIDlist.documents.forEach(async (uplaodInfo: any) => {
      if (uplaodInfo.type === "page") {
        const page = await storage.getFileView(
          (import.meta as any).env.VITE_STORAGE_PAGES_ID || "",
          uplaodInfo.fileId
        );
        pages.push(page);
      }
    });
    return pages;
  } catch (error) {
    return error;
  }
};

export const getMyArt = async () => {
  try {
    const fileIDlist = await databases.listDocuments(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_UPLOADES_TABLE_ID || ""
    );
    const arts: URL[] = [];
    fileIDlist.documents.forEach(async (uplaodInfo: any) => {
      if (uplaodInfo.type === "art") {
        const art = await storage.getFileView(
          (import.meta as any).env.VITE_STORAGE_ART_ID || "",
          uplaodInfo.fileId
        );
        arts.push(art);
      }
    });
    return arts;
  } catch (error) {
    return error;
  }
};

export const removeThumbnail = async (id: string) => {
  try {
    await storage.deleteFile(
      (import.meta as any).env.VITE_STORAGE_THUMBNAIL_ID || "",
      id
    );
    const upload = await databases.listDocuments(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_UPLOADES_TABLE_ID || "",
      [Query.equal("fileId", id)]
    );
    await databases.deleteDocument(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_UPLOADES_TABLE_ID || "",
      upload.documents[0].$id
    );
    return true;
  } catch (error) {
    return error;
  }
};

export const removePage = async (id: string) => {
  try {
    await storage.deleteFile(
      (import.meta as any).env.VITE_STORAGE_PAGES_ID || "",
      id
    );
    const upload = await databases.listDocuments(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_UPLOADES_TABLE_ID || "",
      [Query.equal("fileId", id)]
    );
    await databases.deleteDocument(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_UPLOADES_TABLE_ID || "",
      upload.documents[0].$id
    );
    return true;
  } catch (error) {
    return error;
  }
};

export const removeArt = async (id: string) => {
  try {
    await storage.deleteFile(
      (import.meta as any).env.VITE_STORAGE_ART_ID || "",
      id
    );
    const upload = await databases.listDocuments(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_UPLOADES_TABLE_ID || "",
      [Query.equal("fileId", id)]
    );
    await databases.deleteDocument(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_UPLOADES_TABLE_ID || "",
      upload.documents[0].$id
    );
    return true;
  } catch (error) {
    return error;
  }
};

export const checkAuthorTeamsMembership = async () => {
  try {
    await teams.get((import.meta as any).env.VITE_AUTHOR_TEAM_ID || "");
    return true;
  } catch (error) {
    return false;
  }
};

export const getMyTitles = async () => {
  try {
    const user = await account.get();
    const author = await databases.listDocuments(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_AUTHORS_TABLE_ID || "",
      [Query.equal("userId", user.$id)]
    );
    const titles = await databases.listDocuments(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_TITLES_TABLE_ID || "",
      [Query.equal("Author", author.documents[0].$id)]
    );
    return titles;
  } catch (error) {
    return error;
  }
};

export const getColorPalattes = async () => {
  try {
    const palattes = await databases.listDocuments(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_COLORS_TABLE_ID || ""
    );
    return palattes;
  } catch (error) {
    return error;
  }
};

export const createChapter = async (
  authorId: string,
  title: string,
  thumbnailId: string,
  pageIds: string[],
  Title: Title,
  chapterIndex: number,
  description: string,
  ColorPalette: ColorPalette,
  subtitle: string
) => {
  try {
    const user = await account.get();
    const chapterId = ID.unique();

    const newChapterStats = await databases.createDocument(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_CHAPTERSTATS_TABLE_ID || "",
      ID.unique(),
      {
        Chapter: chapterId,
        Views: 0,
        Likes: 0,
        Shares: 0,
        Comments: 0,
      }
    );

    const newChapterRetention = await databases.createDocument(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_RETENTION_TABLE_ID || "",
      ID.unique(),
      {
        Chapter: chapterId,
        readPagesList: [],
      }
    );

    const newChapter = await databases.createDocument(
      (import.meta as any).env.VITE_HC_COMIC_DB_ID || "",
      (import.meta as any).env.VITE_CHAPTERS_TABLE_ID || "",
      chapterId,
      {
        title: title,
        description: description,
        pages: pageIds,
        thumbnail: thumbnailId,
        Author: authorId,
        Titles: Title.$id,
        ColorPalette: ColorPalette.$id,
        number: chapterIndex,
        subtitle: subtitle,
        ChapterStats: newChapterStats.$id,
        Retention: newChapterRetention.$id,
      },
      [
        Permission.read("user:" + user.$id),
        Permission.update("user:" + user.$id),
        Permission.delete("user:" + user.$id),
      ]
    );
    return newChapter;
  } catch (error) {
    return error;
  }
};
