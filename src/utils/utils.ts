type BookmarkMap = {
  [vocabId: string]: number[];
};

export const setCookie = (
  name: string,
  value: any,
  days: number = 365 * 10
): void => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "; expires=" + date.toUTCString();
  document.cookie =
    name +
    "=" +
    encodeURIComponent(JSON.stringify(value)) +
    expires +
    "; path=/";
};

export const getCookie = (name: string): any => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      try {
        return JSON.parse(
          decodeURIComponent(c.substring(nameEQ.length, c.length))
        );
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};

export const getBookmarkedWords = (): BookmarkMap => {
  return getCookie("bookmarkedWords") || {};
};

export const saveBookmarkedWords = (
  vocabId: string,
  wordIds: number[]
): void => {
  const bookmarks = getBookmarkedWords();
  bookmarks[vocabId] = wordIds;
  setCookie("bookmarkedWords", bookmarks);
};

export const toggleWordBookmark = (
  vocabId: string,
  wordId: number
): number[] => {
  const bookmarks = getBookmarkedWords();
  const currentVocabBookmarks = bookmarks[vocabId] || [];

  let newVocabBookmarks: number[];
  if (currentVocabBookmarks.includes(wordId)) {
    newVocabBookmarks = currentVocabBookmarks.filter((id) => id !== wordId);
  } else {
    newVocabBookmarks = [...currentVocabBookmarks, wordId];
  }

  bookmarks[vocabId] = newVocabBookmarks;
  setCookie("bookmarkedWords", bookmarks);

  return newVocabBookmarks;
};

export const isWordBookmarked = (vocabId: string, wordId: number): boolean => {
  const bookmarks = getBookmarkedWords();
  const currentVocabBookmarks = bookmarks[vocabId] || [];
  return currentVocabBookmarks.includes(wordId);
};
