import { Component, computed, inject, signal } from '@angular/core';
import { UiService, MenuItem } from '../ui.service';
import { MenuService } from '../menu.service';

@Component({
  imports: [],
  selector: 'app-menu',
  styleUrl: './menu.css',
  templateUrl: './menu.html',
  standalone: true,
})
export class Menu {
  private menuService = inject(MenuService);
  private allItems = signal<MenuItem[]>([]);

  readonly loading = signal<boolean>(true);
  readonly error = signal<string>('');

  constructor(public ui: UiService) {
    this.fetchItems();
  }

  private fetchItems() {
    this.menuService.getMenuItems().subscribe({
      next: (items) => {
        this.allItems.set(items);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Failed to load menu. Please try again later.');
        console.error('Menu API error:', err);
      },
    });
  }

  get filter(): string {
    return this.ui.activeCategory();
  }

  // Recomputes the visible list whenever the filter changes
  visibleItems = computed<MenuItem[]>(() => {
    const cat = this.ui.activeCategory();
    return cat === 'all' ? this.allItems() : this.allItems().filter((i) => i.category === cat);
  });

  setFilter(cat: string) {
    this.ui.activeCategory.set(cat);
  }

  shortDesc(item: MenuItem): string {
    return item.description.length > 90 ? item.description.slice(0, 90) + '...' : item.description;
  }

  openItem(item: MenuItem) {
    this.ui.openMenu(item);
  }

  fav(event: Event): void {
    event.stopPropagation(); 
    const icon = (event.currentTarget as HTMLElement).querySelector('i'); 
    if (icon) { 
      icon.classList.toggle('far'); 
      icon.classList.toggle('fas'); 
    } 
  }
}
