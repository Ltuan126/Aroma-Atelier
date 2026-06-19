import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getProductDisplay, formatPrice } from "@/data/products";
import SortSelect from "@/components/products/SortSelect";
import SearchInput from "@/components/products/SearchInput";
import PriceRangeFilter from "@/components/products/PriceRangeFilter";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    price?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

const PRICE_FILTERS = [
  { label: "Tất cả mức giá", value: "all" },
  { label: "Dưới 500,000đ", value: "under_500" },
  { label: "Từ 500,000đ - 1,000,000đ", value: "500_1000" },
  { label: "Trên 1,000,000đ", value: "over_1000" },
];

export default async function ProductsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentCategory = resolvedSearchParams.category || "all";
  const currentSort = resolvedSearchParams.sort || "default";
  const currentPrice = resolvedSearchParams.price || "all";
  const currentSearch = resolvedSearchParams.search || "";
  const minPrice = resolvedSearchParams.minPrice || "";
  const maxPrice = resolvedSearchParams.maxPrice || "";

  // Fetch categories from DB
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  // Build prisma search conditions
  const where: Prisma.ProductWhereInput = {};

  if (currentCategory !== "all") {
    where.category = {
      slug: currentCategory,
    };
  }

  // Text search
  if (currentSearch) {
    where.OR = [
      { name: { contains: currentSearch, mode: "insensitive" } },
      { description: { contains: currentSearch, mode: "insensitive" } },
    ];
  }

  // Price filtering
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) {
      where.price.gte = parseFloat(minPrice);
    }
    if (maxPrice) {
      where.price.lte = parseFloat(maxPrice);
    }
  } else if (currentPrice === "under_500") {
    where.price = { lt: 500000 };
  } else if (currentPrice === "500_1000") {
    where.price = { gte: 500000, lte: 1000000 };
  } else if (currentPrice === "over_1000") {
    where.price = { gt: 1000000 };
  }

  // Sorting
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (currentSort === "price_asc") {
    orderBy = { price: "asc" };
  } else if (currentSort === "price_desc") {
    orderBy = { price: "desc" };
  } else if (currentSort === "name_asc") {
    orderBy = { name: "asc" };
  }

  // Fetch products
  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });

  // Helper to build URL search params for category/price/sort links
  const buildUrl = (params: { category?: string; sort?: string; price?: string }) => {
    const newParams = new URLSearchParams();
    
    const categoryVal = params.category !== undefined ? params.category : currentCategory;
    if (categoryVal && categoryVal !== "all") {
      newParams.set("category", categoryVal);
    }

    const sortVal = params.sort !== undefined ? params.sort : currentSort;
    if (sortVal && sortVal !== "default") {
      newParams.set("sort", sortVal);
    }

    if (currentSearch) {
      newParams.set("search", currentSearch);
    }

    // If static price is selected, we clear custom price ranges
    const priceVal = params.price !== undefined ? params.price : currentPrice;
    if (params.price !== undefined) {
      if (priceVal && priceVal !== "all") {
        newParams.set("price", priceVal);
      }
    } else {
      // If we clicked category or sort, we preserve whatever filters are active
      if (priceVal && priceVal !== "all") {
        newParams.set("price", priceVal);
      } else {
        if (minPrice) newParams.set("minPrice", minPrice);
        if (maxPrice) newParams.set("maxPrice", maxPrice);
      }
    }

    const queryStr = newParams.toString();
    return queryStr ? `/products?${queryStr}` : "/products";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Title */}
      <div className="space-y-2 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-6">
        <h1 className="text-3xl font-serif font-bold text-zinc-900 dark:text-white">Cửa Hàng Sản Phẩm</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Khám phá các bộ sưu tập hương thơm cao cấp của chúng tôi.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar */}
        <aside className="w-full lg:w-64 space-y-8 lg:shrink-0">
          {/* Category Filter */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Danh mục sản phẩm</h3>
            <div className="flex flex-col space-y-2">
              <Link
                href={buildUrl({ category: "all" })}
                className={`text-sm py-1.5 px-3 rounded-lg transition-all duration-200 ${
                  currentCategory === "all"
                    ? "font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                }`}
              >
                Tất cả sản phẩm
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={buildUrl({ category: cat.slug })}
                  className={`text-sm py-1.5 px-3 rounded-lg transition-all duration-200 ${
                    currentCategory === cat.slug
                      ? "font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="space-y-4 pt-6 border-t border-zinc-200/50 dark:border-zinc-800/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Mức giá</h3>
            <div className="flex flex-col space-y-2">
              {PRICE_FILTERS.map((filter) => (
                <Link
                  key={filter.value}
                  href={buildUrl({ price: filter.value })}
                  className={`text-sm py-1.5 px-3 rounded-lg transition-all duration-200 ${
                    currentPrice === filter.value && !minPrice && !maxPrice
                      ? "font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                  }`}
                >
                  {filter.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Custom Price Range Filter */}
          <PriceRangeFilter />
        </aside>

        {/* Product Grid and Sorting */}
        <div className="flex-grow space-y-6">
          {/* Search bar and Filters header */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            <SearchInput />
          </div>

          {/* Sorting and Count */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-zinc-900/20 border border-zinc-200/50 dark:border-zinc-800/50 px-4 py-3 rounded-xl text-sm">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">
              Hiển thị {products.length} sản phẩm
            </span>
            <SortSelect currentSort={currentSort} />
          </div>

          {/* Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => {
                const display = getProductDisplay(p.image);
                return (
                  <div
                    key={p.id}
                    className="bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 flex flex-col group"
                  >
                    {/* Image — click to detail */}
                    <Link href={`/products/${p.slug}`} className="block">
                      <div className={`h-56 bg-gradient-to-tr ${display.imageGrad} relative flex items-center justify-center p-6 transition-all duration-300`}>
                        <span className="text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-500">
                          {display.icon}
                        </span>
                        <span className="absolute top-4 left-4 bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/20 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                          {display.tag}
                        </span>
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                      <Link href={`/products/${p.slug}`} className="space-y-1 block">
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest">
                          {p.category.name}
                        </span>
                        <h3 className="font-serif font-bold text-base text-zinc-800 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200 line-clamp-1">
                          {p.name}
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1 min-h-[2rem]">
                          {p.description || "Chưa có mô tả chi tiết."}
                        </p>
                      </Link>
                      <div className="flex items-center justify-between pt-2">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                          {formatPrice(p.price)}
                        </span>
                        <Link
                          href={`/products/${p.slug}`}
                          className="h-8 px-3 rounded-lg text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-800 hover:bg-emerald-600 dark:hover:bg-emerald-600 shadow-sm transition-all duration-200 inline-flex items-center"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-zinc-900/10 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl">
              <span className="text-4xl">🍃</span>
              <h3 className="mt-4 text-base font-semibold text-zinc-700 dark:text-zinc-350">Không tìm thấy sản phẩm</h3>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-450">Thử thay đổi bộ lọc hoặc xem toàn bộ cửa hàng.</p>
              <Link
                href="/products"
                className="mt-6 inline-flex h-10 items-center justify-center px-6 rounded-full text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors duration-200"
              >
                Xóa tất cả bộ lọc
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
