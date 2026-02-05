'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorCardProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorCard({ message, onRetry }: ErrorCardProps) {
  return (
    <div className="panel rounded-xl p-4 md:p-6 h-48 md:h-64 flex flex-col items-center justify-center text-center animate-slide-up">
      <div className="mb-2 md:mb-4">
        <AlertCircle className="w-8 h-8 md:w-12 md:h-12 text-red-400" />
      </div>
      <p className="text-red-400 mb-3 md:mb-4 text-xs md:text-sm">{message}</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white/10 border border-white/20 
          rounded-lg text-white hover:bg-white/20 transition-all text-sm touch-manipulation"
      >
        <RefreshCw className="w-3 h-3 md:w-4 md:h-4" />
        Retry
      </button>
    </div>
  );
}
