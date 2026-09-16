import { Component, inject, input, signal, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderResponse } from '../order-service';
import { PaymentResponse } from '../payment-service';
import { InvoiceService, Invoice as InvoiceModel } from '../invoice-service';

@Component({
  selector: 'app-invoice',
  imports: [CommonModule],
  templateUrl: './invoice.html',
  styleUrl: './invoice.css',
  standalone: true,
})
export class Invoice implements OnInit {
  orderId = input.required<number>();
  order = input<OrderResponse | null>(null);
  payment = input<PaymentResponse | null>(null);

  private invoiceService = inject(InvoiceService);
  private router = inject(Router);

  readonly invoice = signal<InvoiceModel | null>(null);
  readonly loading = signal<boolean>(false);

  ngOnInit() {
    this.loadInvoice();
  }

  private loadInvoice() {
    const id = this.orderId();
    if (!id) {
      this.loading.set(false);
      return;
    }

    this.loading.set(true);

    this.invoiceService.getInvoice(id).subscribe({
      next: (inv) => {
        this.loading.set(false);
        this.invoice.set(inv);
      },
      error: () => {
        this.loading.set(false);
        this.invoice.set(null);
      },
    });
  }

  print() {
    document.body.classList.add('invoice-print');
    window.print();
    document.body.classList.remove('invoice-print');
  }

  goHome() {
    this.router.navigate(['/']);
  }
}