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

    // Lấy giỏ hàng cùng các item
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.cartItems.length === 0) {
      return NextResponse.json({ error: "Giỏ hàng rỗng" }, { status: 400 });
    }

    // Thực hiện đặt hàng trong một Transaction để đảm bảo tính nhất quán dữ liệu
    const order = await prisma.$transaction(async (tx) => {
      // 1. Tính tổng tiền sản phẩm
      const totalAmount = cart.cartItems.reduce(
        (sum, item) => sum + item.quantity * item.product.price,
        0
      );

      // Cộng thêm phí vận chuyển (đơn >= 500k freeship, < 500k phí ship 30k)
      const shippingFee = totalAmount >= 500000 ? 0 : 30000;
      const finalTotal = totalAmount + shippingFee;

      // 2. Tạo đơn hàng mới
      const newOrder = await tx.order.create({
        data: {
          userId,
          status: "PENDING",
          totalAmount: finalTotal,
        },
      });

      // 3. Tạo các OrderItem và giảm trừ hàng tồn kho
      for (const item of cart.cartItems) {
        // Kiểm tra tồn kho ngay trước khi trừ
        const currentProduct = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!currentProduct) {
          throw new Error(`Sản phẩm với ID ${item.productId} không tồn tại.`);
        }

        if (currentProduct.stock < item.quantity) {
          throw new Error(
            `Sản phẩm "${currentProduct.name}" không đủ số lượng tồn kho (Hiện còn: ${currentProduct.stock}, yêu cầu: ${item.quantity}).`
          );
        }

        // Tạo OrderItem
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          },
        });

        // Cập nhật tồn kho sản phẩm
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // 4. Xóa sạch giỏ hàng của người dùng
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Có lỗi xảy ra trong quá trình đặt hàng" },
      { status: 400 }
    );
  }
}
