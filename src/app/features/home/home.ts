import {
  Component,
  computed,
  inject
} from '@angular/core';

import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger
} from '@angular/animations';

import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css',
  imports: [RouterLink],
  animations: [
    trigger('fadeInStagger', [
      transition(':enter', [
        query('.glass-card', [
          style({ opacity: 0, transform: 'translateY(60px) scale(0.96)' }),
          stagger(150, [
            animate(
              '800ms cubic-bezier(0.2, 1, 0.3, 1)',
              style({ opacity: 1, transform: 'translateY(0) scale(1)' })
            )
          ])
        ], { optional: true })
      ])
    ]),

    trigger('bubbleFadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.6) translateY(-20px)' }),
        animate(
          '1200ms ease-out',
          style({ opacity: 1, transform: 'scale(1) translateY(0)' })
        )
      ])
    ]),

    trigger('contentFade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-40px)' }),
        animate(
          '1000ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ])
    ])
  ]
})
export class Home {
  private authService = inject(AuthService);
  isLoggedIn = computed(() => this.authService.isLoggedIn());
}
