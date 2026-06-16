import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getProductDisplay, formatPrice } from "@/data/products";
import AddToCartInlineButton from "@/components/products/AddToCartInlineButton";

export const dynamic = "force-dynamic";

export default async function StoreHomePage() {
  const featuredProducts = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  // Chuyển đổi đối tượng Date của Prisma thành chuỗi ISO để truyền an toàn sang Client Component
  const serializedProducts = featuredProducts.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));


  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-zinc-50 to-teal-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 py-20 sm:py-32 border-b border-zinc-200/50 dark:border-zinc-800/50">
        {/* Absolute Decorative Blobs */}
        <div className="absolute top-1/4 left-1/10 w-72 h-72 bg-emerald-300/20 dark:bg-emerald-800/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-teal-300/20 dark:bg-teal-800/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/30">
            <span>✨</span>
            <span>Khám phá bộ sưu tập hè 2026</span>
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-zinc-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Tinh Hoa Hương Thơm Tự Nhiên & <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
              Chế Tác Thủ Công
            </span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Mỗi giọt tinh dầu hay chai nước hoa tại Aroma Atelier là một câu chuyện độc bản về thiên nhiên, 
            được thiết kế tinh tế để khơi gợi cảm xúc và nâng tầm phong cách sống của bạn.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 h-12 font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-full shadow-lg shadow-emerald-500/20 active:scale-98 transition-all duration-200"
            >
              Mua ngay
            </Link>
            <Link
              href="#"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 h-12 font-medium border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-all duration-200"
            >
              Tìm hiểu thêm
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold">Dòng Sản Phẩm Cốt Lõi</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Được phát triển bền vững từ nguồn nguyên liệu thượng hạng</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              title: "Nước hoa cao cấp",
              desc: "Phong cách tinh tế, lưu hương bền lâu",
              icon: "🧪",
              color: "hover:border-emerald-500/50 hover:shadow-emerald-500/5",
            },
            {
              title: "Tinh dầu tự nhiên",
              desc: "100% nguyên chất, trị liệu tinh thần",
              icon: "💧",
              color: "hover:border-amber-500/50 hover:shadow-amber-500/5",
            },
            {
              title: "Nến thơm nghệ thuật",
              desc: "Tạo không gian ấm áp và thư giãn",
              icon: "🕯️",
              color: "hover:border-indigo-500/50 hover:shadow-indigo-500/5",
            },
          ].map((cat, idx) => (
            <div
              key={idx}
              className={`p-6 bg-white dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl flex flex-col items-center text-center space-y-4 hover:shadow-xl transition-all duration-300 group ${cat.color} cursor-pointer`}
            >
              <div className="w-12 h-12 flex items-center justify-center text-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-850 rounded-xl group-hover:scale-110 transition-transform duration-300">
                {cat.icon}
              </div>
              <h3 className="font-serif font-bold text-lg text-zinc-800 dark:text-zinc-100">{cat.title}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold">Bộ Sưu Tập Nổi Bật</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Những tuyệt tác mùi hương được khách hàng yêu thích hàng đầu</p>
          </div>
          <Link
            href="/products"
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center space-x-1"
          >
            <span>Xem toàn bộ cửa hàng</span>
            <span>&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {serializedProducts.map((p) => {
            const display = getProductDisplay(p.image);
            return (
              <div
                key={p.id}
                className="bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 flex flex-col group"
              >
                {/* Product Image Link */}
                <Link href={`/products/${p.slug}`} className="block overflow-hidden">
                  <div className={`h-64 bg-gradient-to-tr ${display.imageGrad} relative flex items-center justify-center p-6 transition-all duration-300`}>
                    <span className="text-4xl filter drop-shadow-md group-hover:scale-115 transition-transform duration-500">
                      {display.icon}
                    </span>
                    <span className="absolute top-4 left-4 bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/20 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                      {display.tag}
                    </span>
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest">
                      {p.category.name}
                    </span>
                    <h3 className="font-serif font-bold text-base text-zinc-800 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200 line-clamp-1">
                      <Link href={`/products/${p.slug}`}>
                        {p.name}
                      </Link>
                    </h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                      {formatPrice(p.price)}
                    </span>
                    <AddToCartInlineButton product={p} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="bg-zinc-100/50 dark:bg-zinc-900/20 py-16 border-y border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Câu chuyện của chúng tôi</span>
            <h2 className="text-3xl font-serif font-bold text-zinc-900 dark:text-white">Kiến tạo không gian sống sống động qua khứu giác</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Khởi nguồn từ mong muốn tái hiện những khoảnh khắc nguyên sơ của rừng già và sương sớm, Aroma Atelier 
              kết hợp các phương thức thủ công truyền thống với triết lý thiết kế hiện đại. Chúng tôi tin rằng mỗi 
              mùi hương đều sở hữu năng lượng kết nối tâm hồn và đánh thức ký ức.
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Mọi quy trình từ tuyển lựa thảo mộc tới tinh chế dầu đều tuân thủ các cam kết nghiêm ngặt về phát 
              triển bền vững, an toàn cho sức khỏe người dùng và giảm thiểu phát thải môi trường.
            </p>
          </div>
          <div className="h-80 rounded-3xl bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-950 dark:to-zinc-900 flex items-center justify-center p-8 relative overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 shadow-inner">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/20 dark:border-zinc-800/50 rounded-full animate-pulse" />
            <span className="text-7xl relative z-10 filter drop-shadow-lg">🌿</span>
          </div>
        </div>
      </section>
    </div>
  );
}
