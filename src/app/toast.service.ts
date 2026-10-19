import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly current = signal<ToastMessage | null>(null);
  private timeout?: ReturnType<typeof setTimeout>;
  private nextId = 0;

  success(message: string, duration = 3800): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 5200): void {
    this.show(message, 'error', duration);
  }

  info(message: string, duration = 3800): void {
    this.show(message, 'info', duration);
  }

  dismiss(id?: number): void {
    if (id !== undefined && this.current()?.id !== id) return;
    if (this.timeout) clearTimeout(this.timeout);
    this.current.set(null);
  }

  private show(message: string, type: ToastType, duration: number): void {
    if (this.timeout) clearTimeout(this.timeout);
    const toast: ToastMessage = {
      id: ++this.nextId,
      type,
      message,
      duration,
    };
    this.current.set(toast);
    this.timeout = setTimeout(() => this.dismiss(toast.id), duration);
  }
}
