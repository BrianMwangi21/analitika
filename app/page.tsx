'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { searchTeams } from '@/lib/footballApi';
import { Team } from '@/types';

export default function Home() {
  const [testResults, setTestResults] = useState<Team[] | null>(null);
  const [testError, setTestError] = useState<string | null>(null);

  const handleTestApi = async () => {
    try {
      setTestError(null);
      const results = await searchTeams('Manchester');
      setTestResults(results);
      console.log('API Test Results:', results);
    } catch (error) {
      setTestError('API Error: ' + (error instanceof Error ? error.message : String(error)));
      console.error('API Test Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] font-mono">
      <Header />
      
      <main className="flex-1 px-4 pb-8">
        <div className="mx-auto max-w-7xl">
          {/* API Test Section */}
          <div className="mb-8 p-4 glass rounded-xl">
            <h2 className="text-lg font-bold text-[#00d4ff] mb-4">API Test</h2>
            <button
              onClick={handleTestApi}
              className="px-4 py-2 bg-[#00d4ff]/20 border border-[#00d4ff] rounded-lg text-[#00d4ff] hover:bg-[#00d4ff]/30 transition-all"
            >
              Test Search API (Manchester)
            </button>
            
            {testError && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
                {testError}
              </div>
            )}
            
            {testResults && testResults.length > 0 && (
              <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                <p className="text-green-400 mb-2">API Working! Found {testResults.length} teams:</p>
                <ul className="text-white text-sm">
                  {testResults.map(team => (
                    <li key={team.id} className="flex items-center gap-2 py-1">
                      <img src={team.logo} alt={team.name} className="w-6 h-6 object-contain" />
                      {team.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {testResults && testResults.length === 0 && !testError && (
              <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-400">
                API returned 0 results. Check console for details.
              </div>
            )}
          </div>

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
