import React from "react";
import { MOCK_PRODUCTS } from "@/data/products";

const CATEGORIES = ["Tất cả sản phẩm", "Nước hoa cao cấp", "Tinh dầu tự nhiên", "Nến thơm nghệ thuật"];
const PRICE_RANGES = ["Dưới 500,000đ", "Từ 500,000đ - 1,000,000đ", "Trên 1,000,000đ"];

export default function ProductsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Title */}
      <div className="space-y-2 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-6">
        <h1 className="text-3xl font-serif font-bold text-zinc-900 dark:text-white">Cửa Hàng Sản Phẩm</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Khám phá các bộ sưu tập hương thơm cao cấp của chúng tôi.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar */}
        <aside className="w-full lg:w-64 space-y-6 lg:shrink-0">
          {/* Category Filter */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Danh mục sản phẩm</h3>
            <div className="space-y-2">
              {CATEGORIES.map((cat, idx) => {
                const id = `category-${idx}`;
                return (
                  <label
                    key={id}
                    htmlFor={id}
                    className="flex items-center space-x-3 text-sm text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                  >
                    <input
                      id={id}
                      type="radio"
                      name="category"
                      defaultChecked={idx === 0}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                    />
                    <span>{cat}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Mức giá</h3>
            <div className="space-y-2">
              {PRICE_RANGES.map((price, idx) => {
                const id = `price-${idx}`;
                return (
                  <label
                    key={id}
                    htmlFor={id}
                    className="flex items-center space-x-3 text-sm text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                  >
                    <input
                      id={id}
                      type="checkbox"
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                    />
                    <span>{price}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Product Grid and Sorting */}
        <div className="flex-grow space-y-6">
          {/* Sorting and Count */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-zinc-900/20 border border-zinc-200/50 dark:border-zinc-800/50 px-4 py-3 rounded-xl text-sm">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">Hiển thị {MOCK_PRODUCTS.length} sản phẩm</span>
            <div className="flex items-center space-x-2">
              <label htmlFor="sort-select" className="text-zinc-400 dark:text-zinc-500 text-xs">Sắp xếp theo:</label>
              <select
                id="sort-select"
                className="bg-transparent border-none font-semibold text-zinc-700 dark:text-zinc-300 focus:ring-0 text-xs cursor-pointer py-1"
              >
                <option>Mặc định</option>
                <option>Giá tăng dần</option>
                <option>Giá giảm dần</option>
                <option>Bán chạy nhất</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_PRODUCTS.map((p) => (
              <div
                key={p.id}
                className="bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 flex flex-col group"
              >
                {/* Image */}
                <div className={`h-56 bg-gradient-to-tr ${p.imageGrad} relative flex items-center justify-center p-6 transition-all duration-300`}>
                  <span className="text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-500">🧪</span>
                  <span className="absolute top-4 left-4 bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/20 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                    {p.tag}
                  </span>
                </div>

                {/* Info */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest">
                      {p.category}
                    </span>
                    <h3 className="font-serif font-bold text-base text-zinc-800 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200 line-clamp-1">
                      {p.name}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                      {p.price}
                    </span>
                    <button className="h-8 px-3 rounded-lg text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-800 hover:bg-emerald-600 dark:hover:bg-emerald-600 shadow-sm transition-all duration-200">
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

