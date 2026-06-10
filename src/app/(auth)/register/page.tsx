"use client";

import React from "react";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-12 relative overflow-hidden transition-colors duration-300">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />

      {/* Main card */}
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 shadow-xl shadow-zinc-200/50 dark:shadow-zinc-950/50 relative z-10 transition-all duration-300">
        
        {/* Brand/Logo & Title */}
        <div className="text-center space-y-3 mb-6">
          <Link href="/store" className="inline-flex items-center space-x-2 text-3xl">
            <span>🌿</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white font-serif">
            Tạo tài khoản mới
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Đăng ký tài khoản để trải nghiệm dịch vụ mua sắm cao cấp.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Họ và Tên</label>
            <input
              type="text"
              placeholder="Nguyễn Văn A"
              required
              className="w-full px-4 h-11 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 focus:border-emerald-500 focus:outline-none text-sm rounded-xl transition-all duration-200"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Địa chỉ Email</label>
            <input
              type="email"
              placeholder="example@domain.com"
              required
              className="w-full px-4 h-11 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 focus:border-emerald-500 focus:outline-none text-sm rounded-xl transition-all duration-200"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Mật khẩu</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              className="w-full px-4 h-11 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 focus:border-emerald-500 focus:outline-none text-sm rounded-xl transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full h-11 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-md shadow-emerald-550/10 hover:shadow-emerald-950/20 active:scale-98 transition-all duration-200"
          >
            Đăng ký tài khoản
          </button>
        </form>

        {/* Footer links */}
        <div className="text-center mt-6 space-y-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Đã có tài khoản?{" "}
            <Link href="/login" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
              Đăng nhập
            </Link>
          </p>
          <div className="border-t border-zinc-200/50 dark:border-zinc-800/50 pt-4">
            <Link href="/store" className="text-xs text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 inline-flex items-center space-x-1">
              <span>&larr;</span>
              <span>Quay lại cửa hàng</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
