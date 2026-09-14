import { Component } from '@angular/core';
import { UiService } from '../ui.service';

@Component({
  imports: [],
  selector: 'app-category',
  styleUrl: './category.css',
  templateUrl: './category.html',
  standalone: true,
})
export class Category {
  constructor(public ui: UiService) {}

  isActive(cat: string): boolean {
    return this.ui.activeCategory() === cat;
  }

  filter(cat: string) {
    this.ui.activeCategory.set(cat);

    const menu = document.getElementById('menu');
    if (menu) {
      window.scrollTo({ top: menu.offsetTop - 80, behavior: 'smooth' });
    }
  }
}
