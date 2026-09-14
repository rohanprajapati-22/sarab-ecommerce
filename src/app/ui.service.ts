import { Injectable, signal } from '@angular/core';

export interface MenuItem {
  category: string;
  title: string;
  image: string;
  price: string;
  oldPrice?: string;
  rating: number;
  reviews: number;
  calories: number;
  prepTime: number;
  description: string;
  tags: string[];
  badge?: { text: string; type?: 'hot' | 'new' };
}

export interface GalleryItem {
  img: string;
  title: string;
  desc: string;
}

@Injectable({ providedIn: 'root' })
export class UiService {
  // Signals give all components live access to shared UI state.
  readonly searchOpen = signal<boolean>(false);
  readonly menuPopupOpen = signal<boolean>(false);
  readonly galleryPopupOpen = signal<boolean>(false);
  readonly selectedItem = signal<MenuItem | null>(null);
  readonly galleryItems = signal<GalleryItem[]>([]);
  readonly galleryIndex = signal<number>(0);
  readonly cartCount = signal<number>(0);
  readonly activeCategory = signal<string>('all');

  constructor() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const c = window.localStorage.getItem('sarab_cart');
      if (c) this.cartCount.set(parseInt(c, 10) || 0);
    }
  }

  toggleSearch(open: boolean) {
    this.searchOpen.set(open);
    this.lockScroll(open);
  }

  openMenu(item: MenuItem) {
    this.selectedItem.set(item);
    this.menuPopupOpen.set(true);
    this.lockScroll(true);
  }

  closeMenu() {
    this.menuPopupOpen.set(false);
    this.lockScroll(false);
  }

  setGallery(items: GalleryItem[]) {
    this.galleryItems.set(items);
  }

  openGallery(index: number) {
    this.galleryIndex.set(index);
    this.galleryPopupOpen.set(true);
    this.lockScroll(true);
  }

  closeGallery() {
    this.galleryPopupOpen.set(false);
    this.lockScroll(false);
  }

  addToCart(qty: number) {
    this.cartCount.update((count) => count + qty);
    if (window.localStorage) {
      window.localStorage.setItem('sarab_cart', String(this.cartCount()));
    }
  }

  private lockScroll(lock: boolean) {
    document.body.style.overflow = lock ? 'hidden' : '';
  }
}
