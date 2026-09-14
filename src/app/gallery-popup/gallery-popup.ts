import { Component } from '@angular/core';
import { UiService, GalleryItem } from '../ui.service';

@Component({
  imports: [],
  selector: 'app-gallery-popup',
  styleUrl: './gallery-popup.css',
  templateUrl: './gallery-popup.html',
  standalone: true,
})
export class GalleryPopup {
  constructor(public ui: UiService) {}

  // Read directly from the service signals in the template
  get open(): boolean {
    return this.ui.galleryPopupOpen();
  }

  get current(): GalleryItem | null {
    const items = this.ui.galleryItems();
    const index = this.ui.galleryIndex();
    return items[index] || null;
  }

  close() {
    this.ui.closeGallery();
  }

  prev() {
    const items = this.ui.galleryItems();
    const index = this.ui.galleryIndex();
    this.ui.galleryIndex.set((index - 1 + items.length) % items.length);
  }

  next() {
    const items = this.ui.galleryItems();
    const index = this.ui.galleryIndex();
    this.ui.galleryIndex.set((index + 1) % items.length);
  }
}
