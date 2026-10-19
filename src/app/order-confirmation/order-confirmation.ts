import { Component, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Invoice, InvoiceService } from '../invoice-service';
import { InvoicePdfService } from '../invoice-pdf.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-confirmation.html',
  styleUrl: './order-confirmation.css',
})
export class OrderConfirmation {
  readonly orderId: number;
  readonly invoice = signal<Invoice | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly generatingPdf = signal(false);

  constructor(
    route: ActivatedRoute,
    private invoiceService: InvoiceService,
    private invoicePdf: InvoicePdfService,
    private toaster: ToastService,
  ) {
    this.orderId = Number(route.snapshot.paramMap.get('id'));
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    this.load();
  }

  load(): void {
    if (!Number.isInteger(this.orderId) || this.orderId <= 0) {
      this.loading.set(false);
      this.error.set('We could not find that order. Check the order number and try again.');
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.invoiceService.getInvoice(this.orderId).subscribe({
      next: (invoice) => {
        this.invoice.set(invoice);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err?.error?.message || 'We could not load your order details. Please try again.'
        );
      },
    });
  }

  get paymentComplete(): boolean {
    const status = this.invoice()?.paymentStatus?.toLowerCase();
    return status === 'paid' || status === 'succeeded';
  }

  money(amount: number): string {
    return `€${(amount ?? 0).toFixed(2)}`;
  }

  print(): void {
    window.print();
  }

  async downloadInvoice(): Promise<void> {
    const order = this.invoice();
    if (!order || this.generatingPdf()) return;

    this.generatingPdf.set(true);
    try {
      await this.invoicePdf.download(order);
      this.toaster.success('Your invoice PDF has been downloaded.');
    } catch {
      this.toaster.error('Could not create the invoice PDF. Please use Print confirmation instead.');
    } finally {
      this.generatingPdf.set(false);
    }
  }
}
