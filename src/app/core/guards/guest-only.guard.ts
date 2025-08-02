import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestOnlyGuard: CanActivateFn = async () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    while (!authService.authResolved()) {
        await new Promise((res) => setTimeout(res, 10));
    }

    if (authService.isLoggedIn()) {
        router.navigateByUrl('/');
        return false;
    }

    return true;
};
