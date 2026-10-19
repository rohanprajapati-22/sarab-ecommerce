import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactMessage, MenuService } from '../menu.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  readonly isSending = signal(false);

  contactData: ContactMessage = {
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  };

  constructor(
    private menuService: MenuService,
    private toaster: ToastService
  ) {}

  send(): void {
    if (this.isSending()) {
      return;
    }

    // Validation
    if (!this.contactData.name.trim()) {
      this.toaster.error('Please enter your name.');
      return;
    }

    if (!this.contactData.email.trim()) {
      this.toaster.error('Please enter your email address.');
      return;
    }

    if (!this.contactData.message.trim()) {
      this.toaster.error('Please enter your message.');
      return;
    }

    this.isSending.set(true);

    // Make a copy of the data being sent
    const messageToSend: ContactMessage = {
      ...this.contactData,
    };

    this.menuService.sendContactMessage(messageToSend).subscribe({
      next: (response) => {
        // Clear the form
        this.contactData = {
          name: '',
          email: '',
          phone: '',
          subject: 'General Inquiry',
          message: '',
        };

        // Stop sending
        this.isSending.set(false);
        this.toaster.success('Your message has been sent. We’ll get back to you soon.');

      },

      error: (error) => {
        console.error('API ERROR:', error);

        this.isSending.set(false);
        this.toaster.error(
          error?.error?.message || 'Unable to send your message. Please try again.'
        );
      },
    });
  }
}
