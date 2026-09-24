import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export interface SnackbarOptions {
  duration?: number;
  action?: string;
}

type SnackbarType = 'success' | 'error' | 'info';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private snackBar = inject(MatSnackBar);

  success(message: string, options: SnackbarOptions = {}): void {
    this.open(message, 'success', options);
  }

  error(message: string, options: SnackbarOptions = {}): void {
    this.open(message, 'error', options);
  }

  info(message: string, options: SnackbarOptions = {}): void {
    this.open(message, 'info', options);
  }

  private open(
    message: string,
    type: SnackbarType,
    options: SnackbarOptions
  ): void {
    const config: MatSnackBarConfig = {
      duration: options.duration ?? 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-' + type],
    };
    this.snackBar.open(message, options.action ?? 'Close', config);
  }
}