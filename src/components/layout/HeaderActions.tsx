"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/components/providers/CartProvider";

export default function HeaderActions() {
  const { data: session, status } = useSession();
  const { cartCount, clearCartState } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <div className="flex items-center space-x-4">
      {/* Search Button (Visual Only) */}
      <button 
        className="p-2 text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-all duration-200" 
        aria-label="Tìm kiếm"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* Cart Button */}
      <Link
        href="/cart"
        className="p-2 relative text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-all duration-200"
        aria-label="Giỏ hàng"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-bounce">
            {cartCount}
          </span>
        )}
      </Link>

      {/* Admin Portal Link */}
      {isAdmin && (
        <Link
          href="/admin/dashboard"
          className="hidden sm:inline-flex items-center space-x-1 text-xs font-semibold px-3 h-8 border border-emerald-200 dark:border-emerald-800/80 hover:border-emerald-500 hover:text-emerald-600 dark:hover:border-emerald-500 dark:hover:text-emerald-400 text-emerald-600 dark:text-emerald-400 rounded-full transition-all duration-200"
        >
          <span>Quản trị</span>
        </Link>
      )}

      {/* User Session Handler */}
      {status === "loading" ? (
        <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
      ) : status === "authenticated" ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold hover:from-emerald-500 hover:to-teal-500 hover:shadow-md hover:shadow-emerald-950/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950"
            aria-expanded={isOpen}
            aria-label="Tài khoản"
          >
            {session.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                <p className="text-xs text-zinc-400 dark:text-zinc-500">Đăng nhập với</p>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                  {session.user?.name || "Khách hàng"}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{session.user?.email}</p>
              </div>
              <div className="py-1">
                <Link
                  href="#"
                  onClick={() => setIsOpen(false)}
                  className="flex px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Thông tin tài khoản
                </Link>
                <Link
                  href="#"
                  onClick={() => setIsOpen(false)}
                  className="flex px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Đơn hàng đã mua
                </Link>
              </div>
              <div className="border-t border-zinc-100 dark:border-zinc-800 my-1"></div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    clearCartState();
                    signOut({ callbackUrl: "/store" });
                  }}
                  className="w-full text-left flex px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Link
          href="/login"
          className="inline-flex items-center justify-center px-4 h-9 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-900/10 hover:shadow-emerald-950/20 active:scale-95 rounded-full transition-all duration-200"
        >
          Đăng nhập
        </Link>
      )}
    </div>
  );
}
