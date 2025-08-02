import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./features/auth/sign-up/sign-up').then((m) => m.SignUp),
  },
  {
    path: 'sign-in',
    loadComponent: () =>
      import('./features/auth/sign-in/sign-in').then((m) => m.SignIn),
  },
  {
    path: 'focus-room',
    loadComponent: () =>
      import('./features/focus-room/focus-room').then((m) => m.FocusRoom),
  },
  {
    path: "explore",
    loadComponent: () =>
      import('./features/explore-pages/explore-pages').then((m) => m.ExplorePages),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/not-found/not-found').then((m) => m.NotFound),
  }
];
