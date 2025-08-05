import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service'; // adjust the path as needed

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css',
  imports: [RouterLink]
})
export class Home {
  private authService = inject(AuthService);

  isLoggedIn = computed(() => this.authService.isLoggedIn());
}
