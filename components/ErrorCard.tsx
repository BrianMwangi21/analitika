'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorCardProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorCard({ message, onRetry }: ErrorCardProps) {
  return (
    <div className="glass rounded-xl p-6 h-64 flex flex-col items-center justify-center text-center animate-slide-up">
      <div className="mb-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
      </div>
      <p className="text-red-400 mb-4 text-sm">{message}</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 bg-[#00d4ff]/20 border border-[#00d4ff]/50 
          rounded-lg text-[#00d4ff] hover:bg-[#00d4ff]/30 transition-all"
      >
        <RefreshCw className="w-4 h-4" />
        Retry
      </button>
    </div>
  );
}
