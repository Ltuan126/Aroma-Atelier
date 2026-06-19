import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const customers = await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      include: {
        orders: {
          select: {
            status: true,
            totalAmount: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const mappedCustomers = customers.map((customer) => {
      const ordersCount = customer.orders.length;
      const totalSpent = customer.orders.reduce(
        (sum, order) => (order.status !== "CANCELLED" ? sum + order.totalAmount : sum),
        0
      );

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        isBlocked: customer.isBlocked,
        createdAt: customer.createdAt,
        ordersCount,
        totalSpent,
      };
    });

    return NextResponse.json(mappedCustomers);
  } catch (error) {
    console.error("Error fetching admin customers:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi tải danh sách khách hàng" },
      { status: 500 }
    );
  }
}
