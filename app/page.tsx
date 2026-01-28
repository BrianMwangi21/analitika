'use client';

import Header from '@/components/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] font-mono">
      <Header />
      
      <main className="flex-1 px-4 pb-8">
        <div className="mx-auto max-w-7xl">
          {/* Grid for cards - 1 mobile, 2 tablet, 3 desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Empty cards placeholder */}
            <div className="glass rounded-xl p-6 h-64 flex items-center justify-center border-dashed border-2 border-[#00d4ff]/30">
              <span className="text-[#00d4ff]/50">Cards will appear here</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
