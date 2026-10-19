import { Component, signal, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UiService, CartItem } from '../ui.service';
import { OrderService, CreateOrder, CreateOrderItem, OrderResponse } from '../order-service';
import { Payment } from '../payment/payment';
import { AuthService } from '../auth-service';
import { ToastService } from '../toast.service';

@Component({
  imports: [FormsModule, Payment],
  selector: 'app-cart-page',
  styleUrl: './cart-page.css',
  templateUrl: './cart-page.html',
  standalone: true,
  encapsulation: ViewEncapsulation.None
})
export class CartPage {
  readonly showCheckout = signal<boolean>(false);
  readonly showPayment = signal<boolean>(false);
  readonly isPlacing = signal<boolean>(false);
  readonly error = signal<string>('');
  readonly orderResult = signal<OrderResponse | null>(null);

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
    private auth: AuthService,
    private toaster: ToastService
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
    return '€' + this.ui.cartTotal().toFixed(2);
  }

  get total(): string {
    return '€' + this.ui.cartTotal().toFixed(2);
  }

  lineTotal(ci: CartItem): string {
    return '€' + (this.ui.parsePrice(ci.item.price) * ci.qty).toFixed(2);
  }

  changeQty(ci: CartItem, delta: number) {
    this.ui.updateQty(ci.item.title, ci.qty + delta);
  }

  remove(title: string) {
    this.ui.removeItem(title);
    this.toaster.info(`${title} removed from your cart.`);
  }

  clear() {
    if (!this.ui.cartItems().length) return;
    this.ui.clearCart();
    this.toaster.info('Your cart has been cleared.');
  }

  proceedToCheckout() {
    this.error.set('');
    
    if (!this.auth.isAuthenticated()) {
      this.toaster.info('Please log in to continue to checkout.');
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
        this.toaster.success(`Order #${res.orderId} placed! Complete payment to confirm.`);
      },
      error: (err) => {
        this.isPlacing.set(false);
        const message = err?.error?.message || 'Unable to place your order. Please try again.';
        this.error.set(message);
        this.toaster.error(message);
      },
    });
  }

  onPaid(): void {
    this.showPayment.set(false);
    this.toaster.success('Payment successful! Your order is confirmed.');
    const orderId = this.orderResult()?.orderId;
    if (orderId) {
      this.router.navigate(['/order-confirmation', orderId]);
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }

  cancelPayment() {
    const res = this.orderResult();
    const status = (res?.orderStatus ?? '').toLowerCase();

    if (res && status === 'pending') {
      this.orderService.updateOrderStatus(res.orderId, {
        orderStatus: 'Cancelled',
      }).subscribe({
        next: () => {
          this.toaster.info(`Order #${res.orderId} has been cancelled.`);
          this.goHome();
        },
        error: () => {
          this.toaster.error('We could not update the order cancellation. Please contact support.');
          this.goHome();
        },
      });
      return;
    }

    this.goHome();
  }
}
