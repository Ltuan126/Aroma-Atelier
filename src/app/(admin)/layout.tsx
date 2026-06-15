import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Kiểm tra đăng nhập
  if (!session || !session.user) {
    redirect("/login?callbackUrl=" + encodeURIComponent("/admin/dashboard"));
  }

  // Kiểm tra quyền ADMIN
  const role = (session.user as any).role;
  if (role !== "ADMIN") {
    redirect("/store");
  }

  const adminName = session.user.name || "Aroma Admin";
  const adminEmail = session.user.email || "admin@aroma.com";
  
  // Lấy chữ cái đầu của tên
  const adminInitials = adminName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-100 font-sans antialiased">
      {/* Sidebar - Permanent on desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-zinc-800/80 bg-zinc-900/50 backdrop-blur-md shrink-0">
        {/* Brand/Logo */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-800/80">
          <Link href="/admin/dashboard" className="flex items-center space-x-2 group">
            <span className="text-xl">🌿</span>
            <span className="font-serif font-bold text-sm tracking-wider bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              AROMA ADMIN
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-grow p-4 space-y-1">
          {[
            { name: "Tổng quan", href: "/admin/dashboard", icon: "📊" },
            { name: "Sản phẩm", href: "/admin/products", icon: "🧪" },
            { name: "Đơn hàng", href: "#", icon: "📦" },
            { name: "Khách hàng", href: "#", icon: "👥" },
            { name: "Cài đặt", href: "#", icon: "⚙️" },
          ].map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                item.href === "/admin/dashboard"
                  ? "bg-emerald-600/10 text-emerald-400 border border-emerald-500/25"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 border border-transparent"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Profile Card */}
        <div className="p-4 border-t border-zinc-800/80">
          <div className="flex items-center space-x-3 p-2 bg-zinc-900/80 border border-zinc-800/50 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-white shadow-md">
              {adminInitials}
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-xs font-semibold text-zinc-200 truncate">{adminName}</p>
              <p className="text-[10px] text-zinc-500 truncate">{adminEmail}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Side */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button (Visual Only) */}
            <button className="md:hidden p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-sm font-bold tracking-wider uppercase text-zinc-400">Hệ Thống Quản Trị</h2>
          </div>

          <div className="flex items-center space-x-4">
            {/* Storefront Link */}
            <Link
              href="/store"
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-emerald-500 text-xs font-semibold text-zinc-400 hover:text-emerald-400 transition-all duration-200"
            >
              <span>Xem cửa hàng</span>
              <span>&rarr;</span>
            </Link>

            {/* Notification Icon */}
            <button className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-lg relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-zinc-950" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-grow p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

