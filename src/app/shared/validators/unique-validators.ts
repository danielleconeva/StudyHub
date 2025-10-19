import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import {
    of,
    debounceTime,
    switchMap,
    map,
    take,
    catchError,
} from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

export function usernameTakenValidator(authService: AuthService): AsyncValidatorFn {
    return (control: AbstractControl) => {
        return of(control.value).pipe(
            debounceTime(1500),
            switchMap((username) => {
                if (!username?.trim()) return of(null);
                return authService.getAllUsers().pipe(
                    take(1),
                    map((users) => {
                        const taken = users.some(
                            (u) => u.username.toLowerCase() === username.toLowerCase()
                        );
                        return taken ? { usernameTaken: true } : null;
                    }),
                    catchError(() => of(null))
                );
            })
        );
    };
}

export function emailTakenValidator(authService: AuthService): AsyncValidatorFn {
    return (control: AbstractControl) => {
        return of(control.value).pipe(
            debounceTime(1500),
            switchMap((email) => {
                if (!email?.trim()) return of(null);
                return authService.getAllUsers().pipe(
                    take(1),
                    map((users) => {
                        const taken = users.some(
                            (u) => u.email.toLowerCase() === email.toLowerCase()
                        );
                        return taken ? { emailTaken: true } : null;
                    }),
                    catchError(() => of(null))
                );
            })
        );
    };
}
