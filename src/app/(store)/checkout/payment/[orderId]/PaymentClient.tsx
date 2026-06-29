"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatPrice, getProductDisplay } from "@/data/products";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    price: number;
    image: string | null;
  };
};

type Order = {
  id: string;
  totalAmount: number;
  createdAt: Date | string;
  orderItems: OrderItem[];
};

export default function PaymentClient({ order }: { order: Order }) {
  const router = useRouter();
  const [method, setMethod] = useState<"STRIPE" | "QR" | "COD">("STRIPE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stripe form fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // QR Countdown
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    if (method !== "QR") return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [method]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
    setCardNumber(formatted.slice(0, 19));
  };

  // Format Expiry MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    let formatted = raw;
    if (raw.length > 2) {
      formatted = `${raw.slice(0, 2)}/${raw.slice(2, 4)}`;
    }
    setExpiry(formatted.slice(0, 5));
  };

  // Handle Payment Submit
  const handlePay = async (success: boolean) => {
    setLoading(true);
    setError(null);

    // If Stripe was chosen, perform basic client-side check
    if (method === "STRIPE" && success) {
      if (cardNumber.replace(/\s+/g, "").length !== 16) {
        setError("Số thẻ tín dụng phải gồm 16 chữ số.");
        setLoading(false);
        return;
      }
      if (!cardName) {
        setError("Vui lòng điền tên chủ thẻ.");
        setLoading(false);
        return;
      }
      if (expiry.length !== 5) {
        setError("Hạn sử dụng thẻ không hợp lệ (Định dạng MM/YY).");
        setLoading(false);
        return;
      }
      if (cvv.length !== 3) {
        setError("Mã bảo mật CVV phải gồm 3 chữ số.");
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/checkout/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          paymentMethod: method === "STRIPE" ? "STRIPE_CREDIT_CARD" : method === "QR" ? "ONLINE_QR" : "COD",
          success,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Giao dịch không thành công");
      }

      if (success) {
        // Redirect to success page or show success state
        router.push("/orders?checkoutSuccess=true");
      } else {
        // Redirect back to cart or show cancellation page
        router.push("/cart?paymentFailed=true");
      }
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-300">
      <div className="text-center md:text-left mb-8 pb-6 border-b border-zinc-200/50 dark:border-zinc-800/50 space-y-2">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 dark:text-white">Thanh Toán Đơn Hàng</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Chọn hình thức thanh toán để hoàn tất đặt hàng sản phẩm của bạn.</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl p-4 mb-6 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
          <span className="text-base">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Order Info & Summary */}
        <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-6 space-y-6">
          <h2 className="font-serif text-lg font-bold text-zinc-900 dark:text-white">
            Tóm tắt đơn hàng
          </h2>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50 max-h-72 overflow-y-auto pr-1">
            {order.orderItems.map((item) => {
              const display = getProductDisplay(item.product.image);
              return (
                <div key={item.id} className="flex items-center gap-3 py-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${display.imageGrad} flex items-center justify-center text-lg flex-shrink-0`}>
                    <span>{display.icon}</span>
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">{item.product.name}</p>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500">{item.quantity} x {formatPrice(item.price)}</p>
                  </div>
                  <span className="text-xs font-semibold text-zinc-900 dark:text-white">{formatPrice(item.quantity * item.price)}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-zinc-150 dark:border-zinc-800 space-y-3 text-xs">
            <div className="flex justify-between text-zinc-550 dark:text-zinc-400">
              <span>Đơn giá tạm tính</span>
              <span className="font-medium">{formatPrice(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-900 dark:text-white font-semibold">Cần thanh toán</span>
              <span className="text-xl font-serif font-bold text-emerald-600 dark:text-emerald-400">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Payment Methods & Actions */}
        <div className="lg:col-span-8 space-y-6">
          {/* Selector Tabs */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "STRIPE" as const, label: "Thẻ Tín Dụng", desc: "Giả lập Stripe", icon: "💳" },
              { id: "QR" as const, label: "Quét Mã QR", desc: "MoMo / VNPAY", icon: "📱" },
              { id: "COD" as const, label: "Khi Nhận Hàng", desc: "Ship COD", icon: "🚚" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setMethod(opt.id)}
                className={`p-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center space-y-1.5 ${
                  method === opt.id
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-semibold shadow-inner"
                    : "bg-white dark:bg-zinc-900 border-zinc-200/50 dark:border-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <span className="text-2xl">{opt.icon}</span>
                <span className="text-xs block">{opt.label}</span>
                <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-normal">{opt.desc}</span>
              </button>
            ))}
          </div>

          {/* Form Content Area */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-6">
            {method === "STRIPE" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Thẻ tín dụng giả lập (Stripe UI)</h3>
                  <div className="flex gap-1.5">
                    <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded font-mono text-zinc-500">Visa</span>
                    <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded font-mono text-zinc-500">MasterCard</span>
                  </div>
                </div>

                {/* Premium Visual Card Graphic */}
                <div className="w-full max-w-sm mx-auto h-48 bg-gradient-to-tr from-zinc-900 via-zinc-850 to-emerald-950 border border-zinc-800 text-zinc-100 rounded-2xl p-5 shadow-2xl relative flex flex-col justify-between overflow-hidden group select-none">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-7 bg-amber-500/30 border border-amber-500/20 rounded-md" />
                    <span className="font-serif italic font-semibold text-zinc-400 tracking-wider">Aroma Card</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Số thẻ</span>
                    <span className="font-mono text-lg font-semibold tracking-widest block text-white min-h-[1.75rem]">
                      {cardNumber || "•••• •••• •••• ••••"}
                    </span>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="space-y-0.5">
                      <span className="text-[8px] text-zinc-500 uppercase tracking-widest block">Chủ thẻ</span>
                      <span className="text-xs font-semibold tracking-wider block text-zinc-200 uppercase truncate max-w-[200px]">
                        {cardName || "TUAN NGUYEN LE"}
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <div className="space-y-0.5">
                        <span className="text-[8px] text-zinc-500 uppercase tracking-widest block">Hạn dùng</span>
                        <span className="font-mono text-xs font-semibold block text-zinc-200">
                          {expiry || "MM/YY"}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[8px] text-zinc-500 uppercase tracking-widest block">CVV</span>
                        <span className="font-mono text-xs font-semibold block text-zinc-200">
                          {cvv ? "•••" : "•••"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card input forms */}
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-350">Số thẻ</label>
                    <input
                      type="text"
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="w-full px-3 py-2 text-xs bg-transparent border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 rounded-xl font-mono text-zinc-700 dark:text-zinc-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-350">Tên chủ thẻ</label>
                    <input
                      type="text"
                      placeholder="NGUYEN VAN A"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 text-xs bg-transparent border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 rounded-xl text-zinc-700 dark:text-zinc-200 uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-350">Hạn sử dụng</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={handleExpiryChange}
                        className="w-full px-3 py-2 text-xs bg-transparent border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 rounded-xl font-mono text-zinc-700 dark:text-zinc-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-350">Mã bảo mật (CVV)</label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={3}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, "").slice(0, 3))}
                        className="w-full px-3 py-2 text-xs bg-transparent border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 rounded-xl font-mono text-zinc-700 dark:text-zinc-200"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => handlePay(true)}
                      disabled={loading}
                      className="flex-grow h-11 flex items-center justify-center text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-650 hover:from-emerald-500 hover:to-teal-555 rounded-xl shadow-md disabled:opacity-50 transition-all duration-200"
                    >
                      {loading ? "Đang xử lý..." : "Xác nhận thanh toán"}
                    </button>
                    <button
                      onClick={() => handlePay(false)}
                      disabled={loading}
                      className="px-4 h-11 flex items-center justify-center text-xs font-semibold text-red-500 border border-red-550/20 hover:bg-red-950/30 rounded-xl transition-all duration-200"
                    >
                      Hủy giao dịch
                    </button>
                  </div>
                </div>
              </div>
            )}

            {method === "QR" && (
              <div className="space-y-6 text-center">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Quét mã QR (MoMo / VNPAY)</h3>
                
                <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl inline-block max-w-sm mx-auto shadow-inner relative">
                  {/* Fake QR Graphic */}
                  <div className="w-48 h-48 bg-white border border-zinc-200 rounded-xl mx-auto flex items-center justify-center p-3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px] opacity-80" />
                    {/* Add visual QR corners to make it look realistic */}
                    <div className="absolute top-3 left-3 w-10 h-10 border-4 border-black bg-white" />
                    <div className="absolute top-3 right-3 w-10 h-10 border-4 border-black bg-white" />
                    <div className="absolute bottom-3 left-3 w-10 h-10 border-4 border-black bg-white" />
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl z-10 flex items-center justify-center font-bold text-emerald-600 text-xs shadow-md border border-emerald-500/30">
                      🌿
                    </div>
                  </div>

                  <div className="mt-4 space-y-1">
                    <p className="text-xs font-bold text-zinc-700 dark:text-zinc-200">Mã đơn hàng: #{order.id.slice(0, 8)}</p>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatPrice(order.totalAmount)}</p>
                  </div>

                  {/* Countdown timer */}
                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-[10px] font-bold">
                    <span>⏳</span>
                    <span>Hết hạn trong: {formatTime(timeLeft)}</span>
                  </div>
                </div>

                <div className="space-y-3 max-w-xs mx-auto">
                  <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-ping" />
                    <span>Đang chờ chuyển khoản từ ứng dụng...</span>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handlePay(true)}
                      disabled={loading || timeLeft === 0}
                      className="flex-grow h-10 flex items-center justify-center text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow transition-colors disabled:opacity-50"
                    >
                      {loading ? "..." : "Xác nhận đã chuyển khoản"}
                    </button>
                    <button
                      onClick={() => handlePay(false)}
                      disabled={loading}
                      className="px-3 h-10 flex items-center justify-center text-xs font-semibold text-red-400 border border-red-800/30 hover:bg-red-950/30 rounded-xl transition-all"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            )}

            {method === "COD" && (
              <div className="space-y-6 max-w-md mx-auto text-center py-6">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-3xl">
                  🚚
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">Thanh toán khi nhận hàng (Ship COD)</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-450 leading-relaxed">
                    Bạn chọn thanh toán bằng tiền mặt cho nhân viên giao hàng sau khi nhận và kiểm tra sản phẩm thành công. Phí ship (nếu có) sẽ được tính trực tiếp vào tổng tiền thanh toán.
                  </p>
                </div>

                <div className="flex gap-3 pt-4 justify-center">
                  <button
                    onClick={() => handlePay(true)}
                    disabled={loading}
                    className="px-8 h-11 flex items-center justify-center text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-650 hover:from-emerald-500 hover:to-teal-555 rounded-xl shadow-md disabled:opacity-50 transition-all duration-200"
                  >
                    {loading ? "Đang xử lý..." : "Xác nhận đặt hàng COD"}
                  </button>
                  <button
                    onClick={() => handlePay(false)}
                    disabled={loading}
                    className="px-4 h-11 flex items-center justify-center text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
