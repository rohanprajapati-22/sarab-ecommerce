import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService, Order, OrderItem } from '../../order-service';
import { orderStatusClass } from './orders-list';

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
    const el = document.getElementById('invoicePdfArea');
    if (!order || !el || this.generatingPdf()) return;

    this.generatingPdf.set(true);
    try {
      const jsPDF = (await import('jspdf')).jsPDF;
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${this.invoiceNumber}.pdf`);
    } finally {
      this.generatingPdf.set(false);
    }
  }
}