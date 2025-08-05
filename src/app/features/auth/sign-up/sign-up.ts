import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { passwordMatchValidator } from '../../../shared/validators/password-match.validator';
import { ErrorService } from '../../../core/services/error.service';
import { NgClass } from '@angular/common';


@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgClass],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css'
})
export class SignUp {
  signupForm: FormGroup;
  isSubmitting = false;
  successMessage: string | null = null;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public errorService: ErrorService
  ) {
    this.signupForm = this.fb.group(
      {
        fullName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
      },
      {
        validators: passwordMatchValidator('password', 'confirmPassword')
      }
    );
  }

  get fullName() {
    return this.signupForm.get('fullName');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }

  async onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const { fullName, email, password } = this.signupForm.value;

    this.isSubmitting = true;
    this.errorService.clear();
    this.successMessage = null;

    try {
      await this.authService.registerUser(fullName!, email!, password!);

      this.successMessage = 'Account successfully created!';
      this.signupForm.reset();

      setTimeout(() => {
        this.successMessage = null;
        this.router.navigateByUrl('/');
      }, 2000);

    } catch (err: any) {
      const msg = this.mapFirebaseError(err);
      this.errorService.show(msg);
      this.signupForm.reset();
    } finally {
      this.isSubmitting = false;
    }
  }

  private mapFirebaseError(error: any): string {
    const code = error?.code;

    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email is already in use.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/weak-password':
        return 'Password is too weak.';
      default:
        return 'Registration failed. Please try again later.';
    }
  }
}
