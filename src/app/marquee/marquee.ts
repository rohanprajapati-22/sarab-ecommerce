import { Component, signal } from '@angular/core';
import { MenuService } from '../menu.service';

@Component({
  imports: [],
  selector: 'app-marquee',
  styleUrl: './marquee.css',
  templateUrl: './marquee.html',
})
export class Marquee {
  Marquee = signal<any[]>([]);
  constructor(private menuservice: MenuService){}
  ngOnInit(){
    this.getMarquee()
  }

  getMarquee() {
      this.menuservice.getMarqueeItem().subscribe({
    next: (items) => {
      //  this.Marquee.set(items);
        this.Marquee.set([...items, ...items]);
    },
    error: (err) => {
      console.error('Chef API error:', err);
    }
  });
  }
}
