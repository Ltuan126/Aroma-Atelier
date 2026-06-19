"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PriceRangeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  useEffect(() => {
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
  }, [searchParams]);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    // Clear static price band filter if user uses custom min/max
    params.delete("price");

    if (minPrice) {
      params.set("minPrice", minPrice);
    } else {
      params.delete("minPrice");
    }

    if (maxPrice) {
      params.set("maxPrice", maxPrice);
    } else {
      params.delete("maxPrice");
    }

    router.push(`/products?${params.toString()}`);
  };

  const handleClear = () => {
    setMinPrice("");
    setMaxPrice("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    router.push(`/products?${params.toString()}`);
  };

  const hasFilter = searchParams.get("minPrice") || searchParams.get("maxPrice");

  return (
    <form onSubmit={handleFilter} className="space-y-3 pt-6 border-t border-zinc-200/50 dark:border-zinc-800/50">
      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
        Khoảng giá tùy chọn
      </h3>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          placeholder="Từ (đ)"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          min="0"
          className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 rounded-lg"
        />
        <span className="text-zinc-400 text-xs">-</span>
        <input
          type="number"
          placeholder="Đến (đ)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          min="0"
          className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 rounded-lg"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-grow py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors duration-200 rounded-lg"
        >
          Áp dụng
        </button>
        {hasFilter && (
          <button
            type="button"
            onClick={handleClear}
            className="px-2.5 py-1.5 text-xs font-semibold text-zinc-650 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors duration-200 rounded-lg"
          >
            Xóa
          </button>
        )}
      </div>
    </form>
  );
}
