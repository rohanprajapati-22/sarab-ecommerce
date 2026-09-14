import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-special-offer',
  styleUrl: './special-offer.css',
  templateUrl: './special-offer.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpecialOffer implements OnInit, OnDestroy {
  h = 8;
  m = 45;
  s = 30;
  private timer: any;
  constructor(private cd: ChangeDetectorRef){}

  ngOnInit() {
    this.cd.detectChanges();
    this.timer = setInterval(() => {
      this.s--;
      if (this.s < 0) {
        this.s = 59;
        this.m--;
      }
      if (this.m < 0) {
        this.m = 59;
        this.h--;
      }
      if (this.h < 0) {
        this.h = 8;
        this.m = 45;
        this.s = 30;
      }
    }, 1000);
     this.cd.detectChanges();
  }
  pad(v: number): string {
    return String(v).padStart(2, '0');
  }
  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
}
