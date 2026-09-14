import { ChangeDetectionStrategy, ChangeDetectorRef, Component, signal } from '@angular/core';
import { MenuService } from '../menu.service';

@Component({
  imports: [],
  selector: 'app-chefs',
  styleUrl: './chefs.css',
  templateUrl: './chefs.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Chefs {
// chefs: any[] = [];
chefs = signal<any[]>([]);

constructor(private service: MenuService, private cdr:ChangeDetectorRef) {}

ngOnInit() {
  this.getChefData();
}

getChefData() {
  this.service.getChefsData().subscribe({
    next: (items) => {
      // this.cdr.detectChanges();

      // this.chefs = items;
       this.chefs.set(items);

      //  this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Chef API error:', err);
    }
  });
}
}
