import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth-service';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-admin-layout',
  styleUrl: './admin-layout.css',
  templateUrl: './admin-layout.html',
  standalone: true,
})
export class AdminLayout {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  get name(): string {
    return this.auth.user()?.name ?? 'Admin';
  }

  mobileOpen = false;

  toggleMobile() {
    this.mobileOpen = !this.mobileOpen;
  }

  closeMobile() {
    this.mobileOpen = false;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}