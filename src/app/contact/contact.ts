import { Component } from '@angular/core';
import { ContactMessage, MenuService } from '../menu.service';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

@Component({
  imports: [FormsModule],
  selector: 'app-contact',
  styleUrl: './contact.css',
  templateUrl: './contact.html',
  standalone: true,
})
export class Contact {
  ok = false;
  isSending = false;

  contactData: ContactMessage = {
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  };

  constructor(private menuService: MenuService) {}

  send(): void {
    // Prevent multiple clicks
    if (this.isSending) {
      return;
    }

    // Hide previous success message
    this.ok = false;

    // Validation
    if (!this.contactData.name.trim()) {
      alert('Please enter your name.');
      return;
    }

    if (!this.contactData.email.trim()) {
      alert('Please enter your email address.');
      return;
    }

    if (!this.contactData.subject.trim()) {
      alert('Please select a subject.');
      return;
    }

    if (!this.contactData.message.trim()) {
      alert('Please enter your message.');
      return;
    }

    // Start Sending
    this.isSending = true;

    console.log('Sending data:', this.contactData);

    this.menuService
      .sendContactMessage(this.contactData)

      .pipe(
        // This ALWAYS runs when API finishes
        finalize(() => {
          console.log('API request finished');

          this.isSending = false;
        }),
      )

      .subscribe({
        next: (response) => {
          console.log('Message saved successfully:', response);

          // Show success message
          this.ok = true;

          // Clear form
          this.contactData = {
            name: '',
            email: '',
            phone: '',
            subject: 'General Inquiry',
            message: '',
          };
        },

        error: (error) => {
          console.error('Contact API Error:', error);

          alert('Unable to send your message. Please try again.');
        },
      });
  }
}
