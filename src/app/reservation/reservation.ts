import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { MenuService, ReservationData, ReservationResponse } from '../menu.service';

@Component({
  imports: [FormsModule],
  selector: 'app-reservation',
  styleUrl: './reservation.css',
  templateUrl: './reservation.html',
  standalone: true,
})
export class Reservation {
  ok: boolean = false;
  isReserving: boolean = false;

  reservationData: ReservationData = {
    fullName: '',
    phone: '',
    email: '',
    numberOfGuests: '1 Person',
    reservationDate: '',
    reservationTime: '09:00 AM',
    specialRequests: ''
  };

  constructor(private menuService: MenuService,private cdr: ChangeDetectorRef) {}

  reserve(): void {

    if (this.isReserving) {
      return;
    }

    this.ok = false;

    // Validation
    if (!this.reservationData.fullName.trim()) {
      alert('Please enter your full name.');
      return;
    }

    if (!this.reservationData.phone.trim()) {
      alert('Please enter your phone number.');
      return;
    }

    if (!this.reservationData.email.trim()) {
      alert('Please enter your email address.');
      return;
    }

    if (!this.reservationData.numberOfGuests) {
      alert('Please select number of guests.');
      return;
    }

    if (!this.reservationData.reservationDate) {
      alert('Please select reservation date.');
      return;
    }

    if (!this.reservationData.reservationTime) {
      alert('Please select reservation time.');
      return;
    }

    this.isReserving = true;
    this.cdr.detectChanges();

    this.menuService.reserveTable(this.reservationData).subscribe({
      
      next: (response: ReservationResponse) => {

        this.isReserving = false;

        this.ok = true;
        this.cdr.detectChanges();

        this.reservationData = {
          fullName: '',
          phone: '',
          email: '',
          numberOfGuests: '1 Person',
          reservationDate: '',
          reservationTime: '09:00 AM',
          specialRequests: ''
        };
         this.cdr.detectChanges();
      },

      error: (error) => {
        this.isReserving = false;

        this.ok = false;
         this.cdr.detectChanges();

        alert(
          error?.error?.message ||
          'Unable to create reservation. Please try again.'
        );
      }
    });
  }
}
