import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-950 flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-4xl space-y-8 animate-pulse">
        {/* Header skeleton */}
        <div className="flex items-center justify-between border-b border-stone-800/80 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-stone-800" />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-stone-800 rounded-lg" />
              <div className="h-4 w-32 bg-stone-900 rounded-lg" />
            </div>
          </div>
          <div className="h-10 w-28 bg-stone-800 rounded-xl" />
        </div>

        {/* Content grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <div className="h-64 bg-stone-900/60 border border-stone-800 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-stone-800" />
              <div className="h-4 w-32 bg-stone-800 rounded-lg" />
              <div className="h-3 w-20 bg-stone-800/60 rounded-lg" />
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 space-y-6">
              <div className="h-5 w-40 bg-stone-800 rounded-lg" />
              <div className="space-y-3">
                <div className="h-10 bg-stone-800/70 rounded-xl" />
                <div className="h-10 bg-stone-800/70 rounded-xl" />
                <div className="h-24 bg-stone-800/70 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
