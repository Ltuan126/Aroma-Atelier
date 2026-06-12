/**
 * Mock product data for development.
 * Replace with API/database calls once backend is connected.
 */

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: string;
  priceNumeric: number;
  imageGrad: string;
  tag: string;
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Sương Mai - Eau de Parfum",
    slug: "suong-mai-eau-de-parfum",
    category: "Nước hoa cao cấp",
    price: "1,250,000đ",
    priceNumeric: 1250000,
    imageGrad: "from-teal-200 to-emerald-100 dark:from-teal-950 dark:to-emerald-900",
    tag: "Best Seller",
  },
  {
    id: "p2",
    name: "Hoàng Hôn - Pure Essential Oil",
    slug: "hoang-hon-pure-essential-oil",
    category: "Tinh dầu tự nhiên",
    price: "450,000đ",
    priceNumeric: 450000,
    imageGrad: "from-amber-200 to-orange-100 dark:from-amber-950 dark:to-orange-900",
    tag: "Mới nhất",
  },
  {
    id: "p3",
    name: "Đêm Đông - Scented Candle",
    slug: "dem-dong-scented-candle",
    category: "Nến thơm nghệ thuật",
    price: "380,000đ",
    priceNumeric: 380000,
    imageGrad: "from-indigo-200 to-violet-100 dark:from-indigo-950 dark:to-violet-900",
    tag: "Giới hạn",
  },
  {
    id: "p4",
    name: "Gió Ngàn - Eau de Parfum",
    slug: "gio-ngan-eau-de-parfum",
    category: "Nước hoa cao cấp",
    price: "1,180,000đ",
    priceNumeric: 1180000,
    imageGrad: "from-rose-200 to-amber-100 dark:from-rose-950 dark:to-rose-900",
    tag: "Độc quyền",
  },
  {
    id: "p5",
    name: "Nắng Sớm - Essential Oil",
    slug: "nang-som-essential-oil",
    category: "Tinh dầu tự nhiên",
    price: "420,000đ",
    priceNumeric: 420000,
    imageGrad: "from-yellow-200 to-amber-100 dark:from-yellow-950 dark:to-amber-900",
    tag: "Mới nhất",
  },
  {
    id: "p6",
    name: "Hương Thảo - Scented Candle",
    slug: "huong-thao-scented-candle",
    category: "Nến thơm nghệ thuật",
    price: "350,000đ",
    priceNumeric: 350000,
    imageGrad: "from-emerald-200 to-teal-100 dark:from-emerald-950 dark:to-teal-900",
    tag: "Cơ bản",
  },
];

/** Trả về N sản phẩm nổi bật đầu tiên */
export function getFeaturedProducts(count = 4): Product[] {
  return MOCK_PRODUCTS.slice(0, count);
}
