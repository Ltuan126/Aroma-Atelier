import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: "User ID not found in session" }, { status: 400 });
    }

    const body = await req.json();
    const { items } = body; // items: [ { productId, quantity } ]

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid sync data format" }, { status: 400 });
    }

    // Lấy hoặc tạo giỏ hàng cho người dùng
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Đồng bộ từng sản phẩm từ giỏ hàng LocalStorage vào Database
    for (const localItem of items) {
      const { productId, quantity } = localItem;
      if (!productId || typeof quantity !== "number" || quantity <= 0) continue;

      // Kiểm tra sản phẩm tồn tại và lấy stock hiện tại
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) continue;

      const existingItem = await prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
      });

      if (existingItem) {
        // Gộp số lượng, giới hạn bởi stock của sản phẩm
        const mergedQuantity = Math.min(product.stock, existingItem.quantity + quantity);
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: mergedQuantity },
        });
      } else {
        // Thêm mới sản phẩm, giới hạn bởi stock
        const finalQuantity = Math.min(product.stock, quantity);
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity: finalQuantity,
          },
        });
      }
    }

    // Lấy giỏ hàng mới cập nhật
    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        cartItems: {
          include: {
            product: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return NextResponse.json({ success: true, cart: updatedCart });
  } catch (error: any) {
    console.error("Cart sync error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
