import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AdminAuthService } from '../admin-auth-service';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-admin-layout',
  styleUrl: './admin-layout.css',
  templateUrl: './admin-layout.html',
  standalone: true,
})
export class AdminLayout {
  mobileOpen = false;

  constructor(
    private adminAuth: AdminAuthService,
    private router: Router
  ) {}

  get name(): string {
    return this.adminAuth.admin()?.name ?? 'Admin';
  }

  toggleMobile() {
    this.mobileOpen = !this.mobileOpen;
  }

  closeMobile() {
    this.mobileOpen = false;
  }

  logout() {
    this.adminAuth.logout();
    this.router.navigate(['/']);
  }
}