import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { UiService } from '../ui.service';

@Component({
  imports: [],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
  standalone: true,
})
export class Navbar implements OnInit, OnDestroy {
  navOpen = false;

  constructor(private ui: UiService) {}

  ngOnInit(): void {}

  @HostListener('window:scroll', [])
  onScroll() {
    const nav = document.getElementById('nav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
  }

  toggleNav() {
    this.navOpen = !this.navOpen;
  }

  openSearch() {
    this.ui.toggleSearch(true);
  }

  ngOnDestroy(): void {}
}
