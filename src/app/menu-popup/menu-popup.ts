import { Component, effect } from '@angular/core';
import { UiService, MenuItem } from '../ui.service';

@Component({
  imports: [],
  selector: 'app-menu-popup',
  styleUrl: './menu-popup.css',
  templateUrl: './menu-popup.html',
  standalone: true,
})
export class MenuPopup {
  qty = 1;

  constructor(public ui: UiService) {
    effect(() => {
      if (this.ui.menuPopupOpen()) {
        this.qty = 1;
      }
    });
  }

  // Read directly from the service signals in the template
  get item(): MenuItem | null {
    return this.ui.selectedItem();
  }

  get open(): boolean {
    return this.ui.menuPopupOpen();
  }

  get starArr(): number[] {
    const stars = this.item ? Math.round(this.item.rating) : 0;
    return Array.from({ length: stars }, () => 0);
  }

  get emptyArr(): number[] {
    const stars = this.item ? Math.round(this.item.rating) : 0;
    return Array.from({ length: 5 - stars }, () => 0);
  }

  close() {
    this.ui.closeMenu();
  }

  plus() {
    this.qty++;
  }
  minus() {
    if (this.qty > 1) this.qty--;
  }

  addCart() {
    if (!this.item) return;
    this.ui.addToCart(this.item, this.qty);
    const btn = document.getElementById('mpAddCart');
    if (btn) {
      btn.innerHTML = '<i class="fas fa-check"></i> Added to Cart!';
      (btn as HTMLElement).style.background = 'linear-gradient(135deg,var(--green),#1a4a35)';
      setTimeout(() => {
        this.ui.closeMenu();
        btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
        (btn as HTMLElement).style.background = '';
      }, 1000);
    } else {
      this.ui.closeMenu();
    }
  }
}
