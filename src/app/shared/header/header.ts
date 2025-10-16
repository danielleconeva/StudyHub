import { Component, inject, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../core/services/auth.service';
import { ModalService } from '../../core/services/modal.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  private authService = inject(AuthService);
  private router = inject(Router);
  private modal = inject(ModalService);

  isLoggedIn = this.authService.isLoggedIn;
  username = computed(() => this.authService.currentUser()?.username ?? '');

  async logout() {
    const confirmed = await this.modal.confirm('Are you sure you want to log out?', 'Confirm logout');
    if (!confirmed) return;

    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
  closeMenu() {
    const checkbox = document.getElementById('mobile-menu-toggle') as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = false;
    }
  }
}
