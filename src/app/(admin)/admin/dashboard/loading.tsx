import React from "react";

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Title & Actions Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-zinc-800 rounded-xl" />
          <div className="h-4 w-40 bg-zinc-800 rounded" />
        </div>
        <div className="h-9 w-36 bg-zinc-800 rounded-xl" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="p-6 bg-zinc-900/40 border border-zinc-850 rounded-2xl space-y-4"
          >
            <div className="h-3.5 w-36 bg-zinc-800 rounded" />
            <div className="h-7 w-28 bg-zinc-800 rounded-lg" />
            <div className="h-3 w-48 bg-zinc-800 rounded" />
          </div>
        ))}
      </div>

      {/* Charts & Breakdown Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart (Col span 2) */}
        <div className="lg:col-span-2 bg-zinc-900/20 border border-zinc-850 rounded-2xl p-6 space-y-6">
          <div className="space-y-2 border-b border-zinc-800/80 pb-4">
            <div className="h-5 w-44 bg-zinc-800 rounded" />
            <div className="h-3 w-64 bg-zinc-800 rounded" />
          </div>
          {/* Mock CSS Bar Chart Bars */}
          <div className="flex items-end justify-between h-48 pt-4 px-2">
            {[40, 20, 60, 30, 80, 50, 10].map((height, i) => (
              <div key={i} className="flex flex-col items-center space-y-2 w-full">
                <div
                  style={{ height: `${height}%` }}
                  className="w-8 bg-zinc-800 rounded-t-lg"
                />
                <div className="h-3 w-12 bg-zinc-800 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method Breakdown (Col span 1) */}
        <div className="bg-zinc-900/20 border border-zinc-850 rounded-2xl p-6 space-y-6">
          <div className="border-b border-zinc-800/80 pb-4">
            <div className="h-5 w-40 bg-zinc-800 rounded" />
            <div className="h-3 w-56 bg-zinc-800 rounded" />
          </div>
          {/* Method Bars */}
          <div className="space-y-6 py-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 w-32 bg-zinc-800 rounded" />
                  <div className="h-4 w-20 bg-zinc-800 rounded" />
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (Col span 2) */}
        <div className="lg:col-span-2 bg-zinc-900/20 border border-zinc-850 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-zinc-850 flex justify-between items-center">
            <div className="h-5 w-36 bg-zinc-800 rounded" />
            <div className="h-4 w-44 bg-zinc-800 rounded" />
          </div>
          {/* Mock Table Rows */}
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-zinc-850/50">
                <div className="h-4 w-20 bg-zinc-800 rounded" />
                <div className="h-4 w-28 bg-zinc-800 rounded" />
                <div className="h-4 w-20 bg-zinc-800 rounded" />
                <div className="h-6 w-24 bg-zinc-800 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products (Col span 1) */}
        <div className="bg-zinc-900/20 border border-zinc-850 rounded-2xl p-6 space-y-6">
          <div className="border-b border-zinc-850 pb-4">
            <div className="h-5 w-44 bg-zinc-800 rounded" />
            <div className="h-3 w-52 bg-zinc-800 rounded" />
          </div>
          {/* Product Items List */}
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 bg-zinc-900/40 border border-zinc-800/50 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-zinc-800" />
                <div className="flex-grow space-y-1.5 min-w-0">
                  <div className="h-3.5 w-32 bg-zinc-800 rounded" />
                  <div className="h-3 w-20 bg-zinc-800 rounded" />
                </div>
                <div className="w-16 h-5 bg-zinc-800 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
