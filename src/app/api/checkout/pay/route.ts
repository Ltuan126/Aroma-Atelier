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

    const userId = session.user.id;
    const body = await req.json();
    const { orderId, paymentMethod, success } = body;

    if (!orderId || !paymentMethod || typeof success !== "boolean") {
      return NextResponse.json(
        { error: "Dữ liệu yêu cầu không hợp lệ" },
        { status: 400 }
      );
    }

    // Lấy thông tin đơn hàng
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Không tìm thấy đơn hàng" }, { status: 404 });
    }

    // Đảm bảo đơn hàng thuộc về chính user hoặc admin
    if (order.userId !== userId && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Đảm bảo đơn hàng chưa được xử lý thanh toán trước đó
    if (order.paymentStatus === "PAID") {
      return NextResponse.json(
        { error: "Đơn hàng đã được thanh toán thành công từ trước" },
        { status: 400 }
      );
    }

    // Thực hiện cập nhật trong Transaction
    const updatedOrder = await prisma.$transaction(async (tx) => {
      if (success) {
        // Cập nhật trạng thái thanh toán thành công
        return await tx.order.update({
          where: { id: orderId },
          data: {
            paymentMethod,
            paymentStatus: "PAID",
            status: "PROCESSING", // Chuyển sang đang xử lý sau khi thanh toán
          },
        });
      } else {
        // Hủy đơn hàng và HOÀN LẠI TỒN KHO nếu thanh toán thất bại
        const cancelledOrder = await tx.order.update({
          where: { id: orderId },
          data: {
            paymentMethod,
            paymentStatus: "FAILED",
            status: "CANCELLED",
          },
        });

        // Hoàn lại tồn kho cho từng sản phẩm
        for (const item of order.orderItems) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });
        }

        return cancelledOrder;
      }
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Payment API error:", error);
    const message = error instanceof Error ? error.message : "Có lỗi xảy ra khi xử lý thanh toán";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
