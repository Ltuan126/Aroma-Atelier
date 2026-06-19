"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/components/providers/CartProvider";
import { getProductDisplay, formatPrice } from "@/data/products";

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    items,
    cartTotal,
    loading: cartLoading,
    updateQuantity,
    removeFromCart,
    refreshCart,
  } = useCart();

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  if (status === "loading") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">Đang tải giỏ hàng...</p>
      </div>
    );
  }

  const shippingFee = cartTotal >= 500000 ? 0 : 30000;
  const grandTotal = cartTotal + shippingFee;

  const handleUpdateQuantity = async (itemId: string, currentQty: number, change: number, stock: number) => {
    const newQty = currentQty + change;
    if (newQty < 1 || newQty > stock) return;
    
    setError(null);
    const res = await updateQuantity(itemId, newQty);
    if (!res.success) {
      setError(res.error || "Không thể cập nhật số lượng");
      setTimeout(() => setError(null), 4000);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setError(null);
    const res = await removeFromCart(itemId);
    if (!res.success) {
      setError(res.error || "Không thể xóa sản phẩm");
      setTimeout(() => setError(null), 4000);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0 || checkoutLoading) return;
    
    // Kiểm tra đăng nhập khi thanh toán
    if (status !== "authenticated") {
      setShowLoginModal(true);
      return;
    }

    setCheckoutLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Có lỗi xảy ra trong quá trình đặt hàng");
      }
      refreshCart(); // Reset giỏ hàng client
      router.push(`/checkout/payment/${data.orderId}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Đặt hàng không thành công, vui lòng thử lại.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (checkoutSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-serif text-3xl font-bold text-zinc-950 dark:text-white mb-2">
          Đặt hàng thành công!
        </h1>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6 max-w-md mx-auto leading-relaxed">
          Cảm ơn bạn đã lựa chọn Aroma Atelier. Đơn hàng của bạn đã được nhận và đang được nhân viên chuẩn bị đóng gói gửi đi.
        </p>
        {orderId && (
          <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-2xl p-4 mb-8 max-w-sm mx-auto">
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">
              Mã đơn hàng của bạn
            </span>
            <span className="font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-400 select-all">
              {orderId}
            </span>
          </div>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/orders"
            className="inline-flex items-center justify-center px-6 h-12 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-900/10 rounded-xl transition-all duration-200"
          >
            Xem đơn hàng của bạn
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 h-12 text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 rounded-xl transition-all duration-200"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h1 className="font-serif text-2xl font-bold text-zinc-900 dark:text-white mb-2">
          Giỏ hàng của bạn đang trống
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-8 max-w-xs mx-auto leading-relaxed">
          Hiện tại giỏ hàng của bạn chưa có sản phẩm nào. Hãy khám phá và chọn lấy hương thơm phù hợp nhất nhé!
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center px-6 h-11 text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-800 hover:bg-emerald-600 dark:hover:bg-emerald-600 shadow-md rounded-xl transition-all duration-200"
        >
          Khám phá sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-300">
      <h1 className="font-serif text-3xl font-bold text-zinc-900 dark:text-white mb-8">
        Giỏ hàng
      </h1>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl p-4 mb-6 text-xs text-red-600 dark:text-red-400 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const display = getProductDisplay(item.product.image);
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300"
              >
                {/* Product Info */}
                <div className="flex items-center gap-4">
                  {/* Visual Image representation */}
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br ${display.imageGrad} flex items-center justify-center text-3xl shadow-inner flex-shrink-0 relative overflow-hidden`}
                  >
                    <span>{display.icon}</span>
                    <span className="absolute top-1 left-1 bg-white/80 dark:bg-zinc-950/80 px-1.5 py-0.5 rounded text-[8px] font-bold text-zinc-500 uppercase tracking-wider scale-90 origin-top-left">
                      {display.tag}
                    </span>
                  </div>

                  <div>
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-serif text-base font-semibold text-zinc-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 line-clamp-2 max-w-md">
                      {item.product.description}
                    </p>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block mt-1.5">
                      {formatPrice(item.product.price)}
                    </span>
                  </div>
                </div>

                {/* Modifiers & Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-100 dark:border-zinc-800">
                  {/* Quantity Modifier */}
                  <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-950">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, -1, item.product.stock)}
                      disabled={item.quantity <= 1 || cartLoading}
                      className="w-9 h-9 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-30 transition-colors"
                      aria-label="Giảm số lượng"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="w-10 text-center text-xs font-semibold text-zinc-800 dark:text-zinc-200 select-none">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, 1, item.product.stock)}
                      disabled={item.quantity >= item.product.stock || cartLoading}
                      className="w-9 h-9 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-30 transition-colors"
                      aria-label="Tăng số lượng"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>

                  {/* Total for Item & Delete */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-zinc-950 dark:text-white w-24 text-right">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={cartLoading}
                      className="p-2 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all duration-200"
                      aria-label="Xóa sản phẩm"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Checkout Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="font-serif text-lg font-bold text-zinc-900 dark:text-white mb-6">
              Đơn hàng
            </h2>

            <div className="space-y-4 text-xs mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                <span>Tạm tính</span>
                <span className="font-semibold text-zinc-800 dark:text-white">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                <span>Phí vận chuyển</span>
                <span className="font-semibold text-zinc-800 dark:text-white">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Miễn phí</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>
              {shippingFee > 0 && (
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-normal">
                  💡 Mua thêm <strong className="text-zinc-500 dark:text-zinc-400">{formatPrice(500000 - cartTotal)}</strong> để được miễn phí vận chuyển.
                </p>
              )}
            </div>

            <div className="flex justify-between items-baseline mb-8">
              <span className="text-xs font-semibold text-zinc-900 dark:text-white">Tổng cộng</span>
              <span className="text-2xl font-serif font-bold text-emerald-600 dark:text-emerald-400">
                {formatPrice(grandTotal)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkoutLoading || items.length === 0}
              className="w-full h-12 flex items-center justify-center gap-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-950/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-300"
            >
              {checkoutLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Đang xử lý đơn hàng...
                </>
              ) : (
                "Tiến hành đặt hàng"
              )}
            </button>

            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 text-center mt-4">
              🔒 Giao dịch được bảo mật & an toàn tuyệt đối
            </p>
          </div>
        </div>
      </div>

      {/* Login Prompt Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-lg">
              🔐
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-base font-bold text-white">Yêu cầu Đăng nhập</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Vui lòng đăng nhập hoặc đăng ký tài khoản mới để tiến hành thanh toán và dễ dàng theo dõi đơn hàng của bạn.
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href={`/login?callbackUrl=${encodeURIComponent("/cart")}`}
                className="h-10 w-full flex items-center justify-center rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all duration-200 shadow-md shadow-emerald-900/10"
              >
                Đăng nhập ngay
              </Link>
              <Link
                href={`/register?callbackUrl=${encodeURIComponent("/cart")}`}
                className="h-10 w-full flex items-center justify-center rounded-xl text-xs font-semibold text-zinc-300 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 transition-all duration-200"
              >
                Đăng ký tài khoản mới
              </Link>
              <button
                onClick={() => setShowLoginModal(false)}
                className="h-9 w-full text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors pt-1"
              >
                Quay lại giỏ hàng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
