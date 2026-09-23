import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService, LoginRequest } from '../auth-service';

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

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.auth.isAdmin()) {
      this.router.navigate(['/admin']);
    } else if (this.auth.isAuthenticated()) {
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

    this.auth.login(loginRequest).subscribe({
      next: () => {
        this.submitting.set(false);
        if (this.auth.isAdmin()) {
          this.router.navigate(['/admin']);
        } else {
          this.error.set('This account does not have admin access.');
          this.auth.logout();
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