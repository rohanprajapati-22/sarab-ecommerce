import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-hours',
  styleUrl: './hours.css',
  templateUrl: './hours.html',
  standalone: true,
})
export class Hours {
  rows = [
    { day: 'Monday - Tuesday', time: 'Closed', open: false },
    { day: 'Wednesday - Thursday', time: '09:00 AM - 10:00 PM', open: true },
    { day: 'Friday', time: '09:00 AM - 11:00 PM', open: true },
    { day: 'Saturday', time: '10:00 AM - 11:30 PM', open: true },
    { day: 'Sunday', time: '11:00 AM - 09:00 PM', open: true },
  ];
}
