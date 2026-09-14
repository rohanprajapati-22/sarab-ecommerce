import { Component, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { SearchOverlay } from './search-overlay/search-overlay';
import { Hero } from './hero/hero';
import { Marquee } from './marquee/marquee';
import { Category } from './category/category';
import { About } from './about/about';
import { Menu } from './menu/menu';
import { MenuPopup } from './menu-popup/menu-popup';
import { SpecialOffer } from './special-offer/special-offer';
import { Gallery } from './gallery/gallery';
import { GalleryPopup } from './gallery-popup/gallery-popup';
import { History } from './history/history';
import { Chefs } from './chefs/chefs';
import { Hours } from './hours/hours';
import { Testimonials } from './testimonials/testimonials';
import { Reservation } from './reservation/reservation';
import { Blog } from './blog/blog';
import { Newsletter } from './newsletter/newsletter';
import { Contact } from './contact/contact';
import { Footer } from './footer/footer';
import { CartFloating } from './cart-floating/cart-floating';
import { BackToTop } from './back-to-top/back-to-top';
import { UiService } from './ui.service';

declare const AOS: any;

@Component({
  imports: [
    Navbar,
    SearchOverlay,
    Hero,
    Marquee,
    Category,
    About,
    Menu,
    MenuPopup,
    SpecialOffer,
    Gallery,
    GalleryPopup,
    History,
    Chefs,
    Hours,
    Testimonials,
    Reservation,
    Blog,
    Newsletter,
    Contact,
    Footer,
    CartFloating,
    BackToTop,
  ],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements AfterViewInit, OnDestroy {
  private lastScrollY = 0;
  private clickHandler = (e: Event) => this.onAnchorClick(e);

  constructor(private ui: UiService) {}

  ngAfterViewInit() {
    if (typeof AOS !== 'undefined') {
      AOS.init({ duration: 680, once: true, offset: 55 });
    }
    this.attachSmoothScroll();
    this.setupScrollSpy();
  }

  ngOnDestroy() {
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
