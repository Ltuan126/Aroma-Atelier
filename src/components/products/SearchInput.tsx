"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [text, setText] = useState(searchParams.get("search") || "");

  useEffect(() => {
    setText(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (text) {
        params.set("search", text);
      } else {
        params.delete("search");
      }
      
      startTransition(() => {
        router.push(`/products?${params.toString()}`);
      });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [text, router, searchParams]);

  const handleClear = () => {
    setText("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-4 w-4 text-zinc-400 dark:text-zinc-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Tìm kiếm sản phẩm..."
        className="block w-full pl-9 pr-10 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 rounded-xl transition-all duration-200"
      />
      {text && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors duration-150"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
      {isPending && (
        <div className="absolute right-10 inset-y-0 flex items-center">
          <svg
            className="animate-spin h-4 w-4 text-emerald-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
