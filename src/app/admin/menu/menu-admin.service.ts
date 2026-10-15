import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface AdminMenuItem {
  id: number;
  category: string;
  title: string;
  image: string | null;
  price: number;
  oldPrice: number | null;
  rating: number;
  reviews: number;
  calories: number;
  prepTime: number;
  description: string | null;
  tags: string[];
  badge: { text: string; type?: string | null } | null;
  isActive: boolean;
}

export type MenuPayload = Omit<AdminMenuItem, 'id' | 'badge'> & {
  badgeText: string | null;
  badgeType: string | null;
};

@Injectable({ providedIn: 'root' })
export class MenuAdminService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/Menu';

  getAll(): Observable<AdminMenuItem[]> {
    return this.http.get<AdminMenuItem[]>(`${this.apiUrl}/admin/all`);
  }

  create(menu: MenuPayload): Observable<AdminMenuItem> {
    return this.http.post<AdminMenuItem>(this.apiUrl, menu);
  }

  update(id: number, menu: MenuPayload): Observable<AdminMenuItem> {
    return this.http.put<AdminMenuItem>(`${this.apiUrl}/${id}`, menu);
  }

  deactivate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadImage(file: File): Observable<{ image: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ image: string }>(`${this.apiUrl}/images`, formData);
  }
}
