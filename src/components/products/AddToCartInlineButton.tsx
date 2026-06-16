"use client";

import React, { useState } from "react";
import { useCart } from "@/components/providers/CartProvider";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  image: string | null;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

interface AddToCartInlineButtonProps {
  product: Product;
}

export default function AddToCartInlineButton({ product }: AddToCartInlineButtonProps) {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOutOfStock = product.stock === 0;

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài các phần tử bọc (ví dụ: Link)

    if (isOutOfStock || loading) return;
    setError(null);

    setLoading(true);
    // Truyền đầy đủ đối tượng sản phẩm để phục vụ lưu trữ LocalStorage khi là khách vãng lai
    const res = await addToCart(product.id, 1, product);
    setLoading(false);

    if (res.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } else {
      setError(res.error || "Lỗi");
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleAdd}
        disabled={isOutOfStock || loading}
        className={`h-8 px-3 rounded-lg text-xs font-semibold text-white transition-all duration-200 flex items-center justify-center gap-1 shadow-sm active:scale-95 disabled:scale-100 disabled:cursor-not-allowed ${
          added
            ? "bg-emerald-500 hover:bg-emerald-500 shadow-emerald-500/20"
            : isOutOfStock
            ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500"
            : "bg-zinc-900 dark:bg-zinc-800 hover:bg-emerald-600 dark:hover:bg-emerald-600"
        }`}
      >
        {loading ? (
          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : added ? (
          <>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>Đã thêm</span>
          </>
        ) : isOutOfStock ? (
          "Hết hàng"
        ) : (
          "Thêm vào giỏ"
        )}
      </button>

      {error && (
        <span className="absolute bottom-9 right-0 bg-red-500 text-white text-[9px] px-2 py-0.5 rounded shadow-lg whitespace-nowrap animate-bounce z-10">
          ⚠️ {error}
        </span>
      )}
    </div>
  );
}
