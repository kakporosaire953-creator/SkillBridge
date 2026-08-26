import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F7F6] flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header skeleton */}
        <div className="flex items-center justify-between border-b border-[#E2E8E5] pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl sb-skeleton" />
            <div className="space-y-2">
              <div className="h-6 w-48 rounded-lg sb-skeleton" />
              <div className="h-4 w-32 rounded-lg sb-skeleton opacity-60" />
            </div>
          </div>
          <div className="h-10 w-28 rounded-xl sb-skeleton" />
        </div>

        {/* Content grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <div className="h-64 bg-white border border-[#E2E8E5] rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 shadow-2xs">
              <div className="w-24 h-24 rounded-full sb-skeleton" />
              <div className="h-4 w-32 rounded-lg sb-skeleton" />
              <div className="h-3 w-20 rounded-lg sb-skeleton opacity-60" />
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="bg-white border border-[#E2E8E5] rounded-2xl p-6 space-y-6 shadow-2xs">
              <div className="h-5 w-40 rounded-lg sb-skeleton" />
              <div className="space-y-3">
                <div className="h-10 rounded-xl sb-skeleton" />
                <div className="h-10 rounded-xl sb-skeleton opacity-80" />
                <div className="h-24 rounded-xl sb-skeleton opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
