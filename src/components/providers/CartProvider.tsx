"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  image: string | null;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: Product;
}

interface Cart {
  id: string;
  userId: string;
  cartItems: CartItem[];
}

interface CartContextType {
  cart: Cart | null;
  items: CartItem[];
  cartCount: number;
  cartTotal: number;
  loading: boolean;
  error: string | null;
  addToCart: (productId: string, quantity: number) => Promise<{ success: boolean; error?: string }>;
  updateQuantity: (itemId: string, quantity: number) => Promise<{ success: boolean; error?: string }>;
  removeFromCart: (itemId: string) => Promise<{ success: boolean; error?: string }>;
  refreshCart: () => Promise<void>;
  clearCartState: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const items = cart?.cartItems || [];
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

  const refreshCart = async () => {
    if (status !== "authenticated") {
      setCart(null);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setCart(data.cart);
      } else {
        console.error("Failed to fetch cart");
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearCartState = () => {
    setCart(null);
  };

  useEffect(() => {
    if (status === "authenticated") {
      refreshCart();
    } else {
      setCart(null);
    }
  }, [status]);

  const addToCart = async (productId: string, quantity: number): Promise<{ success: boolean; error?: string }> => {
    if (status !== "authenticated") {
      return { success: false, error: "Vui lòng đăng nhập để thực hiện" };
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Có lỗi xảy ra khi thêm vào giỏ hàng");
        return { success: false, error: data.error || "Có lỗi xảy ra khi thêm vào giỏ hàng" };
      }

      setCart(data.cart);
      return { success: true };
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError("Không thể kết nối đến máy chủ");
      return { success: false, error: "Không thể kết nối đến máy chủ" };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Có lỗi xảy ra khi cập nhật số lượng");
        return { success: false, error: data.error || "Có lỗi xảy ra khi cập nhật số lượng" };
      }

      setCart(data.cart);
      return { success: true };
    } catch (err) {
      console.error("Error updating cart quantity:", err);
      setError("Không thể kết nối đến máy chủ");
      return { success: false, error: "Không thể kết nối đến máy chủ" };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Có lỗi xảy ra khi xóa sản phẩm");
        return { success: false, error: data.error || "Có lỗi xảy ra khi xóa sản phẩm" };
      }

      setCart(data.cart);
      return { success: true };
    } catch (err) {
      console.error("Error removing from cart:", err);
      setError("Không thể kết nối đến máy chủ");
      return { success: false, error: "Không thể kết nối đến máy chủ" };
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        cartCount,
        cartTotal,
        loading,
        error,
        addToCart,
        updateQuantity,
        removeFromCart,
        refreshCart,
        clearCartState,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
