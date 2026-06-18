"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  orderItems: OrderItem[];
};

const STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả", icon: "📋" },
  { value: "PENDING", label: "Chờ xử lý", icon: "⏳" },
  { value: "PROCESSING", label: "Đang xử lý", icon: "🔄" },
  { value: "SHIPPED", label: "Đang giao", icon: "🚚" },
  { value: "DELIVERED", label: "Đã giao", icon: "✅" },
  { value: "CANCELLED", label: "Đã hủy", icon: "❌" },
];

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  PENDING: {
    label: "Chờ xử lý",
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  PROCESSING: {
    label: "Đang xử lý",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  SHIPPED: {
    label: "Đang giao",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
  DELIVERED: {
    label: "Đã giao",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  CANCELLED: {
    label: "Đã hủy",
    color: "bg-red-500/10 text-red-400 border-red-500/20",
  },
};

// Valid transitions for order status
const NEXT_STATUS_OPTIONS: Record<string, string[]> = {
  PENDING: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders(activeFilter);
  }, [activeFilter]);

  const fetchOrders = async (status: string) => {
    setLoading(true);
    try {
      const query = status !== "ALL" ? `?status=${status}` : "";
      const res = await fetch(`/api/admin/orders${query}`);
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

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? updatedOrder : o))
        );
      }
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Compute counts per status
  const totalCount = orders.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white">
            Quản lý đơn hàng
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Theo dõi và cập nhật trạng thái đơn hàng
          </p>
        </div>
        <div className="text-xs text-zinc-500 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg">
          Tổng: <span className="text-zinc-200 font-semibold">{totalCount}</span> đơn hàng
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setActiveFilter(opt.value)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-all duration-200 ${
              activeFilter === opt.value
                ? "bg-emerald-600/10 text-emerald-400 border-emerald-500/25"
                : "text-zinc-400 hover:text-zinc-200 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50"
            }`}
          >
            <span>{opt.icon}</span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-14 h-14 bg-zinc-900 text-zinc-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
            📦
          </div>
          <p className="text-sm text-zinc-400">Không tìm thấy đơn hàng nào</p>
          <p className="text-xs text-zinc-600 mt-1">
            {activeFilter !== "ALL" && "Thử chuyển sang tab khác hoặc xem tất cả đơn hàng."}
          </p>
        </div>
      ) : (
        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-800/80 bg-zinc-950/50">
            <div className="col-span-3">Đơn hàng</div>
            <div className="col-span-3">Khách hàng</div>
            <div className="col-span-2">Ngày đặt</div>
            <div className="col-span-1 text-right">Tổng tiền</div>
            <div className="col-span-1 text-center">Trạng thái</div>
            <div className="col-span-2 text-center">Hành động</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-zinc-800/50">
            {orders.map((order) => {
              const badge = STATUS_BADGE[order.status] || STATUS_BADGE.PENDING;
              const isExpanded = expandedOrder === order.id;
              const nextStatuses = NEXT_STATUS_OPTIONS[order.status] || [];
              const orderDate = new Date(order.createdAt);
              const isUpdating = updatingOrderId === order.id;

              return (
                <div key={order.id}>
                  {/* Order Row */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-5 py-4 items-center hover:bg-zinc-900/80 transition-colors duration-150">
                    {/* Order ID */}
                    <div className="col-span-3 flex items-center gap-3">
                      <button
                        onClick={() => toggleExpand(order.id)}
                        className="p-1 hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        <svg
                          className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-xs font-mono font-semibold text-zinc-200">
                          #{order.id.slice(0, 8)}
                        </p>
                        <p className="text-[10px] text-zinc-600">
                          {order.orderItems.length} sản phẩm
                        </p>
                      </div>
                    </div>

                    {/* Customer */}
                    <div className="col-span-3">
                      <p className="text-xs font-medium text-zinc-200 truncate">
                        {order.user.name || "Khách hàng"}
                      </p>
                      <p className="text-[10px] text-zinc-500 truncate">
                        {order.user.email}
                      </p>
                    </div>

                    {/* Date */}
                    <div className="col-span-2 text-xs text-zinc-400">
                      {orderDate.toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                      <span className="block text-[10px] text-zinc-600">
                        {orderDate.toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* Total */}
                    <div className="col-span-1 text-right">
                      <span className="text-xs font-bold text-white">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="col-span-1 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex items-center justify-center gap-1.5">
                      {nextStatuses.length > 0 ? (
                        nextStatuses.map((ns) => {
                          const targetBadge = STATUS_BADGE[ns];
                          return (
                            <button
                              key={ns}
                              onClick={() => handleStatusUpdate(order.id, ns)}
                              disabled={isUpdating}
                              className={`px-2 py-1 text-[10px] font-semibold rounded-lg border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 ${
                                ns === "CANCELLED"
                                  ? "border-red-800/50 text-red-400 hover:bg-red-950/30"
                                  : "border-emerald-800/50 text-emerald-400 hover:bg-emerald-950/30"
                              }`}
                            >
                              {isUpdating ? "..." : targetBadge?.label || ns}
                            </button>
                          );
                        })
                      ) : (
                        <span className="text-[10px] text-zinc-600 italic">Hoàn thành</span>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-5 pb-4 border-t border-zinc-800/30 animate-in slide-in-from-top-1 fade-in duration-200">
                      <div className="pt-3 space-y-2">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
                          Chi tiết sản phẩm
                        </p>
                        {order.orderItems.map((item) => {
                          const display = getProductDisplay(item.product.image);
                          return (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 p-2.5 bg-zinc-950/50 rounded-lg"
                            >
                              <div
                                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${display.imageGrad} flex items-center justify-center text-base shadow-inner flex-shrink-0`}
                              >
                                <span>{display.icon}</span>
                              </div>
                              <div className="flex-grow min-w-0">
                                <p className="text-xs font-medium text-zinc-200 truncate">
                                  {item.product.name}
                                </p>
                                <p className="text-[10px] text-zinc-500">
                                  {item.quantity} × {formatPrice(item.price)}
                                </p>
                              </div>
                              <span className="text-xs font-semibold text-zinc-300">
                                {formatPrice(item.quantity * item.price)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
