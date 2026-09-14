import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuItem } from './ui.service';

export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}
export interface ContactResponse {
  message: string;
  id: number;
}
export interface ReservationData {
  fullName: string;
  phone: string;
  email: string;
  numberOfGuests: string;
  reservationDate: string;
  reservationTime: string;
  specialRequests: string;
}

export interface ReservationResponse {
  message: string;
  id: number;
}
@Injectable({ providedIn: 'root' })
export class MenuService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/Menu';

  getMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(this.apiUrl);
  }

    sendContactMessage(data: ContactMessage): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(
      `/api/Contact`,
      data
    );
  }

  reserveTable(data: ReservationData): Observable<ReservationResponse> {
  return this.http.post<ReservationResponse>(
    `/api/reservation`,
    data
  );
}

  getChefsData(): Observable<any[]>{
    return this.http.get<any[]>(`/api/chef`);
  }
}