'use client';

export default function LoadingCard() {
  return (
    <div className="glass rounded-xl p-6 h-64 animate-slide-up">
      <div className="animate-pulse space-y-4">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="w-16 h-16 bg-[#00d4ff]/20 rounded-full"></div>
          <div className="w-8 h-8 bg-[#00d4ff]/20 rounded"></div>
          <div className="w-16 h-16 bg-[#00d4ff]/20 rounded-full"></div>
        </div>
        
        {/* Team names skeleton */}
        <div className="flex justify-between">
          <div className="h-4 bg-[#00d4ff]/20 rounded w-24"></div>
          <div className="h-4 bg-[#00d4ff]/20 rounded w-24"></div>
        </div>
        
        {/* Form skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-[#00d4ff]/20 rounded w-20"></div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-6 h-6 bg-[#00d4ff]/20 rounded"></div>
            ))}
          </div>
        </div>
        
        {/* Stats skeleton */}
        <div className="h-4 bg-[#00d4ff]/20 rounded w-32"></div>
        <div className="space-y-2">
          <div className="h-3 bg-[#00d4ff]/10 rounded w-full"></div>
          <div className="h-3 bg-[#00d4ff]/10 rounded w-full"></div>
          <div className="h-3 bg-[#00d4ff]/10 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}
