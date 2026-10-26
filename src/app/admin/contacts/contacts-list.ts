import { Component, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AdminContactMessage, ContactAdminService } from './contact-admin.service';
import { ToastService } from '../../toast.service';

@Component({
  imports: [DatePipe],
  selector: 'app-contacts-list',
  styleUrl: './contacts-list.css',
  templateUrl: './contacts-list.html',
  standalone: true,
})
export class ContactsList {
  readonly contacts = signal<AdminContactMessage[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly selected = signal<AdminContactMessage | null>(null);

  constructor(
    private readonly contactService: ContactAdminService,
    private readonly toaster: ToastService
  ) {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.selected.set(null);

    this.contactService.getAll().subscribe({
      next: (res) => {
        this.contacts.set(res ?? []);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err?.error?.message ||
          err?.error?.title ||
          'Unable to load contact messages. Please try again.'
        );
      },
    });
  }

  open(message: AdminContactMessage): void {
    this.selected.set(message);
  }

  close(): void {
    this.selected.set(null);
  }

  remove(message: AdminContactMessage): void {
    if (!window.confirm(`Delete the message from \u201c${message.name}\u201d?`)) {
      return;
    }

    this.contactService.remove(message.id).subscribe({
      next: () => {
        this.toaster.success('Message deleted.');
        if (this.selected()?.id === message.id) {
          this.selected.set(null);
        }
        this.load();
      },
      error: (err) => {
        this.toaster.error(
          err?.error?.message || 'Unable to delete the message. Please try again.'
        );
      },
    });
  }

  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.contacts().length / this.pageSize))
  );

  readonly paginatedContacts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.contacts().slice(start, start + this.pageSize);
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
