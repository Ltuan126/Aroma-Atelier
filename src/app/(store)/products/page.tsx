import React from "react";

export default function ProductsPage() {
  const products = [
    {
      id: "p1",
      name: "Sương Mai - Eau de Parfum",
      category: "Nước hoa cao cấp",
      price: "1,250,000đ",
      imageGrad: "from-teal-200 to-emerald-100 dark:from-teal-950 dark:to-emerald-900",
      tag: "Best Seller",
    },
    {
      id: "p2",
      name: "Hoàng Hôn - Pure Essential Oil",
      category: "Tinh dầu tự nhiên",
      price: "450,000đ",
      imageGrad: "from-amber-200 to-orange-100 dark:from-amber-950 dark:to-orange-900",
      tag: "Mới nhất",
    },
    {
      id: "p3",
      name: "Đêm Đông - Scented Candle",
      category: "Nến thơm nghệ thuật",
      price: "380,000đ",
      imageGrad: "from-indigo-200 to-violet-100 dark:from-indigo-950 dark:to-violet-900",
      tag: "Giới hạn",
    },
    {
      id: "p4",
      name: "Gió Ngàn - Eau de Parfum",
      category: "Nước hoa cao cấp",
      price: "1,180,000đ",
      imageGrad: "from-rose-200 to-amber-100 dark:from-rose-950 dark:to-rose-900",
      tag: "Độc quyền",
    },
    {
      id: "p5",
      name: "Nắng Sớm - Essential Oil",
      category: "Tinh dầu tự nhiên",
      price: "420,000đ",
      imageGrad: "from-yellow-200 to-amber-100 dark:from-yellow-950 dark:to-amber-900",
      tag: "Mới nhất",
    },
    {
      id: "p6",
      name: "Hương Thảo - Scented Candle",
      category: "Nến thơm nghệ thuật",
      price: "350,000đ",
      imageGrad: "from-emerald-200 to-teal-100 dark:from-emerald-950 dark:to-teal-900",
      tag: "Cơ bản",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Title */}
      <div className="space-y-2 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-6">
        <h1 className="text-3xl font-serif font-bold text-zinc-900 dark:text-white">Cửa Hàng Sản Phẩm</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Khám phá các bộ sưu tập hương thơm cao cấp của chúng tôi.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar (Desktop) */}
        <aside className="w-full lg:w-64 space-y-6 lg:shrink-0">
          {/* Category Filter */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Danh mục sản phẩm</h3>
            <div className="space-y-2">
              {["Tất cả sản phẩm", "Nước hoa cao cấp", "Tinh dầu tự nhiên", "Nến thơm nghệ thuật"].map((cat, idx) => (
                <label key={idx} className="flex items-center space-x-3 text-sm text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    defaultChecked={idx === 0}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Mức giá</h3>
            <div className="space-y-2">
              {["Dưới 500,000đ", "Từ 500,000đ - 1,000,000đ", "Trên 1,000,000đ"].map((price, idx) => (
                <label key={idx} className="flex items-center space-x-3 text-sm text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  />
                  <span>{price}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid and Sorting */}
        <div className="flex-grow space-y-6">
          {/* Sorting and Count */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-zinc-900/20 border border-zinc-200/50 dark:border-zinc-800/50 px-4 py-3 rounded-xl text-sm">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">Hiển thị {products.length} sản phẩm</span>
            <div className="flex items-center space-x-2">
              <span className="text-zinc-400 dark:text-zinc-500 text-xs">Sắp xếp theo:</span>
              <select className="bg-transparent border-none font-semibold text-zinc-700 dark:text-zinc-300 focus:ring-0 text-xs cursor-pointer py-1">
                <option>Mặc định</option>
                <option>Giá tăng dần</option>
                <option>Giá giảm dần</option>
                <option>Bán chạy nhất</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 flex flex-col group"
              >
                {/* Image */}
                <div className={`h-56 bg-gradient-to-tr ${p.imageGrad} relative flex items-center justify-center p-6 transition-all duration-300`}>
                  <span className="text-4xl filter drop-shadow-md group-hover:scale-115 transition-transform duration-500">🧪</span>
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
