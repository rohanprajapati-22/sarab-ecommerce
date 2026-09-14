import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-newsletter',
  styleUrl: './newsletter.css',
  templateUrl: './newsletter.html',
})
export class Newsletter {
  email = '';
  subscribe(e: Event) {
    if (this.email && this.email.includes('@')) {
      const btn = e.target as HTMLElement;
      btn.textContent = '\u2713 Subscribed!';
      btn.style.background = '#4ade80';
      btn.style.color = '#222';
      this.email = '';
      setTimeout(() => {
        btn.textContent = 'Subscribe';
        btn.style.background = '';
        btn.style.color = '';
      }, 3000);
    }
  }
}
