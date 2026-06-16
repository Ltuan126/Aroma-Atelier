"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/providers/CartProvider";

interface AddToCartButtonProps {
  product: {
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
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOutOfStock = product.stock === 0;

  const handleAddToCart = async () => {
    if (isOutOfStock || loading) return;
    setError(null);

    setLoading(true);
    const result = await addToCart(product.id, quantity, product);
    setLoading(false);

    if (result.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } else {
      setError(result.error || "Có lỗi xảy ra khi thêm vào giỏ hàng");
    }
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
          Số lượng
        </label>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1 || isOutOfStock}
              className="w-10 h-10 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 transition-colors"
              aria-label="Giảm số lượng"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
              </svg>
            </button>
            <span className="w-12 text-center text-sm font-semibold text-zinc-800 dark:text-zinc-200 select-none">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              disabled={quantity >= product.stock || isOutOfStock}
              className="w-10 h-10 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 transition-colors"
              aria-label="Tăng số lượng"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            {isOutOfStock ? "Hết hàng" : `Còn ${product.stock} sản phẩm`}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          id="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={isOutOfStock || loading}
          className={`flex-1 h-12 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed ${
            added
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
              : isOutOfStock
              ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500"
              : "bg-zinc-900 dark:bg-zinc-800 text-white hover:bg-emerald-600 dark:hover:bg-emerald-600 shadow-md hover:shadow-emerald-500/20 active:scale-95"
          }`}
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Đang thêm...
            </>
          ) : added ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Đã thêm vào giỏ!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ hàng"}
            </>
          )}
        </button>

        {/* Wishlist button */}
        <button
          className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-red-300 hover:text-red-500 dark:hover:border-red-700 dark:hover:text-red-400 transition-all duration-200"
          aria-label="Thêm vào yêu thích"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-500 font-medium mt-1 animate-pulse">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
