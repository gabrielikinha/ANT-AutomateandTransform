import { useCallback, useState } from 'react';
import { ToastData } from '@/components/ui/Toast';

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const show = useCallback((message: string, variant: 'success' | 'error' = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, variant }]);
  }, []);

  const close = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((message: string) => show(message, 'success'), [show]);
  const error = useCallback((message: string) => show(message, 'error'), [show]);

  return { toasts, show, close, success, error };
}
