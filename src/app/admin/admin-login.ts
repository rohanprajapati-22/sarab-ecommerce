import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AdminAuthService } from '../admin-auth-service';
import { LoginRequest } from '../auth-service';

@Component({
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  selector: 'app-admin-login',
  styleUrl: './admin-login.css',
  templateUrl: './admin-login.html',
  standalone: true,
})
export class AdminLogin {
  readonly submitting = signal<boolean>(false);
  readonly error = signal<string>('');

  loginForm: FormGroup;

  private fb = inject(FormBuilder);
  private adminAuth = inject(AdminAuthService);
  private router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.adminAuth.isAdmin()) {
      this.router.navigate(['/admin']);
    } else if (this.adminAuth.isAdminAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  submit(): void {
    if (this.submitting()) return;

    this.error.set('');

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginRequest: LoginRequest = {
      email: this.loginForm.value.email.trim(),
      password: this.loginForm.value.password
    };

    this.submitting.set(true);

    this.adminAuth.login(loginRequest).subscribe({
      next: () => {
        this.submitting.set(false);
        if (this.adminAuth.isAdmin()) {
          this.router.navigate(['/admin']);
        } else {
          this.error.set('This account does not have admin access.');
          this.adminAuth.logout();
        }
      },
      error: (err) => {
        this.submitting.set(false);
        this.error.set(
          err?.error?.message ||
          err?.error?.title ||
          'Unable to log in. Please check your credentials and try again.'
        );
      }
    });
  }
}
