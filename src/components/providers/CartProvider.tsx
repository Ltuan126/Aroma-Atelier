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
  addToCart: (productId: string, quantity: number, productDetails?: Product) => Promise<{ success: boolean; error?: string }>;
  updateQuantity: (itemId: string, quantity: number) => Promise<{ success: boolean; error?: string }>;
  removeFromCart: (itemId: string) => Promise<{ success: boolean; error?: string }>;
  refreshCart: () => Promise<void>;
  clearCartState: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const items = cart?.cartItems || [];
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

  const refreshCart = async () => {
    if (status !== "authenticated") {
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

  // Đồng bộ giỏ hàng và tải giỏ hàng tương ứng
  useEffect(() => {
    const handleSyncAndFetch = async () => {
      if (status === "authenticated") {
        setLoading(true);
        try {
          const localItemsRaw = localStorage.getItem("aroma_guest_cart");
          if (localItemsRaw) {
            const localItems = JSON.parse(localItemsRaw);
            if (localItems.length > 0) {
              // Gửi yêu cầu đồng bộ lên máy chủ
              const syncRes = await fetch("/api/cart/sync", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  items: localItems.map((item: any) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                  })),
                }),
              });
              if (syncRes.ok) {
                const syncData = await syncRes.json();
                setCart(syncData.cart);
                localStorage.removeItem("aroma_guest_cart");
                setLoading(false);
                return;
              }
            }
          }
        } catch (err) {
          console.error("Error syncing guest cart:", err);
        }

        // Tải giỏ hàng từ DB nếu không có gì đồng bộ hoặc gặp lỗi
        await refreshCart();
      } else if (status === "unauthenticated") {
        // Khách vãng lai: Tải giỏ hàng từ LocalStorage
        const localCart = localStorage.getItem("aroma_guest_cart");
        if (localCart) {
          setCart({
            id: "guest",
            userId: "guest",
            cartItems: JSON.parse(localCart),
          });
        } else {
          setCart({
            id: "guest",
            userId: "guest",
            cartItems: [],
          });
        }
        setLoading(false);
      }
    };

    if (status !== "loading") {
      handleSyncAndFetch();
    }
  }, [status]);

  const addToCart = async (productId: string, quantity: number, productDetails?: Product): Promise<{ success: boolean; error?: string }> => {
    if (status === "authenticated") {
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
    } else {
      // Khách vãng lai: lưu LocalStorage
      if (!productDetails) {
        return { success: false, error: "Thiếu thông tin sản phẩm" };
      }

      if (productDetails.stock < quantity) {
        return { success: false, error: `Không đủ hàng. Hiện chỉ còn ${productDetails.stock} sản phẩm.` };
      }

      const localItemsRaw = localStorage.getItem("aroma_guest_cart");
      let localItems: CartItem[] = localItemsRaw ? JSON.parse(localItemsRaw) : [];

      const existingIndex = localItems.findIndex((item) => item.productId === productId);
      if (existingIndex !== -1) {
        const newQty = localItems[existingIndex].quantity + quantity;
        if (productDetails.stock < newQty) {
          return {
            success: false,
            error: `Không đủ hàng. Bạn đã có ${localItems[existingIndex].quantity} sản phẩm trong giỏ và không thể thêm ${quantity} sản phẩm nữa (Tối đa ${productDetails.stock}).`,
          };
        }
        localItems[existingIndex].quantity = newQty;
      } else {
        localItems.push({
          id: `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          cartId: "guest",
          productId,
          quantity,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          product: productDetails,
        });
      }

      localStorage.setItem("aroma_guest_cart", JSON.stringify(localItems));
      setCart({
        id: "guest",
        userId: "guest",
        cartItems: localItems,
      });
      return { success: true };
    }
  };

  const updateQuantity = async (itemId: string, quantity: number): Promise<{ success: boolean; error?: string }> => {
    if (status === "authenticated") {
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
    } else {
      // Khách vãng lai: cập nhật LocalStorage
      const localItemsRaw = localStorage.getItem("aroma_guest_cart");
      if (!localItemsRaw) return { success: false, error: "Giỏ hàng trống" };

      let localItems: CartItem[] = JSON.parse(localItemsRaw);
      const existingIndex = localItems.findIndex((item) => item.id === itemId);
      if (existingIndex === -1) return { success: false, error: "Sản phẩm không có trong giỏ hàng" };

      if (localItems[existingIndex].product.stock < quantity) {
        return { success: false, error: `Không đủ hàng. Hiện chỉ còn ${localItems[existingIndex].product.stock} sản phẩm.` };
      }

      localItems[existingIndex].quantity = quantity;
      localStorage.setItem("aroma_guest_cart", JSON.stringify(localItems));
      setCart({
        id: "guest",
        userId: "guest",
        cartItems: localItems,
      });
      return { success: true };
    }
  };

  const removeFromCart = async (itemId: string): Promise<{ success: boolean; error?: string }> => {
    if (status === "authenticated") {
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
    } else {
      // Khách vãng lai: cập nhật LocalStorage
      const localItemsRaw = localStorage.getItem("aroma_guest_cart");
      if (!localItemsRaw) return { success: false, error: "Giỏ hàng trống" };

      let localItems: CartItem[] = JSON.parse(localItemsRaw);
      localItems = localItems.filter((item) => item.id !== itemId);

      localStorage.setItem("aroma_guest_cart", JSON.stringify(localItems));
      setCart({
        id: "guest",
        userId: "guest",
        cartItems: localItems,
      });
      return { success: true };
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
