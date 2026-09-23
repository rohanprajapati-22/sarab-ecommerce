import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactMessage, MenuService } from '../menu.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
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

  constructor(
    private menuService: MenuService,
    private cdr: ChangeDetectorRef,
  ) {}

  send(): void {
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

    if (!this.contactData.message.trim()) {
      alert('Please enter your message.');
      return;
    }

    this.isSending = true;

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
        this.isSending = false;

        // Show success message
        this.ok = true;
        setTimeout(() => { 
          this.ok = false; 
        }, 3000);

        // Force Angular to update the UI
        this.cdr.detectChanges();

      },

      error: (error) => {
        console.error('API ERROR:', error);

        this.isSending = false;
        this.ok = false;

        // Update UI
        this.cdr.detectChanges();

        alert('Unable to send your message. Please try again.');
      },
    });
  }
}
