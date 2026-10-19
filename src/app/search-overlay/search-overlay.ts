import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiService } from '../ui.service';

@Component({
  imports: [FormsModule],
  selector: 'app-search-overlay',
  styleUrl: './search-overlay.css',
  templateUrl: './search-overlay.html',
  standalone: true,
})
export class SearchOverlay {
  query = '';
  activeCat = 'all';

  constructor(public ui: UiService) {}

  trend(text: string) {
    this.query = text;
    this.ui.menuSearchQuery.set(text);
  }

  setQuery(query: string): void {
    this.ui.menuSearchQuery.set(query);
  }

  applySearch(): void {
    this.close();
    setTimeout(() => {
      document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  }

  select(cat: string) {
    this.activeCat = cat;
    this.ui.activeCategory.set(cat);
    this.close();
    setTimeout(() => {
      const menu = document.getElementById('menu');
      if (menu) menu.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  }

  close() {
    this.ui.toggleSearch(false);
  }
}
