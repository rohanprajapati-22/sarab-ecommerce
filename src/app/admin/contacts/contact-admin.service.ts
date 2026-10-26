import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface AdminContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ContactAdminService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/Contact';

  getAll(): Observable<AdminContactMessage[]> {
    return this.http.get<AdminContactMessage[]>(this.apiUrl);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
