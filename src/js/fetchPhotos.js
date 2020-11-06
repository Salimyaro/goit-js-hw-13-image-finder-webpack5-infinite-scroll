import refs from "./refs";
import InfiniteScroll from "infinite-scroll";

const BASE_URL = "https://pixabay.com/api/";
const KEY = "18969106-b552d166da3dfed7b4523ee16";
let query = null;

export function fetchPhotos(searchQuery, page = 1, perPage) {
  query = searchQuery;
  return fetch(
    `${BASE_URL}?image_type=photo&orientation=horizontal&q=${searchQuery}&page=${page}&per_page=${perPage}&key=${KEY}`
  ).then((r) => r.json());
}

export const infScroll = new InfiniteScroll(refs.gallery, {
  responseType: "text",
  history: false,
  path() {
    return `https://cors-anywhere.herokuapp.com/${BASE_URL}?image_type=photo&orientation=horizontal&q=${query}&page=${
      this.pageIndex + 1
    }&per_page=12&key=${KEY}`;
  },
});
