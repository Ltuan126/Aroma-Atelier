"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { formatPrice, getProductDisplay } from "@/data/products";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string | null;
  };
};

type Order = {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  orderItems: OrderItem[];
};

const STATUS_MAP: Record<string, { label: string; color: string; icon: string }> = {
  PENDING: {
    label: "Chờ xử lý",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/50",
    icon: "⏳",
  },
  PROCESSING: {
    label: "Đang xử lý",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/50",
    icon: "🔄",
  },
  SHIPPED: {
    label: "Đang giao",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800/50",
    icon: "🚚",
  },
  DELIVERED: {
    label: "Đã giao",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50",
    icon: "✅",
  },
  CANCELLED: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/50",
    icon: "❌",
  },
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent("/orders")}`);
      return;
    }
    if (status === "authenticated") {
      fetchOrders();
    }
  }, [status, router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (status === "loading" || loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">
          Đang tải đơn hàng...
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h1 className="font-serif text-2xl font-bold text-zinc-900 dark:text-white mb-2">
          Chưa có đơn hàng nào
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-8 max-w-xs mx-auto leading-relaxed">
          Bạn chưa đặt đơn hàng nào. Hãy khám phá các sản phẩm và đặt đơn hàng đầu tiên nhé!
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-zinc-900 dark:text-white">
            Đơn hàng của bạn
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Theo dõi trạng thái và lịch sử đơn hàng
          </p>
        </div>
        <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-full">
          {orders.length} đơn hàng
        </span>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => {
          const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.PENDING;
          const isExpanded = expandedOrder === order.id;
          const orderDate = new Date(order.createdAt);

          return (
            <div
              key={order.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300"
            >
              {/* Order Header */}
              <button
                onClick={() => toggleExpand(order.id)}
                className="w-full p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-lg">
                    {statusInfo.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                      Mã đơn: {order.id.slice(0, 8)}...
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {orderDate.toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold border ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white min-w-[100px] text-right">
                    {formatPrice(order.totalAmount)}
                  </span>
                  <svg
                    className={`w-4 h-4 text-zinc-400 dark:text-zinc-500 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Order Details (Expanded) */}
              {isExpanded && (
                <div className="border-t border-zinc-100 dark:border-zinc-800 px-5 pb-5 animate-in slide-in-from-top-1 fade-in duration-200">
                  <div className="pt-4 space-y-3">
                    <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                      Sản phẩm trong đơn ({order.orderItems.length})
                    </p>
                    {order.orderItems.map((item) => {
                      const display = getProductDisplay(item.product.image);
                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl"
                        >
                          <div
                            className={`w-12 h-12 rounded-lg bg-gradient-to-br ${display.imageGrad} flex items-center justify-center text-xl shadow-inner flex-shrink-0`}
                          >
                            <span>{display.icon}</span>
                          </div>
                          <div className="flex-grow min-w-0">
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="text-xs font-semibold text-zinc-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-1"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                              SL: {item.quantity} × {formatPrice(item.price)}
                            </p>
                          </div>
                          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            {formatPrice(item.quantity * item.price)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order Summary Footer */}
                  <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                      Tổng thanh toán
                    </span>
                    <span className="text-base font-serif font-bold text-emerald-600 dark:text-emerald-400">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
