import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuService, ReservationData, ReservationResponse } from '../menu.service';
import { ToastService } from '../toast.service';

@Component({
  imports: [FormsModule],
  selector: 'app-reservation',
  styleUrl: './reservation.css',
  templateUrl: './reservation.html',
  standalone: true,
})
export class Reservation {
  readonly isReserving = signal(false);

  reservationData: ReservationData = {
    fullName: '',
    phone: '',
    email: '',
    numberOfGuests: '1 Person',
    reservationDate: '',
    reservationTime: '09:00 AM',
    specialRequests: ''
  };

  constructor(private menuService: MenuService, private toaster: ToastService) {}

  reserve(): void {

    if (this.isReserving()) {
      return;
    }

    // Validation
    if (!this.reservationData.fullName.trim()) {
      this.toaster.error('Please enter your full name.');
      return;
    }

    if (!this.reservationData.phone.trim()) {
      this.toaster.error('Please enter your phone number.');
      return;
    }

    if (!this.reservationData.email.trim()) {
      this.toaster.error('Please enter your email address.');
      return;
    }

    if (!this.reservationData.numberOfGuests) {
      this.toaster.error('Please select number of guests.');
      return;
    }

    if (!this.reservationData.reservationDate) {
      this.toaster.error('Please select reservation date.');
      return;
    }

    if (!this.reservationData.reservationTime) {
      this.toaster.error('Please select reservation time.');
      return;
    }

    this.isReserving.set(true);

    this.menuService.reserveTable(this.reservationData).subscribe({
      
      next: (response: ReservationResponse) => {

        this.isReserving.set(false);
        this.toaster.success(`Reservation request sent${response?.id ? ` (#${response.id})` : ''}. We'll confirm shortly.`);

        this.reservationData = {
          fullName: '',
          phone: '',
          email: '',
          numberOfGuests: '1 Person',
          reservationDate: '',
          reservationTime: '09:00 AM',
          specialRequests: ''
        };
      },

      error: (error) => {
        this.isReserving.set(false);
        this.toaster.error(
          error?.error?.message ||
          'Unable to create reservation. Please try again.'
        );
      }
    });
  }
}
