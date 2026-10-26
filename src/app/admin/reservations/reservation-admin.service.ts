import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface AdminReservation {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  numberOfGuests: string;
  reservationDate: string;
  reservationTime: string;
  specialRequests: string | null;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ReservationAdminService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/Reservation';

  getAll(): Observable<AdminReservation[]> {
    return this.http.get<AdminReservation[]>(this.apiUrl);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
