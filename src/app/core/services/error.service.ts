import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ErrorService {
    private _message = signal<string | null>(null);
    public readonly message = this._message.asReadonly();

    private clearTimeoutRef: any;

    show(message: string, duration: number = 5000): void {
        this._message.set(message);

        if (this.clearTimeoutRef) {
            clearTimeout(this.clearTimeoutRef);
        }

        this.clearTimeoutRef = setTimeout(() => {
            this._message.set(null);
        }, duration);
    }

    clear(): void {
        if (this.clearTimeoutRef) {
            clearTimeout(this.clearTimeoutRef);
        }
        this._message.set(null);
    }
}
