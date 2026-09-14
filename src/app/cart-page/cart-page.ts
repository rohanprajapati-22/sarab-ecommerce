import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UiService, CartItem } from '../ui.service';

@Component({
  imports: [],
  selector: 'app-cart-page',
  styleUrl: './cart-page.css',
  templateUrl: './cart-page.html',
  standalone: true,
})
export class CartPage {
  readonly checkoutDone = signal<boolean>(false);

  constructor(public ui: UiService, private router: Router) {}

  get items(): CartItem[] {
    return this.ui.cartItems();
  }

  get subtotal(): string {
    return '$' + this.ui.cartTotal().toFixed(2);
  }

  get total(): string {
    return '$' + this.ui.cartTotal().toFixed(2);
  }

  lineTotal(ci: CartItem): string {
    return '$' + (this.ui.parsePrice(ci.item.price) * ci.qty).toFixed(2);
  }

  changeQty(ci: CartItem, delta: number) {
    this.ui.updateQty(ci.item.title, ci.qty + delta);
  }

  remove(title: string) {
    this.ui.removeItem(title);
  }

  clear() {
    this.ui.clearCart();
  }

  checkout() {
    this.checkoutDone.set(true);
    this.ui.clearCart();
  }

  goHome() {
    this.router.navigate(['/']);
  }
}