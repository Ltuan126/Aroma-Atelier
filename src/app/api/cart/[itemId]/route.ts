import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Context = {
  params: Promise<{
    itemId: string;
  }>;
};

export async function PATCH(req: NextRequest, { params }: Context) {
  try {
    const { itemId } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { quantity } = body;

    if (typeof quantity !== "number" || quantity <= 0) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }

    // Đảm bảo CartItem thuộc sở hữu của người dùng hiện tại
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
        product: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json({ error: "Sản phẩm trong giỏ hàng không tồn tại" }, { status: 404 });
    }

    if (cartItem.cart.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized access to cart item" }, { status: 403 });
    }

    // Kiểm tra hàng tồn kho
    if (cartItem.product.stock < quantity) {
      return NextResponse.json(
        { error: `Không đủ hàng. Hiện chỉ còn ${cartItem.product.stock} sản phẩm.` },
        { status: 400 }
      );
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

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

    return NextResponse.json({ cart: updatedCart });
  } catch (error: any) {
    console.error("CartItem PATCH error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Context) {
  try {
    const { itemId } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Đảm bảo CartItem thuộc sở hữu của người dùng hiện tại
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json({ error: "Sản phẩm trong giỏ hàng không tồn tại" }, { status: 404 });
    }

    if (cartItem.cart.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized access to cart item" }, { status: 403 });
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

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

    return NextResponse.json({ cart: updatedCart });
  } catch (error: any) {
    console.error("CartItem DELETE error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
