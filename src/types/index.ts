/**
 * Shared TypeScript type definitions for Aroma Atelier.
 * These types mirror the Prisma schema models and are used
 * across API routes, server actions, and client components.
 */

// ─── Enums ────────────────────────────────────────────────

export type Role = "ADMIN" | "CUSTOMER";

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

// ─── Domain Models ────────────────────────────────────────

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  image: string | null;
  categoryId: string;
  category?: Category;
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number; // price at time of purchase
};

export type Order = {
  id: string;
  userId: string;
  user?: User;
  status: OrderStatus;
  totalAmount: number;
  orderItems?: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
};

export type CartItem = {
  id: string;
  cartId: string;
  productId: string;
  product?: Product;
  quantity: number;
};

export type Cart = {
  id: string;
  userId: string;
  cartItems?: CartItem[];
  createdAt: Date;
  updatedAt: Date;
};

// ─── API Response Shapes ──────────────────────────────────

export type ApiResponse<T> = {
  data: T;
  error?: never;
} | {
  data?: never;
  error: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
