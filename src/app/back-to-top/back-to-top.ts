import { Component, HostListener } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-back-to-top',
  styleUrl: './back-to-top.css',
  templateUrl: './back-to-top.html',
  standalone: true,
})
export class BackToTop {
  show = false;

  @HostListener('window:scroll', [])
  onScroll() {
    this.show = window.scrollY > 300;
  }

  toTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
