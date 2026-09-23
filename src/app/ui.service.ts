import { Injectable, signal, computed } from '@angular/core';

export interface MenuItem {
  id?: number;
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

export interface CartItem {
  item: MenuItem;
  qty: number;
}

@Injectable({ 
  providedIn: 'root'
 })
export class UiService {
  
  readonly searchOpen = signal<boolean>(false);
  readonly menuPopupOpen = signal<boolean>(false);
  readonly galleryPopupOpen = signal<boolean>(false);
  readonly selectedItem = signal<MenuItem | null>(null);
  readonly galleryItems = signal<GalleryItem[]>([]);
  readonly galleryIndex = signal<number>(0);
  readonly cartItems = signal<CartItem[]>([]);
  readonly cartCount = computed<number>(() =>
    this.cartItems().reduce((sum, ci) => sum + ci.qty, 0)
  );
  readonly cartTotal = computed<number>(() =>
    this.cartItems().reduce((sum, ci) => sum + this.parsePrice(ci.item.price) * ci.qty, 0)
  );
  readonly activeCategory = signal<string>('all');

  private static readonly CART_STORAGE_KEY = 'sarab_cart_items';

  constructor() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(UiService.CART_STORAGE_KEY);
      if (raw) {
        try {
          const parsed: CartItem[] = JSON.parse(raw);
          this.cartItems.set(
            parsed.filter((ci) => !!ci && !!ci.item && typeof ci.item.title === 'string')
          );
        } catch {
          this.cartItems.set([]);
        }
      }
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

  parsePrice(price: string | number): number {
    return parseFloat(String(price).replace(/[^0-9.]/g, '')) || 0;
  }

  formatPrice(price: string | number): string {
    const s = String(price);
    return /[$€£₹]/.test(s) ? s : '€' + s;
  }

  addToCart(item: MenuItem, qty: number) {
    this.cartItems.update((items) => {
      const existing = items.find((ci) => ci.item.title === item.title);
      if (existing) {
        return items.map((ci) =>
          ci.item.title === item.title ? { ...ci, qty: ci.qty + qty } : ci
        );
      }
      return [...items, { item, qty }];
    });
    this.persistCart();
  }

  updateQty(title: string, qty: number) {
    if (qty < 1) qty = 1;
    this.cartItems.update((items) =>
      items.map((ci) => (ci.item.title === title ? { ...ci, qty } : ci))
    );
    this.persistCart();
  }

  removeItem(title: string) {
    this.cartItems.update((items) => items.filter((ci) => ci.item.title !== title));
    this.persistCart();
  }

  clearCart() {
    this.cartItems.set([]);
    this.persistCart();
  }

  private persistCart() {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(UiService.CART_STORAGE_KEY, JSON.stringify(this.cartItems()));
    }
  }

  private lockScroll(lock: boolean) {
    document.body.style.overflow = lock ? 'hidden' : '';
  }
}
