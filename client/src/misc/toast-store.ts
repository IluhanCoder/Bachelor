import { makeAutoObservable } from 'mobx';

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

export default new class ToastStore {
    toasts: Toast[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    showToast(message: string, type: Toast['type'] = 'info', duration: number = 3000) {
        const id = Math.random().toString(36).substr(2, 9);
        const toast: Toast = { id, message, type };
        
        this.toasts = [...this.toasts, toast];

        setTimeout(() => {
            this.removeToast(id);
        }, duration);
    }

    removeToast(id: string) {
        this.toasts = this.toasts.filter(toast => toast.id !== id);
    }

    success(message: string, duration?: number) {
        this.showToast(message, 'success', duration);
    }

    error(message: string, duration?: number) {
        this.showToast(message, 'error', duration);
    }

    info(message: string, duration?: number) {
        this.showToast(message, 'info', duration);
    }

    warning(message: string, duration?: number) {
        this.showToast(message, 'warning', duration);
    }
}
