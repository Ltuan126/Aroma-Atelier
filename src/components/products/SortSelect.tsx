"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SortSelect({ currentSort }: { currentSort: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const val = e.target.value;
    if (val && val !== "default") {
      params.set("sort", val);
    } else {
      params.delete("sort");
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="sort-select" className="text-zinc-400 dark:text-zinc-500 text-xs">Sắp xếp theo:</label>
      <select
        id="sort-select"
        value={currentSort || "default"}
        onChange={handleChange}
        className="bg-transparent border-none font-semibold text-zinc-700 dark:text-zinc-300 focus:ring-0 text-xs cursor-pointer py-1"
      >
        <option value="default">Mặc định</option>
        <option value="price_asc">Giá tăng dần</option>
        <option value="price_desc">Giá giảm dần</option>
        <option value="name_asc">Tên A-Z</option>
      </select>
    </div>
  );
}
