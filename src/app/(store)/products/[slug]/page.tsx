import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getProductDisplay, formatPrice } from "@/data/products";
import AddToCartButton from "@/components/products/AddToCartButton";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });

  if (!product) {
    return { title: "Sản phẩm không tồn tại" };
  }

  return {
    title: product.name,
    description: product.description ?? undefined,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Fetch related products (same category, exclude current)
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      NOT: { id: product.id },
    },
    take: 3,
    include: {
      category: { select: { name: true, slug: true } },
    },
  });

  const display = getProductDisplay(product.image);

  // Features based on category
  const features: Record<string, string[]> = {
    "nuoc-hoa-cao-cap": [
      "Lưu hương 8–12 giờ",
      "Nước hoa Eau de Parfum nồng độ cao",
      "Chiết xuất từ nguyên liệu nhập khẩu Pháp",
      "Chai thủy tinh cao cấp với nắp mạ vàng",
    ],
    "tinh-dau-tu-nhien": [
      "100% tinh dầu nguyên chất, không pha loãng",
      "Chiết xuất lạnh (Cold-pressed) giữ dưỡng chất",
      "Không màu nhân tạo, không chất bảo quản",
      "Kiểm định độ tinh khiết bởi phòng lab độc lập",
    ],
    "nen-thom-nghe-thuat": [
      "Sáp đậu nành tự nhiên cháy sạch không khói",
      "Hương kéo dài 40–50 giờ cháy liên tục",
      "Bấc cotton tự nhiên không chì",
      "Hũ thủy tinh tái sử dụng sau khi cạn",
    ],
  };

  const productFeatures = features[product.category.slug] ?? [
    "Nguyên liệu tự nhiên cao cấp",
    "Được chế tác thủ công",
    "Kiểm định chất lượng nghiêm ngặt",
    "Bao bì thân thiện môi trường",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-zinc-400 dark:text-zinc-500">
        <Link href="/store" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
          Trang chủ
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
          Cửa hàng
        </Link>
        <span>/</span>
        <Link
          href={`/products?category=${product.category.slug}`}
          className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-zinc-600 dark:text-zinc-300 font-medium line-clamp-1">{product.name}</span>
      </nav>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Product Visual */}
        <div className="space-y-4">
          {/* Main Image */}
          <div
            className={`relative w-full aspect-square rounded-3xl bg-gradient-to-tr ${display.imageGrad} flex items-center justify-center overflow-hidden shadow-xl`}
          >
            {/* Decorative rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2/3 h-2/3 rounded-full border border-white/10 dark:border-white/5" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1/2 h-1/2 rounded-full border border-white/15 dark:border-white/8" />
            </div>

            {/* Badge */}
            <span className="absolute top-5 left-5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-zinc-200/30 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
              {display.tag}
            </span>

            {/* Stock badge */}
            {product.stock <= 10 && product.stock > 0 && (
              <span className="absolute top-5 right-5 bg-amber-500/90 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                Còn {product.stock} sản phẩm
              </span>
            )}
            {product.stock === 0 && (
              <span className="absolute top-5 right-5 bg-red-500/90 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                Hết hàng
              </span>
            )}

            {/* Central Icon */}
            <span className="text-8xl sm:text-9xl filter drop-shadow-2xl select-none z-10">
              {display.icon}
            </span>
          </div>

          {/* Thumbnail strip (visual decorative) */}
          <div className="flex gap-3">
            {[0.85, 0.65, 0.45].map((opacity, i) => (
              <div
                key={i}
                className={`flex-1 aspect-square rounded-xl bg-gradient-to-tr ${display.imageGrad} flex items-center justify-center cursor-pointer border-2 transition-all duration-200 ${
                  i === 0
                    ? "border-emerald-500 shadow-md"
                    : "border-transparent opacity-60 hover:opacity-80"
                }`}
                style={{ opacity: i === 0 ? 1 : opacity }}
              >
                <span className="text-2xl">{display.icon}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8 lg:pt-4">
          {/* Category tag */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30">
              {product.category.name}
            </span>
            {product.stock > 0 ? (
              <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                Còn hàng
              </span>
            ) : (
              <span className="text-[10px] text-red-500 font-medium">Hết hàng</span>
            )}
          </div>

          {/* Name */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-900 dark:text-white leading-tight">
              {product.name}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {product.description ?? "Sản phẩm hương thơm cao cấp được chế tác thủ công từ nguyên liệu tự nhiên hảo hạng."}
            </p>
          </div>

          {/* Price */}
          <div className="flex items-end gap-4">
            <span className="text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Quantity + Add to Cart */}
          <div className="space-y-4">
            <AddToCartButton product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              description: product.description,
              price: product.price,
              stock: product.stock,
              image: product.image,
              categoryId: product.categoryId,
              createdAt: product.createdAt.toISOString(),
              updatedAt: product.updatedAt.toISOString(),
            }} />
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-200/50 dark:border-zinc-800/50" />

          {/* Features */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Đặc điểm nổi bật
            </h3>
            <ul className="space-y-2">
              {productFeatures.map((feat, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {feat}
                </li>
              ))}
            </ul>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: "🚚", label: "Miễn phí vận chuyển", sub: "Đơn từ 500K" },
              { icon: "↩️", label: "Đổi trả 7 ngày", sub: "Nếu không ưng" },
              { icon: "🔒", label: "Thanh toán an toàn", sub: "Mã hóa SSL" },
            ].map((g) => (
              <div
                key={g.label}
                className="flex flex-col items-center text-center p-3 bg-zinc-50 dark:bg-zinc-900/30 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 space-y-1"
              >
                <span className="text-xl">{g.icon}</span>
                <span className="text-[10px] font-semibold text-zinc-700 dark:text-zinc-300">{g.label}</span>
                <span className="text-[9px] text-zinc-400">{g.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white">
                Sản phẩm liên quan
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Cùng dòng {product.category.name.toLowerCase()} bạn có thể thích
              </p>
            </div>
            <Link
              href={`/products?category=${product.category.slug}`}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Xem tất cả →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rp) => {
              const rpDisplay = getProductDisplay(rp.image);
              return (
                <Link
                  key={rp.id}
                  href={`/products/${rp.slug}`}
                  className="bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 flex flex-col group"
                >
                  <div className={`h-44 bg-gradient-to-tr ${rpDisplay.imageGrad} relative flex items-center justify-center`}>
                    <span className="text-5xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-500">
                      {rpDisplay.icon}
                    </span>
                    <span className="absolute top-3 left-3 bg-white/90 dark:bg-zinc-900/90 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                      {rpDisplay.tag}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest">
                      {rp.category.name}
                    </span>
                    <h3 className="font-serif font-bold text-sm text-zinc-800 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {rp.name}
                    </h3>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {formatPrice(rp.price)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
