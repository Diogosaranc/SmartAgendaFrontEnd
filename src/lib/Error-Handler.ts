'use client';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function ErrorHandler() {
  useEffect(() => {
    const handleUnhandledError = (event: ErrorEvent) => {
      console.error('Unhandled error:', event.error);
      toast.error('Algo deu errado. Tente novamente.');
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);

      // Check if it's a 401 error that wasn't handled
      if (event.reason?.response?.status === 401) {
        toast.error('Sua sessão expirou. Redirecionando...');
        setTimeout(() => {
          window.location.href = '/log-in';
        }, 2000);
      }
    };

    window.addEventListener('error', handleUnhandledError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleUnhandledError);
      window.removeEventListener(
        'unhandledrejection',
        handleUnhandledRejection
      );
    };
  }, []);

  return null;
}
