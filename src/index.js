import "./scss/common.scss";
import "material-design-icons/iconfont/material-icons.css";
import refs from "./js/refs";
import fetchPhotos from "./js/fetchPhotos";
import renderPhotoCards from "./js/render";

import "./js/pnotify-cfg";
import { success } from "@pnotify/core";

import debounce from "lodash.debounce";

import * as basicLightbox from "basiclightbox";
import "basiclightbox/dist/basicLightbox.min.css";

refs.searchForm.addEventListener("input", debounce(onSearch, 500));
refs.loadBtn.addEventListener("click", onSearch);
refs.gallery.addEventListener("click", onGalleryClick);

refs.loadBtn.disabled = true;

let searchQuery = "";
let page = null;
const perPage = 12;

function onSearch(e) {
  e.preventDefault();
  const newSearchQuery = refs.searchForm.elements.query.value;
  if (!newSearchQuery) return;
  if (searchQuery !== newSearchQuery) {
    whenNewSearchQuery(newSearchQuery);
  } else {
    whenOldSearchQuery();
  }
  fetchPhotos(searchQuery, page, perPage)
    .then(onFetchSuccess)
    .catch(onFetchError);
}

function whenNewSearchQuery(query) {
  page = 1;
  searchQuery = query;
  refs.gallery.innerHTML = "";
}

function whenOldSearchQuery() {
  page += 1;
}

function onFetchSuccess(data) {
  let top = refs.gallery.offsetHeight;
  renderPhotoCards(data);
  window.scrollTo({
    top,
    behavior: "smooth",
  });
  pnotify(data);
  refs.loadBtn.disabled = false;
}

function onFetchError(error) {
  console.log(error);
}

function pnotify(data) {
  const uploaded = page * perPage;
  success(`Uploaded ${uploaded} images out of ${data.totalHits}`);
}

function onGalleryClick({ target: { nodeName, dataset } }) {
  if (nodeName !== "IMG") return;
  const instance = basicLightbox.create(`
    <div class="modal">
        <img src="${dataset.src}">
    </div>
`);
  instance.show();
}


//=================================================================================================================


import InfiniteScroll from "infinite-scroll";

const infScroll = new InfiniteScroll(refs.gallery, {
  responseType: "text",
  history: false,
  path: function () {
    return `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${searchQuery}&page=2&per_page=12&key=18969106-b552d166da3dfed7b4523ee16`;
  },
});

infScroll.on('load', (res, url) => {
  console.log(res)
  console.log(url)
});
//=======================================================================================================================
