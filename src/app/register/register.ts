import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService, RegisterRequest } from '../auth-service';

@Component({
  imports: [FormsModule, RouterLink, ReactiveFormsModule],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
  standalone: true,
})
export class Register implements OnInit {
  readonly submitting = signal<boolean>(false);
  readonly error = signal<string>('');

  registerForm!: FormGroup;

  private redirectTo = '/';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      role: ['Customer']
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

    // Mark all fields as touched
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { name, email, password, confirmPassword, role } =
      this.registerForm.value;

    // Confirm password validation
    if (password !== confirmPassword) {
      this.error.set('Passwords do not match.');
      return;
    }

    this.submitting.set(true);

    const registerRequest: RegisterRequest = {
      name: name.trim(),
      email: email.trim(),
      password: password,
      role: role || 'Customer'
    };

    this.auth.register(registerRequest).subscribe({
      next: () => {
        this.submitting.set(false);
        const target =
          this.redirectTo === '/' && this.auth.isAdmin()
            ? '/admin'
            : this.redirectTo;
        this.router.navigate([target]);
      },

      error: (err) => {
        this.submitting.set(false);

        this.error.set(
          err?.error?.message ||
          err?.error?.title ||
          'Unable to create your account. Please try again.'
        );
      }
    });
  }
}