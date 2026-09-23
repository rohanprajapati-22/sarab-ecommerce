import { Component, HostListener, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Navbar } from './navbar/navbar';
import { SearchOverlay } from './search-overlay/search-overlay';
import { MenuPopup } from './menu-popup/menu-popup';
import { GalleryPopup } from './gallery-popup/gallery-popup';
import { CartFloating } from './cart-floating/cart-floating';
import { BackToTop } from './back-to-top/back-to-top';
import { UiService } from './ui.service';

declare const AOS: any;

@Component({
  imports: [
    Navbar,
    SearchOverlay,
    MenuPopup,
    GalleryPopup,
    CartFloating,
    BackToTop,
    RouterOutlet,
  ],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  readonly isAdminRoute = signal(false);

  private lastScrollY = 0;
  private clickHandler = (e: Event) => this.onAnchorClick(e);
  private routerSub?: Subscription;

  constructor(
    private ui: UiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isAdminRoute.set(this.router.url.startsWith('/admin'));
    this.routerSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) =>
        this.isAdminRoute.set(e.urlAfterRedirects.startsWith('/admin'))
      );
  }

  ngAfterViewInit() {
    if (typeof AOS !== 'undefined') {
      AOS.init({ duration: 680, once: true, offset: 55 });
    }
    this.attachSmoothScroll();
    this.setupScrollSpy();
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
    document.removeEventListener('click', this.clickHandler);
    if ((this as any)._onScroll) window.removeEventListener('scroll', (this as any)._onScroll);
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this.ui.toggleSearch(false);
      this.ui.closeMenu();
      this.ui.closeGallery();
    }
  }

  private onAnchorClick(e: Event) {
    const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const top = (target as HTMLElement).offsetTop - 78;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  private attachSmoothScroll() {
    document.addEventListener('click', this.clickHandler);
  }

  private setupScrollSpy() {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const current = window.scrollY;
          document.querySelectorAll('section[id]').forEach((sec) => {
            const el = sec as HTMLElement;
            const top = el.offsetTop - 110;
            const bottom = top + el.offsetHeight;
            if (current >= top && current < bottom) {
              const id = sec.getAttribute('id');
              document.querySelectorAll('.nav-link').forEach((l) => {
                const link = l as HTMLAnchorElement;
                link.classList.toggle(
                  'active',
                  link.getAttribute('href') === '#' + id
                );
              });
            }
          });
          ticking = false;
          this.lastScrollY = current;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll);
    (this as any)._onScroll = onScroll;
  }
}
