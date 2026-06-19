"use client";

import React, { useState, useEffect } from "react";
import { formatPrice } from "@/data/products";

type Customer = {
  id: string;
  name: string | null;
  email: string;
  isBlocked: boolean;
  createdAt: string;
  ordersCount: number;
  totalSpent: number;
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/customers");
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (customerId: string, currentStatus: boolean) => {
    setUpdatingId(customerId);
    try {
      const res = await fetch(`/api/admin/customers/${customerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: !currentStatus }),
      });
      if (res.ok) {
        setCustomers((prev) =>
          prev.map((c) =>
            c.id === customerId ? { ...c, isBlocked: !currentStatus } : c
          )
        );
      }
    } catch (error) {
      console.error("Error updating customer block status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtered customers list
  const filteredCustomers = customers.filter(
    (c) =>
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.name && c.name.toLowerCase().includes(search.toLowerCase()))
  );

  // Stats
  const totalCustomers = customers.length;
  const blockedCustomers = customers.filter((c) => c.isBlocked).length;
  const activeCustomers = totalCustomers - blockedCustomers;
  const totalSpentAll = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white">
            Quản lý khách hàng
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Xem danh sách tài khoản khách hàng và quản lý quyền truy cập
          </p>
        </div>
      </div>

      {/* Quick Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800/80 p-5 rounded-2xl space-y-2">
          <p className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider">Tổng số khách hàng</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{totalCustomers}</span>
            <span className="text-xs text-zinc-500">tài khoản</span>
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800/80 p-5 rounded-2xl space-y-2">
          <p className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider">Tài khoản hoạt động</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400">{activeCustomers}</span>
            <span className="text-xs text-zinc-500">bình thường</span>
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800/80 p-5 rounded-2xl space-y-2">
          <p className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider">Tài khoản đã khóa</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-red-400">{blockedCustomers}</span>
            <span className="text-xs text-zinc-500">hạn chế</span>
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800/80 p-5 rounded-2xl space-y-2">
          <p className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider">Tổng chi tiêu toàn hệ thống</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{formatPrice(totalSpentAll)}</span>
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-zinc-500 text-sm">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-9 pr-4 py-2.5 text-xs bg-zinc-900/50 border border-zinc-850/80 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 rounded-xl text-zinc-300 placeholder-zinc-500"
          />
        </div>
      </div>

      {/* Customers List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/10 border border-zinc-800/40 rounded-2xl">
          <div className="w-14 h-14 bg-zinc-900 text-zinc-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
            👥
          </div>
          <p className="text-sm text-zinc-400">Không tìm thấy khách hàng nào</p>
        </div>
      ) : (
        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-800/80 bg-zinc-950/50">
            <div className="col-span-1">ID</div>
            <div className="col-span-3">Khách hàng</div>
            <div className="col-span-2">Ngày đăng ký</div>
            <div className="col-span-2 text-center">Đơn hàng</div>
            <div className="col-span-2 text-right">Tổng chi tiêu</div>
            <div className="col-span-2 text-center">Trạng thái / Hành động</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-zinc-800/50">
            {filteredCustomers.map((customer) => {
              const registerDate = new Date(customer.createdAt);
              const isUpdating = updatingId === customer.id;

              return (
                <div
                  key={customer.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-5 py-4 items-center hover:bg-zinc-900/80 transition-colors duration-150"
                >
                  {/* ID */}
                  <div className="col-span-1">
                    <span className="text-[10px] font-mono text-zinc-500">
                      #{customer.id.slice(0, 8)}
                    </span>
                  </div>

                  {/* Profile info */}
                  <div className="col-span-3">
                    <p className="text-xs font-semibold text-zinc-200">
                      {customer.name || "Chưa cập nhật tên"}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-mono">
                      {customer.email}
                    </p>
                  </div>

                  {/* Registered Date */}
                  <div className="col-span-2 text-xs text-zinc-400">
                    {registerDate.toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </div>

                  {/* Orders count */}
                  <div className="col-span-2 text-center text-xs text-zinc-300">
                    <span className="font-semibold">{customer.ordersCount}</span> đơn
                  </div>

                  {/* Spending */}
                  <div className="col-span-2 text-right text-xs font-bold text-white">
                    {formatPrice(customer.totalSpent)}
                  </div>

                  {/* Block Actions */}
                  <div className="col-span-2 flex items-center justify-center gap-3">
                    {customer.isBlocked ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                        Đã khóa
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Hoạt động
                      </span>
                    )}

                    <button
                      onClick={() => handleToggleBlock(customer.id, customer.isBlocked)}
                      disabled={isUpdating}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 ${
                        customer.isBlocked
                          ? "border-emerald-800/50 text-emerald-400 hover:bg-emerald-950/30"
                          : "border-red-805/50 text-red-400 hover:bg-red-950/30"
                      }`}
                    >
                      {isUpdating ? "..." : customer.isBlocked ? "Mở khóa" : "Khóa"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
