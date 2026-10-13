import { Component, OnInit, inject, signal } from '@angular/core';
import { AboutContent, AboutService } from './about.service';

@Component({
  imports: [],
  selector: 'app-about',
  styleUrl: './about.css',
  templateUrl: './about.html',
})
export class About implements OnInit {
  private readonly aboutService = inject(AboutService);
  readonly content = signal<AboutContent | null>(null);
  readonly error = signal(false);

  ngOnInit(): void {
    this.aboutService.getAboutContent().subscribe({
      next: (content) => this.content.set(content),
      error: () => this.error.set(true),
    });
  }
}
