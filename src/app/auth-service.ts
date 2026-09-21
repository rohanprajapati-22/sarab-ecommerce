import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private readonly apiUrl = '/api/Auth';
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'auth_user';

  readonly user = signal<AuthResponse | null>(null);
  readonly isAuthenticated = computed(() => !!this.user());

  constructor() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = window.localStorage.getItem(this.TOKEN_KEY);
      const raw = window.localStorage.getItem(this.USER_KEY);
      if (token && raw) {
        try {
          this.user.set(JSON.parse(raw));
          return;
        } catch {
          // fall through and clear the stale session
        }
        this.clearSession();
      }
    }
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap((res) => this.saveSession(res))
    );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((res) => this.saveSession(res))
    );
  }

  logout(): void {
    this.clearSession();
  }

  private saveSession(res: AuthResponse): void {
    this.user.set(res);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(this.TOKEN_KEY, res.token);
      window.localStorage.setItem(this.USER_KEY, JSON.stringify(res));
    }
  }

  private clearSession(): void {
    this.user.set(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(this.TOKEN_KEY);
      window.localStorage.removeItem(this.USER_KEY);
    }
  }
}