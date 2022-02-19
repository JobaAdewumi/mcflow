import { Component, OnInit } from '@angular/core';


const desktopNav = document.querySelector('.desktop-nav')!;
const linkNavs = document.querySelector('.nav-contents')!;
const searchContainer = document.querySelector('.search-container')!;
const overlay = document.querySelector('.overlay')!;

if (overlay) {
  overlay.addEventListener('click', () => {
    desktopNav.classList.remove('hide');
    linkNavs.classList.remove('hide');
    searchContainer.classList.add('hide');
    overlay.classList.remove('show');
  });
}

@Component({
  selector: 'app-all-landing',
  templateUrl: './all-landing.component.html',
  styleUrls: ['./all-landing.component.scss']
})
export class AllLandingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


}
