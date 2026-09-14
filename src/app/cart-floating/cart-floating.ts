import { Component } from '@angular/core';
import { UiService } from '../ui.service';

@Component({
  imports: [],
  selector: 'app-cart-floating',
  styleUrl: './cart-floating.css',
  templateUrl: './cart-floating.html',
  standalone: true,
})
export class CartFloating {
  constructor(public ui: UiService) {}

  // Show the live cart count from the shared service
  get count(): number {
    return this.ui.cartCount();
  }

  scrollToMenu() {
    const menu = document.getElementById('menu');
    if (menu) window.scrollTo({ top: menu.offsetTop - 80, behavior: 'smooth' });
  }
}
