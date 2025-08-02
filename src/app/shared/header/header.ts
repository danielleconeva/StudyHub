import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { Auth, onAuthStateChanged, signOut, User } from '@angular/fire/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private auth = inject(Auth);
  private currentUser = signal<User | null>(null);
  private router = inject(Router);

  constructor() {
    onAuthStateChanged(this.auth, user => {
      this.currentUser.set(user);
    });
  }

  isLoggedIn = computed(() => !!this.currentUser());
  username = computed(() => this.currentUser()!.displayName);

  logout() {
    const confirmed = confirm('Are you sure you want to log out?');
    if (!confirmed) return;

    signOut(this.auth).then(() => {
      this.router.navigate(['/']);
    });
  }


}
