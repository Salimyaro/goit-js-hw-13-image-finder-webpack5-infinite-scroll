import "./scss/common.scss";
import "material-design-icons/iconfont/material-icons.css";
import refs from "./js/refs";

import { fetchPhotos, infScroll } from "./js/fetchPhotos";

import renderPhotoCards from "./js/render";

import "./js/pnotify-cfg";
import { success } from "@pnotify/core";

import debounce from "lodash.debounce";

import * as basicLightbox from "basiclightbox";
import "basiclightbox/dist/basicLightbox.min.css";

refs.searchForm.addEventListener("input", debounce(onSearch, 500));
refs.gallery.addEventListener("click", onGalleryClick);

let searchQuery = "";
let page = null;
let nextPage = null;
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
  nextPage = page + 1;
}

function onFetchSuccess(data) {
  renderPhotoCards(data);
  pnotify(data);
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

infScroll.on("load", (response) => {
  console.log("loadind...");
  const data = JSON.parse(response);
  page += 1;
  onFetchSuccess(data);
});
