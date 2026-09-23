import { Component, signal, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UiService, CartItem } from '../ui.service';
import { OrderService, CreateOrder, CreateOrderItem, OrderResponse } from '../order-service';
import { PaymentResponse } from '../payment-service';
import { Payment } from '../payment/payment';
import { Invoice } from '../invoice/invoice';
import { AuthService } from '../auth-service';

@Component({
  imports: [FormsModule, Payment, Invoice],
  selector: 'app-cart-page',
  styleUrl: './cart-page.css',
  templateUrl: './cart-page.html',
  standalone: true,
  encapsulation: ViewEncapsulation.None
})
export class CartPage {
  readonly checkoutDone = signal<boolean>(false);
  readonly showCheckout = signal<boolean>(false);
  readonly showPayment = signal<boolean>(false);
  readonly isPlacing = signal<boolean>(false);
  readonly error = signal<string>('');
  readonly orderResult = signal<OrderResponse | null>(null);
  readonly paymentResult = signal<PaymentResponse | null>(null);

  customer = {
    customerName: '',
    email: '',
    phone: '',
    address: '',
  };

  constructor(
    public ui: UiService,
    private router: Router,
    private orderService: OrderService,
    private auth: AuthService
  ) {
    const user = this.auth.user();
    if (user) {
      this.customer.customerName = user.name;
      this.customer.email = user.email;
    }
  }

  get items(): CartItem[] {
    return this.ui.cartItems();
  }

  get subtotal(): string {
    return '₹' + this.ui.cartTotal().toFixed(2);
  }

  get total(): string {
    return '₹' + this.ui.cartTotal().toFixed(2);
  }

  lineTotal(ci: CartItem): string {
    return '₹' + (this.ui.parsePrice(ci.item.price) * ci.qty).toFixed(2);
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

  proceedToCheckout() {
    this.error.set('');
    
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { return: '/cart' } });
      return;
    }

    this.showCheckout.set(true);
  }

  backToCart() {
    this.showCheckout.set(false);
    this.error.set('');
  }

  placeOrder() {
    if (this.isPlacing()) {
      return;
    }

   if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { return: '/cart' } });
      return;
    }

    this.error.set('');

    if (!this.customer.customerName.trim()) {
      this.error.set('Please enter your name.');
      return;
    }
    if (!this.customer.email.trim()) {
      this.error.set('Please enter your email address.');
      return;
    }
    if (!this.customer.phone.trim()) {
      this.error.set('Please enter your phone number.');
      return;
    }
    if (!this.customer.address.trim()) {
      this.error.set('Please enter your delivery address.');
      return;
    }

    const items: CreateOrderItem[] = this.ui.cartItems().map((ci) => ({
      menuId: ci.item.id ?? 0,
      quantity: ci.qty,
    }));

    if (items.some((i) => i.menuId === 0)) {
      this.error.set('Some items are missing product details. Please reload the menu and try again.');
      return;
    }

    const order: CreateOrder = {
      customerName: this.customer.customerName.trim(),
      email: this.customer.email.trim(),
      phone: this.customer.phone.trim(),
      address: this.customer.address.trim(),
      items,
      userId: this.auth.user()?.userId,
    };

    this.isPlacing.set(true);

    this.orderService.createOrder(order).subscribe({
      next: (res) => {
        this.isPlacing.set(false);
        this.orderResult.set(res);
        this.ui.clearCart();
        this.showPayment.set(true);
      },
      error: (err) => {
        this.isPlacing.set(false);
        this.error.set(err?.error?.message || 'Unable to place your order. Please try again.');
      },
    });
  }

  onPaid(res: PaymentResponse) {
    this.paymentResult.set(res);
    this.checkoutDone.set(true);
    this.showPayment.set(false);
  }

  goHome() {
    this.router.navigate(['/']);
  }
}