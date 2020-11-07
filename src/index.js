import "./scss/common.scss";
import "./scss/loader.scss";
import "material-design-icons/iconfont/material-icons.css";
import refs from "./js/refs";
import getPath from "./js/get-path";
import renderPhotoCards from "./js/render";

import { success, notice } from "@pnotify/core";
import "./js/pnotify-cfg";

import debounce from "lodash.debounce";

import * as basicLightbox from "basiclightbox";
import "basiclightbox/dist/basicLightbox.min.css";

import InfiniteScroll from "infinite-scroll";

refs.searchForm.addEventListener("input", debounce(onSearch, 500));
refs.gallery.addEventListener("click", onGalleryClick);

let searchQuery = "";
const perPage = 12;

const infScroll = new InfiniteScroll(refs.gallery, {
  responseType: "text",
  history: false,
  status: ".page-load-status",
  path() {
    return getPath(searchQuery, this.pageIndex, perPage);
  },
});

infScroll.on("load", (response) => {
  const data = JSON.parse(response);
  renderPhotoCards(data);
  loadCheck(data);
});

function onSearch(e) {
  e.preventDefault();
  const newSearchQuery = refs.searchForm.elements.query.value;
  if (!newSearchQuery) return;
  if (searchQuery !== newSearchQuery) {
    whenNewSearchQuery(newSearchQuery);
  }
  infScroll.loadNextPage();
}

function whenNewSearchQuery(newSearchQuery) {
  infScroll.canLoad = true;
  infScroll.pageIndex = 1;
  searchQuery = newSearchQuery;
  refs.gallery.innerHTML = "";
}

function loadCheck(data) {
  const uploaded =
    (infScroll.pageIndex - 1) * perPage - perPage + data.hits.length;
  if (uploaded >= data.totalHits) {
    infScroll.canLoad = false;
    notice(`Uploaded all images out of ${data.totalHits}`);
    return;
  }
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
