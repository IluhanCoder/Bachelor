import { observer } from 'mobx-react';
import toastStore, { Toast } from './toast-store';

const ToastContainer = observer(() => {
    const getToastStyles = (type: Toast['type']) => {
        const baseStyles = "flex items-center gap-3 p-4 rounded-lg shadow-lg min-w-[300px] max-w-md animate-slideIn";
        
        switch(type) {
            case 'success':
                return `${baseStyles} bg-green-500 text-white`;
            case 'error':
                return `${baseStyles} bg-red-500 text-white`;
            case 'warning':
                return `${baseStyles} bg-yellow-500 text-white`;
            case 'info':
            default:
                return `${baseStyles} bg-blue-500 text-white`;
        }
    };

    const getIcon = (type: Toast['type']) => {
        switch(type) {
            case 'success':
                return (
                    <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'error':
                return (
                    <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'warning':
                return (
                    <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                );
            case 'info':
            default:
                return (
                    <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    if (toastStore.toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
            {toastStore.toasts.map(toast => (
                <div 
                    key={toast.id} 
                    className={getToastStyles(toast.type)}
                >
                    {getIcon(toast.type)}
                    <p className="flex-1 font-medium">{toast.message}</p>
                    <button
                        onClick={() => toastStore.removeToast(toast.id)}
                        className="flex-shrink-0 hover:bg-white/20 rounded p-1 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    );
});

export default ToastContainer;
