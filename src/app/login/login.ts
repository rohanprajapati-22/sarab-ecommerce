import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService, LoginRequest } from '../auth-service';

@Component({
  imports: [FormsModule, RouterLink, ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
  standalone: true,
})
export class Login implements OnInit {
  readonly submitting = signal<boolean>(false);
  readonly error = signal<string>('');

  loginForm: FormGroup;

  private redirectTo = '/';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const ret = this.route.snapshot.queryParamMap.get('return');
    if (ret) {
      this.redirectTo = ret;
    }
  }

  submit(): void {

    if (this.submitting()) return;

    this.error.set('');

    // Validate form
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
        this.router.navigate([this.redirectTo]);
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