import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UiService } from '../ui.service';
import { AuthService } from '../auth-service';

@Component({
  imports: [],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
  standalone: true,
})
export class Navbar implements OnInit, OnDestroy {
  navOpen = false;

  constructor(
    private ui: UiService,
    private router: Router,
    public auth: AuthService
  ) {}

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

  goToLogin() {
    this.navOpen = false;
    this.router.navigate(['/login']);
  }

  logout() {
    this.navOpen = false;
    this.auth.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {}
}
