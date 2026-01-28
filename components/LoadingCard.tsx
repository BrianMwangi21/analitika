'use client';

export default function LoadingCard() {
  return (
    <div className="glass rounded-xl p-4 md:p-6 h-48 md:h-64 animate-slide-up">
      <div className="animate-pulse space-y-3 md:space-y-4">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 md:w-16 md:h-16 bg-[#00d4ff]/20 rounded-full"></div>
          <div className="w-6 h-6 md:w-8 md:h-8 bg-[#00d4ff]/20 rounded"></div>
          <div className="w-10 h-10 md:w-16 md:h-16 bg-[#00d4ff]/20 rounded-full"></div>
        </div>
        
        {/* Team names skeleton */}
        <div className="flex justify-between">
          <div className="h-3 md:h-4 bg-[#00d4ff]/20 rounded w-16 md:w-24"></div>
          <div className="h-3 md:h-4 bg-[#00d4ff]/20 rounded w-16 md:w-24"></div>
        </div>
        
        {/* Form skeleton */}
        <div className="space-y-1 md:space-y-2">
          <div className="h-3 md:h-4 bg-[#00d4ff]/20 rounded w-16 md:w-20"></div>
          <div className="flex gap-[2px] md:gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-5 h-5 md:w-6 md:h-6 bg-[#00d4ff]/20 rounded"></div>
            ))}
          </div>
        </div>
        
        {/* Stats skeleton */}
        <div className="h-3 md:h-4 bg-[#00d4ff]/20 rounded w-24 md:w-32"></div>
        <div className="space-y-1 md:space-y-2">
          <div className="h-2 md:h-3 bg-[#00d4ff]/10 rounded w-full"></div>
          <div className="h-2 md:h-3 bg-[#00d4ff]/10 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}
