import { Component } from '@angular/core';
import { Hero } from '../hero/hero';
import { Marquee } from '../marquee/marquee';
import { Category } from '../category/category';
import { About } from '../about/about';
import { Menu } from '../menu/menu';
import { SpecialOffer } from '../special-offer/special-offer';
import { Gallery } from '../gallery/gallery';
import { History } from '../history/history';
import { Chefs } from '../chefs/chefs';
import { Hours } from '../hours/hours';
import { Testimonials } from '../testimonials/testimonials';
import { Reservation } from '../reservation/reservation';
import { Blog } from '../blog/blog';
import { Newsletter } from '../newsletter/newsletter';
import { Contact } from '../contact/contact';
import { Footer } from '../footer/footer';

@Component({
  imports: [
    Hero,
    Marquee,
    Category,
    About,
    Menu,
    SpecialOffer,
    Gallery,
    History,
    Chefs,
    Hours,
    Testimonials,
    Reservation,
    Blog,
    Newsletter,
    Contact,
    Footer,
  ],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
  standalone: true,
})
export class Home {}