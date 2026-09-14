import { Component, AfterViewInit, OnDestroy, HostListener } from '@angular/core';

declare const $: any;

@Component({
  imports: [],
  selector: 'app-hero',
  standalone: true,
  styleUrl: './hero.css',
  templateUrl: './hero.html',
})
export class Hero implements AfterViewInit, OnDestroy {
  private statsAnimated = false;

  ngAfterViewInit() {
    this.initVideoPopup();
  }

  ngOnDestroy() {}

  // When the page scrolls, animate the stats numbers once
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    const hero = document.getElementById('hero');
    if (!hero || this.statsAnimated) return;
    if (window.scrollY <= hero.offsetHeight - 300) return;

    this.statsAnimated = true;
    this.animateStats();
  }

  // Count every .snum number up from 0 to its final value
  private animateStats() {
    const numbers = document.querySelectorAll('.snum');

    numbers.forEach((el) => {
      const element = el as HTMLElement;
      const originalText = element.textContent || '';
      const finalNumber = parseInt(originalText, 10);
      const suffix = originalText.replace(/[0-9]/g, '');

      if (isNaN(finalNumber)) return;

      let current = 0;
      const increment = Math.ceil(finalNumber / 55);

      const timer = setInterval(() => {
        current += increment;
        if (current >= finalNumber) {
          current = finalNumber;
          clearInterval(timer);
        }
        element.innerHTML = `${current}${suffix}`;
      }, 1400 / 55);
    });
  }

  // Power the "Watch Our Story" YouTube lightbox
  private initVideoPopup() {
    if (typeof $ !== 'undefined') {
      $('.magnific_popup').magnificPopup({
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false,
        disableOn: 700,
      });
    }
  }
}
