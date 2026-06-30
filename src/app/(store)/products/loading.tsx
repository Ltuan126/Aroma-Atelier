import React from "react";

export default function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
      {/* Header & Search Bar Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-6">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          <div className="h-4 w-64 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
        {/* Search input placeholder */}
        <div className="w-full md:w-80 h-11 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left: Filter Sidebar Skeleton */}
        <div className="lg:col-span-1 space-y-6">
          {/* Categories Filter Box */}
          <div className="p-5 bg-white dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl space-y-4">
            <div className="h-5 w-28 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Price Range Filter Box */}
          <div className="p-5 bg-white dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl space-y-4">
            <div className="h-5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
            {/* Custom range inputs */}
            <div className="grid grid-cols-2 gap-2">
              <div className="h-9 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
              <div className="h-9 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
            </div>
            {/* Presets */}
            <div className="space-y-2 pt-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-8 bg-zinc-150 dark:bg-zinc-850 rounded-lg w-full" />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Products Grid & Sort/Pagination Skeleton */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort Bar */}
          <div className="flex justify-between items-center bg-white dark:bg-zinc-900/20 p-4 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl">
            <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-9 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
          </div>

          {/* 6 Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-zinc-900/20 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden flex flex-col space-y-4 pb-5"
              >
                {/* Product Image */}
                <div className="h-64 bg-zinc-250 dark:bg-zinc-850" />
                {/* Info */}
                <div className="px-5 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-5 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="h-5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-2 pt-6">
            <div className="h-10 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
            <div className="h-10 w-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
            <div className="h-10 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          </div>
        </div>

      </div>
    </div>
  );
}
