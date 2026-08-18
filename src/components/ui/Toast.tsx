import { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export interface ToastData {
  id: number;
  message: string;
  variant: 'success' | 'error';
}

interface ToastProps {
  toast: ToastData;
  onClose: (id: number) => void;
}

export function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const isSuccess = toast.variant === 'success';

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm animate-slide-in ${
        isSuccess
          ? 'bg-white border-success-100 text-success-700'
          : 'bg-white border-error-100 text-error-700'
      }`}
    >
      {isSuccess ? <CheckCircle size={18} className="text-success-600 flex-shrink-0" /> : <AlertCircle size={18} className="text-error-500 flex-shrink-0" />}
      <span className="flex-1">{toast.message}</span>
      <button onClick={() => onClose(toast.id)} className="text-neutral-300 hover:text-neutral-500 transition-colors">
        <X size={14} />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastData[];
  onClose: (id: number) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-[70] flex flex-col gap-2 w-full max-w-xs">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onClose={onClose} />
      ))}
    </div>
  );
}
