import { Component, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AdminReservation, ReservationAdminService } from './reservation-admin.service';
import { ToastService } from '../../toast.service';

@Component({
  imports: [DatePipe],
  selector: 'app-reservations-list',
  styleUrl: './reservations-list.css',
  templateUrl: './reservations-list.html',
  standalone: true,
})
export class ReservationsList {
  readonly reservations = signal<AdminReservation[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly selected = signal<AdminReservation | null>(null);

  constructor(
    private readonly reservationService: ReservationAdminService,
    private readonly toaster: ToastService
  ) {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.selected.set(null);

    this.reservationService.getAll().subscribe({
      next: (res) => {
        this.reservations.set(res ?? []);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err?.error?.message ||
          err?.error?.title ||
          'Unable to load reservations. Please try again.'
        );
      },
    });
  }

  open(reservation: AdminReservation): void {
    this.selected.set(reservation);
  }

  close(): void {
    this.selected.set(null);
  }

  remove(reservation: AdminReservation): void {
    if (!window.confirm(`Delete the reservation for \u201c${reservation.fullName}\u201d?`)) {
      return;
    }

    this.reservationService.remove(reservation.id).subscribe({
      next: () => {
        this.toaster.success('Reservation deleted.');
        if (this.selected()?.id === reservation.id) {
          this.selected.set(null);
        }
        this.load();
      },
      error: (err) => {
        this.toaster.error(
          err?.error?.message || 'Unable to delete the reservation. Please try again.'
        );
      },
    });
  }

  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.reservations().length / this.pageSize))
  );

  readonly paginatedReservations = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.reservations().slice(start, start + this.pageSize);
  });

  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
    }
  }
}
