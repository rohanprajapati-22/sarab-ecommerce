import { Component, signal } from '@angular/core';
import { UiService } from '../ui.service';
import { MenuService } from '../menu.service';

@Component({
  imports: [],
  selector: 'app-history',
  styleUrl: './history.css',
  templateUrl: './history.html',
  standalone: true,
})
export class History {
  // timeline = [
  //   { year: '2012', title: 'Evolution of Restaurants', text: 'Sarab opens its first 20-seat diner on Flavor Street. Within 3 months, lines stretch around the block every evening as word of our food spreads.' },
  //   { year: '2015', title: 'Fine Dining & The Concept', text: "Expanding the vision - we introduced our signature tasting menu and hired our first Michelin-trained chef, elevating our craft to remarkable new heights." },
  //   { year: '2019', title: 'Modern Fast Food Origins', text: 'Launched our signature fast-food line, merging gourmet quality with speed and convenience. Within 6 months we won 3 prestigious culinary awards nationally.' },
  //   { year: '2026', title: 'National Expansion', text: 'Now operating in 8 cities across the US with an online delivery platform handling 10,000+ orders weekly - and growing every single day.' },
  // ];
  timeline = signal<any[]>([]);

  constructor(private service: MenuService){}
  ngOnInit(){
    this.getHistoryDetails();
  }

  getHistoryDetails(){
    this.service.getHistory().subscribe({
    next: (items) => {
       this.timeline.set(items);
    },
    error: (err) => {
      console.error('Chef API error:', err);
    }
    })
  }
}
