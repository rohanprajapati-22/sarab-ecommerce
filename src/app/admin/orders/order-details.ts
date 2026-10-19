import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService, Order, OrderItem } from '../../order-service';
import { orderStatusClass } from './orders-list';
import { InvoicePdfService } from '../../invoice-pdf.service';
import { ToastService } from '../../toast.service';

@Component({
  imports: [RouterLink, DatePipe],
  selector: 'app-order-details',
  styleUrl: './order-details.css',
  templateUrl: './order-details.html',
  standalone: true,
})
export class OrderDetails {
  readonly order = signal<Order | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly generatingPdf = signal(false);

  private orderId = 0;

  constructor(
    route: ActivatedRoute,
    private orderService: OrderService,
    private invoicePdf: InvoicePdfService,
    private toaster: ToastService,
  ) {
    this.orderId = Number(route.snapshot.paramMap.get('id'));
    this.load();
  }

  get invoiceNumber(): string {
    return 'INV-' + String(this.orderId).padStart(5, '0');
  }

  load(): void {
    if (!this.orderId) {
      this.loading.set(false);
      this.error.set('Order not found.');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.orderService.getOrderById(this.orderId).subscribe({
      next: (res) => {
        this.order.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err?.error?.message ||
          err?.error?.title ||
          'Unable to load order details. Please try again.'
        );
      }
    });
  }

  total(order: Order): string {
    return '€' + (order.totalAmount ?? 0).toFixed(2);
  }

  unitPrice(item: OrderItem): string {
    return '€' + (item.price ?? 0).toFixed(2);
  }

  lineTotal(item: OrderItem): string {
    const subtotal = item.subtotal ?? (item.quantity ?? 0) * (item.price ?? 0);
    return '€' + subtotal.toFixed(2);
  }

  statusClass(status: string): string {
    return orderStatusClass(status);
  }

  printInvoice(): void {
    document.body.classList.add('invoice-print');
    window.print();
    document.body.classList.remove('invoice-print');
  }

  async downloadPdf(): Promise<void> {
    const order = this.order();
    if (!order || this.generatingPdf()) return;

    this.generatingPdf.set(true);
    try {
      await this.invoicePdf.download({
        invoiceNumber: this.invoiceNumber,
        orderId: order.id,
        customerName: order.customerName,
        email: order.email,
        phone: order.phone,
        address: order.address,
        orderDate: order.createdAt,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        items: order.items ?? [],
        totalAmount: order.totalAmount,
      });
      this.toaster.success('Invoice PDF downloaded.');
    } catch {
      this.toaster.error('Could not create the invoice PDF. Please try again.');
    } finally {
      this.generatingPdf.set(false);
    }
  }
}
