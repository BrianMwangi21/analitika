'use client';

import { Plus } from 'lucide-react';

interface EmptyCardProps {
  onClick: () => void;
}

export default function EmptyCard({ onClick }: EmptyCardProps) {
  return (
    <button
      onClick={onClick}
      className="glass rounded-xl p-6 h-64 w-full flex items-center justify-center 
        border-2 border-dashed border-[#00d4ff]/30 
        hover:border-[#00d4ff]/60 hover:scale-[1.02] hover:glow
        transition-all duration-300 cursor-pointer group"
    >
      <Plus 
        className="w-12 h-12 text-[#00d4ff]/50 group-hover:text-[#00d4ff] 
          transition-colors duration-300" 
      />
    </button>
  );
}
