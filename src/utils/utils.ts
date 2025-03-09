type BookmarkMap = {
  [englishWord: string]: boolean;
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

export const toggleWordBookmark = (englishWord: string): BookmarkMap => {
  const bookmarks = getBookmarkedWords();

  if (bookmarks[englishWord]) {
    delete bookmarks[englishWord];
  } else {
    bookmarks[englishWord] = true;
  }

  setCookie("bookmarkedWords", bookmarks);
  return bookmarks;
};

export const isWordBookmarked = (englishWord: string): boolean => {
  const bookmarks = getBookmarkedWords();
  return !!bookmarks[englishWord];
};

// 북마크된 단어 목록 가져오기 (단어 문자열 배열)
export const getBookmarkedWordsList = (): string[] => {
  const bookmarks = getBookmarkedWords();
  return Object.keys(bookmarks).filter((word) => bookmarks[word]);
};
