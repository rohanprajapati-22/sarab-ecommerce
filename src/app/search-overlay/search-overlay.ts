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

  // Fill the search box when a trending tag is clicked
  trend(text: string) {
    this.query = text;
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
