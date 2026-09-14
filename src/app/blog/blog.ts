import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-blog',
  styleUrl: './blog.css',
  templateUrl: './blog.html',
  standalone: true,
})
export class Blog {
  posts = [
    { day: '14', month: 'Mar', tag: 'Food & Health', title: 'Healthy Fast Food: A Myth or Beautiful Reality', author: 'James Writer', comments: 24, img: 'img/blog/1.jpg' },
    { day: '28', month: 'Feb', tag: 'Food Science', title: "Is Fast Food Getting Healthier? Here's What We Found", author: 'Sarah Grain', comments: 18, img: 'img/blog/2.jpg' },
    { day: '05', month: 'Jan', tag: 'Recipes', title: "Innovative Hot Chickpeas Flake Crackin' Recipe at Home", author: 'Chef Marcus', comments: 32, img: 'img/blog/3.jpg' },
  ];
}
