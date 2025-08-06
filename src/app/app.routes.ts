import { Routes } from '@angular/router';
import { guestOnlyGuard } from './core/guards/guest-only.guard';
import { authGuard } from './core/guards/auth.guard';

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
    canActivate: [guestOnlyGuard],
  },
  {
    path: 'sign-in',
    loadComponent: () =>
      import('./features/auth/sign-in/sign-in').then((m) => m.SignIn),
    canActivate: [guestOnlyGuard],
  },
  {
    path: 'focus-room',
    loadComponent: () =>
      import('./features/focus-room/focus-room').then((m) => m.FocusRoom),
  },
  {
    path: 'explore',
    loadComponent: () =>
      import('./features/explore-pages/explore-pages').then((m) => m.ExplorePages),
  },
  {
    path: 'explore/:id',
    loadComponent: () =>
      import('./features/explore-pages/study-page-details/study-page-details').then(
        (m) => m.StudyPageDetails
      ),
  },
  {
    path: 'my-study-pages',
    loadComponent: () =>
      import('./features/my-study-pages/my-study-pages').then((m) => m.MyStudyPages),
    canActivate: [authGuard]
  },
  {
    path: 'my-study-pages/new',
    loadComponent: () =>
      import('./features/my-study-pages/new-study-page/new-study-page').then(
        (m) => m.NewStudyPage),
    canActivate: [authGuard]
  },
  {
    path: 'my-study-pages/edit/:id',
    loadComponent: () =>
      import('./features/my-study-pages/edit-study-page/edit-study-page').then(
        (m) => m.EditStudyPage
      ),
    canActivate: [authGuard]
  },
  {
    path: 'my-study-pages/:id',
    loadComponent: () =>
      import('./features/my-study-pages/my-study-page-details/my-study-page-details').then(
        (m) => m.MyStudyPageDetails
      ),
    canActivate: [authGuard]
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./features/tasks/tasks').then(
        (m) => m.Tasks),
    canActivate: [authGuard]
  },
  {
    path: 'tasks/new',
    loadComponent: () => import('./features/tasks/new-task/new-task').then(m => m.NewTask),
    canActivate: [authGuard]
  },
  {
    path: 'tasks/edit/:id',
    loadComponent: () =>
      import('./features/tasks/edit-task/edit-task').then((m) => m.EditTask),
    canActivate: [authGuard]
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/not-found/not-found').then((m) => m.NotFound)
  },
];
