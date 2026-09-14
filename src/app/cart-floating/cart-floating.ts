import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UiService } from '../ui.service';

@Component({
  imports: [],
  selector: 'app-cart-floating',
  styleUrl: './cart-floating.css',
  templateUrl: './cart-floating.html',
  standalone: true,
})
export class CartFloating {
  constructor(public ui: UiService, private router: Router) {}

  get count(): number {
    return this.ui.cartCount();
  }

  openCart() {
    this.router.navigate(['/cart']);
  }
}