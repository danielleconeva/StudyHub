import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ErrorService } from '../../../core/services/error.service';
import { NgClass } from '@angular/common';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgClass],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn {
  signInForm: FormGroup;
  isSubmitting = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public errorService: ErrorService,
    private loader: LoaderService
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() {
    return this.signInForm.get('email');
  }

  get password() {
    return this.signInForm.get('password');
  }

  onSubmit() {
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.signInForm.value;

    this.isSubmitting = true;
    this.loader.show();
    this.errorService.clear();

    this.authService.loginUser(email!, password!).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
        this.isSubmitting = false;
        this.loader.hide();
      },
      error: (err) => {
        const msg = this.mapFirebaseError(err);
        this.errorService.show(msg);
        this.signInForm.reset();
        this.isSubmitting = false;
        this.loader.hide();
      }
    });
  }

  private mapFirebaseError(error: any): string {
    const code = error?.code;
    switch (code) {
      case 'auth/invalid-credential':
        return "Incorrect email or password. Please try again.";
      default:
        return "Login failed. Please try again.";
    }
  }
}
