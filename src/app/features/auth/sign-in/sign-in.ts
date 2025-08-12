import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

import { AuthService } from '../../../core/services/auth.service';
import { LoaderService } from '../../../core/services/loader.service';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgClass],
  templateUrl: './sign-in.html',
  styleUrls: ['./sign-in.css'],
})
export class SignIn {
  signInForm: FormGroup;
  isSubmitting = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loader: LoaderService,
    private modal: ModalService
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

    const { email, password } = this.signInForm.value as { email: string; password: string };

    this.isSubmitting = true;
    this.loader.show();

    this.authService.loginUser(email, password).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.loader.hide();
        this.modal.success('Signed in successfully!');
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        const msg = this.mapFirebaseError(err);
        this.isSubmitting = false;
        this.loader.hide();
        this.modal.error(msg);
        this.signInForm.reset();
      },
    });
  }

  private mapFirebaseError(error: any): string {
    const code = error?.code;
    switch (code) {
      case 'auth/invalid-credential':
        return 'Incorrect email or password. Please try again.';
      default:
        return 'Login failed. Please try again.';
    }
  }
}
