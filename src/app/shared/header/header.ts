import { Component, inject, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoggedIn = this.authService.isLoggedIn;
  username = computed(() => this.authService.currentUser()?.username ?? '');

  logout() {
    const confirmed = confirm('Are you sure you want to log out?');
    if (!confirmed) return;

    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
