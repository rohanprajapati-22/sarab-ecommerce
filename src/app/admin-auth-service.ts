import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginRequest, AuthResponse } from './auth-service';

export function isAdminRole(role?: string | null): boolean {
  return isAdminRoleValue(role);
}

function isAdminRoleValue(role?: string | null): boolean {
  return !!role && role.toLowerCase() === 'admin';
}

/**
 * Separately stored admin session so that logging into the admin panel
 * does NOT also sign the admin in as a storefront customer (which is what
 * let the admin place orders on the landing page).
 */
@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private http = inject(HttpClient);

  private readonly apiUrl = '/api/Auth';
  private readonly TOKEN_KEY = 'admin_token';
  private readonly USER_KEY = 'admin_user';

  readonly admin = signal<AuthResponse | null>(null);
  readonly isAdminAuthenticated = computed(() => !!this.admin());
  readonly isAdmin = computed(() => isAdminRole(this.admin()?.role));

  constructor() {
    // Admin session is intentionally kept in memory only (not restored from
    // localStorage), so every visit to /admin/orders requires an explicit
    // admin login instead of silently resuming an old session.
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((res) => this.saveAdmin(res))
    );
  }

  logout(): void {
    this.clearAdmin();
  }

  private saveAdmin(res: AuthResponse): void {
    const adminRes = { ...res, role: res.role ?? 'admin' };
    this.admin.set(adminRes);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(this.TOKEN_KEY, adminRes.token);
      window.localStorage.setItem(this.USER_KEY, JSON.stringify(adminRes));
    }
  }

  private clearAdmin(): void {
    this.admin.set(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(this.TOKEN_KEY);
      window.localStorage.removeItem(this.USER_KEY);
    }
  }
}
