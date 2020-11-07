const BASE_URL = "https://pixabay.com/api/";
const KEY = "18969106-b552d166da3dfed7b4523ee16";
const PROXY = "https://cors-anywhere.herokuapp.com";


function getPath(searchQuery, page = 1, perPage) {
  return `${PROXY}/${BASE_URL}?image_type=photo&orientation=horizontal&q=${searchQuery}&page=${page}&per_page=${perPage}&key=${KEY}`;
}
export default getPath;
