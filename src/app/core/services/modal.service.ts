import { Injectable, signal } from '@angular/core';

export type ModalType = 'info' | 'success' | 'error' | 'confirm';

export interface ModalConfig {
    title?: string;
    message?: string;
    type?: ModalType;
    confirmText?: string;
    cancelText?: string;
    autoClose?: boolean;   // toast-like
    durationMs?: number;   // toast duration
}

@Injectable({ providedIn: 'root' })
export class ModalService {
    state = signal<(ModalConfig & { resolve?: (v: boolean) => void }) | null>(null);

    private open(config: ModalConfig) {
        return new Promise<boolean>((resolve) => {
            const auto = !!config.autoClose;
            const duration = config.durationMs ?? 700; // faster

            this.state.set({
                confirmText: 'OK',
                cancelText: 'Cancel',
                type: 'info',
                ...config,
                resolve,
            });

            // Only lock scroll for blocking dialogs
            if (!auto) document.body.classList.add('no-scroll');

            if (auto) {
                setTimeout(() => this.close(true), duration);
            }
        });
    }

    close(result = false) {
        this.state()?.resolve?.(result);
        this.state.set(null);
        document.body.classList.remove('no-scroll');
    }

    // Non-blocking, toast-like
    success(message: string, title = 'Success') {
        return this.open({ title, message, type: 'success', autoClose: true, durationMs: 2500 });
    }
    error(message: string, title = 'Error') {
        return this.open({ title, message, type: 'error', autoClose: true, durationMs: 2500 });
    }


    // Blocking dialogs
    alert(message: string, title = 'Alert') {
        return this.open({ title, message, type: 'info', cancelText: undefined });
    }
    confirm(message: string, title = 'Confirm', confirmText = 'Yes', cancelText = 'No') {
        return this.open({ title, message, type: 'confirm', confirmText, cancelText });
    }
}
