import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

import { AuthService } from '../../../core/services/auth.service';
import { ErrorService } from '../../../core/services/error.service';
import { LoaderService } from '../../../core/services/loader.service';
import { passwordMatchValidator } from '../../../shared/validators/password-match.validator';
import {
  usernameTakenValidator,
  emailTakenValidator
} from '../../../shared/validators/unique-validators';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgClass],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  signupForm: FormGroup;
  isSubmitting = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public errorService: ErrorService,
    private loader: LoaderService
  ) {
    this.signupForm = this.fb.group(
      {
        username: [
          '',
          [Validators.required],
          [usernameTakenValidator(this.authService)]
        ],
        email: [
          '',
          [Validators.required, Validators.email],
          [emailTakenValidator(this.authService)]
        ],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: passwordMatchValidator('password', 'confirmPassword'),
      }
    );
  }

  get username() { return this.signupForm.get('username'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }

  async onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const { username, email, password } = this.signupForm.value;

    this.isSubmitting = true;       // keep button state
    this.loader.show();             // show global overlay
    this.errorService.clear();

    try {
      await this.authService.registerUser(username!, email!, password!);
      this.router.navigateByUrl('/');
    } catch (err: any) {
      const msg = this.mapFirebaseError(err);
      this.errorService.show(msg);
      this.signupForm.reset();
    } finally {
      this.isSubmitting = false;
      this.loader.hide();           // hide overlay
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
