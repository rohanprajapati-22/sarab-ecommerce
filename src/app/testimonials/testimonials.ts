import { Component, AfterViewInit, OnDestroy } from '@angular/core';

declare const Swiper: any;

@Component({
  imports: [],
  selector: 'app-testimonials',
  styleUrl: './testimonials.css',
  templateUrl: './testimonials.html',
  standalone: true,
})
export class Testimonials implements AfterViewInit, OnDestroy {
  private swiper: any;

  testimonials = [
    { name: 'Monica Wilber', role: 'Regular Customer', img: 'img/testimonial/1.jpg', text: "Honestly the best burgers I've ever had. The smash burger is incredible - perfectly crispy edges, juicy inside, and those pickles! We come every Friday now." },
    { name: 'Cameron Fox', role: 'Food Blogger', img: 'img/testimonial/2.jpg', text: 'Ordered delivery and the food arrived hot and fresh in 22 minutes. Portions are generous. Sarab has become my go-to comfort food spot without question.' },
    { name: 'Priya Sharma', role: 'Food Enthusiast', img: 'img/testimonial/3.jpg', text: "The truffle pasta blew my mind. I didn't expect that quality from a fast food place. Great ambiance, super friendly staff. Highly recommended!" },
    { name: 'David Park', role: 'Corporate Client', img: 'img/testimonial/4.jpg', text: 'Catered our office party of 50 people and everything was flawless. Fresh, delicious, on time and well presented. Nashville chicken was the absolute star!' },
  ];

  ngAfterViewInit() {
    setTimeout(() => {
      if (typeof Swiper !== 'undefined') {
        this.swiper = new Swiper('.tesSwiper', {
          slidesPerView: 1,
          spaceBetween: 22,
          loop: true,
          autoplay: { delay: 4000, disableOnInteraction: false },
          pagination: { el: '.swiper-pagination', clickable: true },
          breakpoints: {
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          },
        });
      }
    }, 0);
  }

  ngOnDestroy() {
    if (this.swiper) this.swiper.destroy();
  }
}
