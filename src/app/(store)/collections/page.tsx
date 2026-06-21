import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const getCategoryTheme = (slug: string) => {
    switch (slug) {
      case "nuoc-hoa-cao-cap":
        return {
          icon: "🧪",
          gradient: "from-emerald-500/20 via-teal-500/10 to-transparent dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-transparent",
          border: "hover:border-emerald-500/30",
          tagColor: "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
          btnColor: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/10",
        };
      case "tinh-dau-tu-nhien":
        return {
          icon: "💧",
          gradient: "from-amber-500/20 via-orange-500/10 to-transparent dark:from-amber-950/40 dark:via-orange-950/20 dark:to-transparent",
          border: "hover:border-amber-500/30",
          tagColor: "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800",
          btnColor: "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-500/10",
        };
      case "nen-thom-nghe-thuat":
        return {
          icon: "🕯️",
          gradient: "from-indigo-500/20 via-purple-500/10 to-transparent dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-transparent",
          border: "hover:border-indigo-500/30",
          tagColor: "bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-805",
          btnColor: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-500/10",
        };
      default:
        return {
          icon: "🌿",
          gradient: "from-zinc-500/20 via-slate-500/10 to-transparent dark:from-zinc-950/40 dark:via-slate-950/20 dark:to-transparent",
          border: "hover:border-zinc-500/30",
          tagColor: "bg-zinc-100 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800",
          btnColor: "bg-gradient-to-r from-zinc-600 to-slate-600 hover:from-zinc-500 hover:to-slate-500 shadow-zinc-500/10",
        };
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-zinc-50 to-teal-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 py-16 sm:py-24 border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="absolute top-1/4 left-1/10 w-72 h-72 bg-emerald-300/10 dark:bg-emerald-800/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-teal-300/10 dark:bg-teal-800/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/30">
            <span>✨</span>
            <span>Premium Natural Aromas</span>
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-zinc-900 dark:text-white max-w-2xl mx-auto leading-tight">
            Bộ Sưu Tập Mùi Hương
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Duyệt qua các dòng sản phẩm thảo mộc tự nhiên của Aroma Atelier, được tinh chế thủ công để chăm sóc sức khỏe và nâng tầm không gian sống của bạn.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => {
            const theme = getCategoryTheme(cat.slug);
            return (
              <div
                key={cat.id}
                className={`relative flex flex-col justify-between overflow-hidden bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 hover:shadow-xl hover:shadow-zinc-200/20 dark:hover:shadow-none transition-all duration-300 group border-b-4 ${theme.border}`}
              >
                {/* Decorative Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-b ${theme.gradient} opacity-50 pointer-events-none`} />

                <div className="relative z-10 space-y-6">
                  {/* Category Header Icon */}
                  <div className="w-14 h-14 flex items-center justify-center text-3xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/30 dark:border-zinc-850 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    {theme.icon}
                  </div>

                  {/* Category Title & Badge */}
                  <div className="space-y-2">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${theme.tagColor}`}>
                      {cat._count.products} sản phẩm
                    </span>
                    <h3 className="font-serif font-bold text-xl text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
                      {cat.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed min-h-[3.5rem]">
                    {cat.description || "Dòng sản phẩm hương thơm độc bản giúp khơi gợi cảm xúc và nâng tầm phong cách sống."}
                  </p>
                </div>

                {/* Explore Button */}
                <div className="relative z-10 pt-6">
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className={`inline-flex items-center justify-center w-full h-11 text-xs font-semibold text-white rounded-xl shadow-md transition-all duration-200 active:scale-98 ${theme.btnColor}`}
                  >
                    Khám phá ngay &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
