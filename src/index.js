import "./sass/main.scss";
import { error, alert } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";

import getPictures from "./js/api-service";
import createCard from "./template/card.hbs";
import * as basicLightbox from "basiclightbox";

const refs = {
  form: document.querySelector("#search-form"),
  gallery: document.querySelector(".gallery"),
  btnMore: document.querySelector(".btn-more"),
  btnReset: document.querySelector(".js-btn-reset"),
  btnTop: document.querySelector('.js-btn-to-top'),
};
const state = {
  page: 1,
  query: "",
};

const options = {
  root: null,
  rootMargin: "0px",
  threshold: 0.5,
};

refs.form.addEventListener("submit", onSubmit);
refs.btnMore.addEventListener("click", onBtnMore);
refs.gallery.addEventListener("click", onImgClick);
refs.btnReset.addEventListener("click", onResetClick);
refs.btnMore.style.visibility = "hidden";
refs.btnTop.addEventListener('click', toTop);

async function onSubmit(e) {
  e.preventDefault();
  refs.btnMore.style.visibility = "hidden";
  state.query = e.currentTarget.elements.query.value;
  state.page = 1;

  if (state.query === "") {
    onResetClick();
    return alert({
      text: "Please, write anything",
    });
  }

  const {
    data: { hits },
  } = await getPictures(state.query, state.page);
  console.log(hits);

  if (hits.length === 0) {
    return error({
      text: "Error",
    });
  }

  if (hits.length > 11) {
    refs.btnMore.style.visibility = "visible";
  }
  const markup = createCard(hits);
  refs.gallery.innerHTML = markup;
}

async function onBtnMore(e) {
  state.page += 1;
  const {
    data: { hits },
  } = await getPictures(state.query, state.page);
  const markup = createCard(hits);
  refs.gallery.insertAdjacentHTML("beforeend", markup);
  if (state.page === 2) {
    const observer = new IntersectionObserver(onBtnMore, options);
    observer.observe(refs.btnMore);
  }

  // refs.gallery.scrollIntoView({
  //   behavior: "smooth",
  //   block: "end",
  // });
}

function onImgClick(e) {
  if (e.target.nodeName !== "IMG") {
    return;
  }

  const currentImg = e.target.dataset.src;
  const instance = basicLightbox.create(`
    <img src="${currentImg}" width="800" height="600">
`);

  instance.show();
}

function onResetClick(e) {
  e.preventDefault();
  refs.btnMore.style.visibility = "hidden";
  refs.form.reset();
  refs.gallery.innerHTML = "";
  state.page = 1;
  state.query = "";
}

