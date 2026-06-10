import React from "react";
import Link from "next/link";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
      {/* Premium Header with Glassmorphism */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/store" className="flex items-center space-x-2 group">
            <span className="text-2xl transition-transform duration-300 group-hover:rotate-12">🌿</span>
            <span className="font-serif text-xl font-semibold tracking-wider bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
              Aroma Atelier
            </span>
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link
              href="/products"
              className="text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
            >
              Cửa hàng
            </Link>
            <Link
              href="#"
              className="text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
            >
              Bộ sưu tập
            </Link>
            <Link
              href="#"
              className="text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
            >
              Câu chuyện
            </Link>
            <Link
              href="#"
              className="text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
            >
              Liên hệ
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            {/* Search Button (Visual Only) */}
            <button className="p-2 text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-all duration-200" aria-label="Search">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart Button */}
            <Link
              href="#"
              className="p-2 relative text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-all duration-200"
              aria-label="Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Admin Portal Link */}
            <Link
              href="/admin/dashboard"
              className="hidden sm:inline-flex items-center space-x-1 text-xs font-semibold px-3 h-8 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 hover:text-emerald-600 dark:hover:border-emerald-500 dark:hover:text-emerald-400 rounded-full transition-all duration-200"
            >
              <span>Quản trị</span>
            </Link>

            {/* User Profile / Login */}
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-4 h-9 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-900/10 hover:shadow-emerald-950/20 active:scale-95 rounded-full transition-all duration-200"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Modern Footer */}
      <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200/50 dark:border-zinc-800/50 py-12 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4 md:col-span-1">
              <span className="font-serif text-lg font-semibold tracking-wider bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                Aroma Atelier
              </span>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Đánh thức các giác quan của bạn bằng những mùi hương tinh khiết, có nguồn gốc tự nhiên và được chế tác thủ công một cách hoàn hảo.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mb-4">Sản phẩm</h3>
              <ul className="space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
                <li><Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400">Nước hoa cao cấp</Link></li>
                <li><Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400">Tinh dầu tự nhiên</Link></li>
                <li><Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400">Nến thơm nghệ thuật</Link></li>
                <li><Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400">Quà tặng đặc biệt</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mb-4">Hỗ trợ khách hàng</h3>
              <ul className="space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
                <li><Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400">Chính sách vận chuyển</Link></li>
                <li><Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400">Chính sách đổi trả</Link></li>
                <li><Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400">Câu hỏi thường gặp</Link></li>
                <li><Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400">Hướng dẫn chọn mùi hương</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mb-4">Đăng ký bản tin</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">Nhận thông tin cập nhật về sản phẩm mới và các chương trình ưu đãi độc quyền.</p>
              <form className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Email của bạn..."
                  className="px-3 py-2 text-xs bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-emerald-500 focus:outline-none rounded-lg w-full"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors duration-200"
                >
                  Gửi
                </button>
              </form>
            </div>
          </div>
          <div className="border-t border-zinc-200/50 dark:border-zinc-800/50 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-[10px] text-zinc-400 dark:text-zinc-500">
            <p>&copy; {new Date().getFullYear()} Aroma Atelier. Bảo lưu mọi quyền.</p>
            <p>Thiết kế cho các hệ thống e-commerce cao cấp.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
