
import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AdminMenuItem, MenuAdminService, MenuPayload } from './menu-admin.service';

@Component({
  selector: 'app-menu-management',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './menu-management.html',
  styleUrl: './menu-management.css',
})
export class MenuManagement {
  readonly items = signal<AdminMenuItem[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly notice = signal('');
  readonly editingId = signal<number | null>(null);
  readonly selectedFile = signal<File | null>(null);

  menuForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly menuService: MenuAdminService
  ) {
    this.menuForm = this.fb.group({
      category: ['', [Validators.required, Validators.maxLength(100)]],
      title: ['', [Validators.required, Validators.maxLength(200)]],
      image: [''],
      price: [0, [Validators.required, Validators.min(0.01)]],
      oldPrice: [null as number | null, [Validators.min(0)]],
      rating: [0, [Validators.min(0), Validators.max(5)]],
      reviews: [0, [Validators.min(0)]],
      calories: [0, [Validators.min(0)]],
      prepTime: [0, [Validators.min(0)]],
      description: ['', Validators.maxLength(2000)],
      tagsText: [''],
      badgeText: ['', Validators.maxLength(100)],
      badgeType: [''],
      isActive: [true],
    });

    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');

    this.menuService.getAll().subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err?.error?.message ||
          err?.error?.title ||
          'Unable to load menu items.'
        );
      },
    });
  }

  startCreate(): void {
    this.editingId.set(null);
    this.menuForm.reset({
      category: '',
      title: '',
      image: '',
      price: 0,
      oldPrice: null,
      rating: 0,
      reviews: 0,
      calories: 0,
      prepTime: 0,
      description: '',
      tagsText: '',
      badgeText: '',
      badgeType: '',
      isActive: true,
    });

    this.selectedFile.set(null);
    this.error.set('');
    this.notice.set('');
  }

  edit(item: AdminMenuItem): void {
    this.editingId.set(item.id);

    this.menuForm.patchValue({
      category: item.category,
      title: item.title,
      image: item.image ?? '',
      price: item.price,
      oldPrice: item.oldPrice,
      rating: item.rating,
      reviews: item.reviews,
      calories: item.calories,
      prepTime: item.prepTime,
      description: item.description ?? '',
      tagsText: item.tags.join(', '),
      badgeText: item.badge?.text ?? '',
      badgeType: item.badge?.type ?? '',
      isActive: item.isActive,
    });

    this.selectedFile.set(null);
    this.error.set('');
    this.notice.set('');

    document.getElementById('menu-editor')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (file && file.size > 5 * 1024 * 1024) {
      this.error.set('Image must be 5 MB or smaller.');
      input.value = '';
      return;
    }

    this.error.set('');
    this.selectedFile.set(file);
  }

  save(): void {
    if (this.menuForm.invalid || this.saving()) {
      this.menuForm.markAllAsTouched();
      return;
    }

    const value = this.menuForm.getRawValue();

    const tags = String(value.tagsText ?? '')
      .split(',')
      .map((tag: string) => tag.trim())
      .filter(Boolean);

    const payload: MenuPayload = {
      category: value.category.trim(),
      title: value.title.trim(),
      image: value.image?.trim() || null,
      price: Number(value.price),
      oldPrice:
        value.oldPrice === null || value.oldPrice === ''
          ? null
          : Number(value.oldPrice),
      rating: Number(value.rating),
      reviews: Number(value.reviews),
      calories: Number(value.calories),
      prepTime: Number(value.prepTime),
      description: value.description?.trim() || null,
      tags,
      badgeText: value.badgeText?.trim() || null,
      badgeType: value.badgeText?.trim()
        ? value.badgeType?.trim() || null
        : null,
      isActive: Boolean(value.isActive),
    };

    this.saving.set(true);
    this.error.set('');

    const file = this.selectedFile();

    const persist = (image?: string): void => {
      const menu = image ? { ...payload, image } : payload;
      const id = this.editingId();

      const request = id
        ? this.menuService.update(id, menu)
        : this.menuService.create(menu);

      request.subscribe({
        next: () => {
          this.saving.set(false);

          const message = id
            ? 'Menu item updated.'
            : 'Menu item created.';

          this.startCreate();
          this.notice.set(message);
          this.load();
        },
        error: (err) => {
          this.saving.set(false);
          this.error.set(
            err?.error?.message ||
            err?.error?.title ||
            'Unable to save menu item.'
          );
        },
      });
    };

    if (file) {
      this.menuService.uploadImage(file).subscribe({
        next: (result) => persist(result.image),
        error: (err) => {
          this.saving.set(false);
          this.error.set(
            err?.error?.message || 'Unable to upload image.'
          );
        },
      });
    } else {
      persist();
    }
  }

  deactivate(item: AdminMenuItem): void {
    if (!window.confirm(
      `Remove “${item.title}” from the storefront?`
    )) {
      return;
    }

    this.menuService.deactivate(item.id).subscribe({
      next: () => {
        this.notice.set('Menu item deactivated.');
        this.load();
      },
      error: (err) => {
        this.error.set(
          err?.error?.message || 'Unable to deactivate menu item.'
        );
      },
    });
  }
}
