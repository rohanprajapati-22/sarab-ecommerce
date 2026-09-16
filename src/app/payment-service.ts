import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface PaymentRequest {
  orderId: number;
  paymentMethod: string;
  cardNumber: string;
}

export interface PaymentResponse {
  message: string;
  paymentId: number;
  transactionId: string;
  paymentStatus: string;
}

export interface StripePaymentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
}

export interface UpdatePaymentRequest {
  orderId: number;
  paymentIntentId: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);

  private apiUrl = '/api/Payment';

  private orderApiUrl = '/api/order';

  makePayment(payment: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(this.apiUrl, payment);
  }

  createStripePayment(orderId: number): Observable<StripePaymentResponse> {
    return this.http.post<StripePaymentResponse>(`${this.apiUrl}/create`, Number(orderId));
  }

  confirmPayment(payload: UpdatePaymentRequest): Observable<unknown> {
    return this.http.post(`${this.orderApiUrl}/payment-success`, payload);
  }
}