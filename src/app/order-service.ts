import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { Observable } from 'rxjs';
export interface CreateOrderItem {
  menuId: number;
  quantity: number;
}

export interface CreateOrder {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: CreateOrderItem[];
  userId?: number;
}

export interface OrderResponse {
  message: string;
  orderId: number;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);

  private apiUrl = '/api/Order';

  createOrder(order: CreateOrder): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(
      this.apiUrl,
      order
    );
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }
}

export interface Order {
  orderId: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  orderDate: string;
  items: OrderItem[];
}

export interface OrderItem {
  menuId: number;
  menuName: string;
  quantity: number;
  unitPrice: number;
}
