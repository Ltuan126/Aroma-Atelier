import React from "react";

export default function StoreHomeLoading() {
  return (
    <div className="space-y-16 pb-20 animate-pulse">
      {/* Hero Section Loading Skeleton */}
      <section className="relative overflow-hidden bg-zinc-50 dark:bg-zinc-900/10 py-20 sm:py-32 border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 flex flex-col items-center">
          {/* Badge Skeleton */}
          <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          
          {/* Main Title Skeleton */}
          <div className="space-y-3 w-full max-w-3xl flex flex-col items-center">
            <div className="h-10 sm:h-12 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
            <div className="h-10 sm:h-12 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
          </div>

          {/* Subtitle Skeleton */}
          <div className="space-y-2 w-full max-w-xl flex flex-col items-center">
            <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-4 w-5/6 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>

          {/* CTA Buttons Skeleton */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
            <div className="h-12 w-full sm:w-36 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
            <div className="h-12 w-full sm:w-36 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          </div>
        </div>
      </section>

      {/* Categories Section Loading Skeleton */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3 flex flex-col items-center">
          <div className="h-8 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          <div className="h-4 w-96 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>

        {/* 3 Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="p-6 bg-white dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl flex flex-col items-center text-center space-y-4"
            >
              <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
              <div className="h-5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-3 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Loading Skeleton */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
            <div className="h-4 w-80 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>
          <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>

        {/* 4 Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-zinc-900/20 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden flex flex-col space-y-4 pb-5"
            >
              {/* Product Image Box */}
              <div className="h-64 bg-zinc-250 dark:bg-zinc-850" />

              {/* Product Info */}
              <div className="px-5 space-y-4 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  <div className="h-5 w-40 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  <div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
