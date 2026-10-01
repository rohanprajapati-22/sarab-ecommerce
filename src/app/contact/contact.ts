import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactMessage, MenuService } from '../menu.service';
import { SnackbarService } from '../snackbar.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact implements OnDestroy {
  ok = false;
  isSending = false;
  private successTimeout?: ReturnType<typeof setTimeout>;

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
     private snackbar: SnackbarService
  ) {}

  ngOnDestroy(): void {
    if (this.successTimeout) {
      clearTimeout(this.successTimeout);
    }
  }

  send(): void {
    if (this.isSending) {
      return;
    }

    // Validation
    if (!this.contactData.name.trim()) {
      // alert('Please enter your name.');
       this.snackbar.error('Please enter your name.');
      return;
    }

    if (!this.contactData.email.trim()) {
      // alert('Please enter your email address.');
      this.snackbar.error('Please enter your email address.');
      return;
    }

    if (!this.contactData.message.trim()) {
      // alert('Please enter your message.');
       this.snackbar.error('Please enter your message.');
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

        this.ok = true;
        this.cdr.detectChanges();

        if (this.successTimeout) {
          clearTimeout(this.successTimeout);
        }
        this.successTimeout = setTimeout(() => {
          this.ok = false;
          this.cdr.detectChanges();
        }, 3000);

      },

      error: (error) => {
        console.error('API ERROR:', error);

        this.isSending = false;
        // Update UI
        this.cdr.detectChanges();

        alert('Unable to send your message. Please try again.');
      },
    });
  }
}
