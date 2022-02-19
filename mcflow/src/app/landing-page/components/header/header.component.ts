import { Component, OnInit } from '@angular/core';

const searchButton = document.querySelector('nav .desktop-nav .links.search-icon')!;
const closeButton = document.querySelector('.search-container .link-close')!;
const desktopNav = document.querySelector('.desktop-nav')!;
const linkNavs = document.querySelector('.nav-contents')!;
const searchContainer = document.querySelector('.search-container')!;
const overlay = document.querySelector('.overlay')!;

if (searchButton) {
  searchButton.addEventListener('click', () => {
    desktopNav.classList.add('hide');
    linkNavs.classList.add('hide');
    searchContainer.classList.remove('hide');
    overlay.classList.add('show');
  });
}

if (closeButton) {
  closeButton.addEventListener('click', () => {
    desktopNav.classList.remove('hide');
    linkNavs.classList.remove('hide');
    searchContainer.classList.add('hide');
    overlay.classList.remove('show');
  });
}

if (overlay) {
  overlay.addEventListener('click', () => {
    desktopNav.classList.remove('hide');
    linkNavs.classList.remove('hide');
    searchContainer.classList.add('hide');
    overlay.classList.remove('show');
  });
}

// Mobile Version

const menuIconContainer = document.querySelector("nav .menu-icon-container")!;
const navContainer = document.querySelector(".nav-container")!;

if (menuIconContainer) {

  menuIconContainer.addEventListener("click", () => {
    navContainer.classList.toggle("active");
  });
}

const searchBar = document.querySelector(
  ".mobile-search-container .search-bar"
)!;
const nav = document.querySelector(".nav-container nav")!;
const searhInput = document.querySelector(".mobile-search-container input")!;
const cancelBtn = document.querySelector(
  ".mobile-search-container .cancel-btn"
)!;

if (searhInput) {

  searhInput.addEventListener("click", () => {
    searchBar.classList.add("active");
    nav.classList.add("move-up");
    desktopNav.classList.add("move-down");
  });
}

if (cancelBtn) {
  cancelBtn.addEventListener("click", () => {
  searchBar.classList.remove("active");
  nav.classList.remove("move-up");
  desktopNav.classList.remove("move-down");
});
}


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
