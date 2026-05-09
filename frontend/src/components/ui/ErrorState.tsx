import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({ message = 'Something went wrong', onRetry }: ErrorStateProps) => (
  <div className="flex flex-col items-center justify-center p-12 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
      <AlertCircle className="h-8 w-8 text-red-500" />
    </div>
    <h3 className="mt-4 text-lg font-semibold text-gray-900">Oops!</h3>
    <p className="mt-2 max-w-sm text-sm text-gray-500">{message}</p>
    {onRetry && (
      <Button variant="outline" className="mt-6" onClick={onRetry}>
        Try Again
      </Button>
    )}
  </div>
);
