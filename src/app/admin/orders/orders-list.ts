import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService, Order } from '../../order-service';

export function orderStatusClass(status: string): string {
  const s = (status || '').toLowerCase();
  if (s.includes('cancel') || s.includes('refund')) return 'info-badge-danger';
  if (s.includes('paid') || s.includes('complete') || s.includes('confirmed') || s.includes('delivered')) {
    return 'info-badge-success';
  }
  if (s.includes('pending') || s.includes('processing')) return 'info-badge-warn';
  return 'info-badge-neutral';
}

@Component({
  imports: [RouterLink, DatePipe],
  selector: 'app-orders-list',
  styleUrl: './orders-list.css',
  templateUrl: './orders-list.html',
  standalone: true,
})
export class OrdersList {
  readonly orders = signal<Order[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  constructor(private orderService: OrderService) {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');

    this.orderService.getOrders().subscribe({
      next: (res) => {
        this.orders.set(res ?? []);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err?.error?.message ||
          err?.error?.title ||
          'Unable to load orders. Please try again.'
        );
      }
    });
  }

  total(order: Order): string {
    return '€' + (order.totalAmount ?? 0).toFixed(2);
  }

  statusClass(status: string): string {
    return orderStatusClass(status);
  }
}