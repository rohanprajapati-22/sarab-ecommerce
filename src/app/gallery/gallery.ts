import { Component, OnInit } from '@angular/core';
import { UiService, GalleryItem } from '../ui.service';

@Component({
  imports: [],
  selector: 'app-gallery',
  styleUrl: './gallery.css',
  templateUrl: './gallery.html',
  standalone: true,
})
export class Gallery implements OnInit {
  gallery: GalleryItem[] = [
    { img: 'img/portfolio/work1.jpg', title: 'Gourmet Burgers', desc: 'Our award-winning smash burgers, hand-crafted with 100% premium beef, aged cheddar and house-made sauces.' },
    { img: 'img/portfolio/work2.jpg', title: 'Wood-Fired Pizza', desc: 'Authentic Neapolitan-style pizzas fired at 900\u00b0F in our wood-burning stone oven for the perfect char.' },
    { img: 'img/portfolio/work3.jpg', title: 'Crispy Fried Chicken', desc: 'Double-brined, hand-battered chicken fried to golden perfection using our 15-spice secret blend.' },
    { img: 'img/portfolio/work4.jpg', title: 'Sweet Desserts', desc: 'Handcrafted desserts - from molten lava cakes to artisan ice cream sundaes and seasonal pastries.' },
    { img: 'img/portfolio/work5.jpg', title: 'Fresh Wraps & Rolls', desc: 'Loaded fresh wraps packed with grilled proteins, crunchy vegetables and our house-made sauces.' },
  ];

  constructor(private ui: UiService) {}

  ngOnInit() {
    this.ui.setGallery(this.gallery);
  }

  open(i: number) {
    this.ui.openGallery(i);
  }
}
