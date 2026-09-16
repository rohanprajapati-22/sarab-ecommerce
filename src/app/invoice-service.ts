import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { Observable } from 'rxjs';

export interface InvoiceItem {
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface InvoicePayment {
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string;
  createdAt: string;
}

export interface Invoice {
  invoiceNumber: string;
  orderId: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  orderDate: string;
  orderStatus: string;
  paymentStatus: string;
  items: InvoiceItem[];
  totalAmount: number;
  payment?: InvoicePayment;
}

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private http = inject(HttpClient);

  private apiUrl = '/api/Invoice';

  getInvoice(orderId: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${orderId}`);
  }
}