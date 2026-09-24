import { Component, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService, Order } from '../../order-service';

export function orderStatusClass(status: string): string {
  const s = (status || '').toLowerCase();
  if (s.includes('cancel') || s.includes('expired') || s.includes('refund') || s.includes('fail')) {
    return 'info-badge-danger';
  }
  if (
    s.includes('paid') ||
    s.includes('complete') ||
    s.includes('confirmed') ||
    s.includes('delivered')
  ) {
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
        const sortedOrders = (res ?? []).sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
        this.orders.set(sortedOrders);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err?.error?.message || err?.error?.title || 'Unable to load orders. Please try again.',
        );
      },
    });
  }

  total(order: Order): string {
    return '€' + (order.totalAmount ?? 0).toFixed(2);
  }

  statusClass(status: string): string {
    return orderStatusClass(status);
  }

  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly totalPages = computed(() => Math.ceil(this.orders().length / this.pageSize));

  readonly paginatedOrders = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.orders().slice(start, start + this.pageSize);
  });

  readonly pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
    }
  }
}
