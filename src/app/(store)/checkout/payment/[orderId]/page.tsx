import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import PaymentClient from "./PaymentClient";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default async function PaymentPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/checkout/payment/${(await params).orderId}`)}`);
  }

  const { orderId } = await params;
  
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: {
        include: {
          product: {
            select: {
              name: true,
              price: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  // Đảm bảo chỉ chủ nhân đơn hàng mới xem được trang này
  if (order.userId !== session.user.id) {
    redirect("/store");
  }

  // Nếu đơn hàng đã thanh toán thành công hoặc đã bị hủy, chuyển về danh sách đơn hàng
  if (order.paymentStatus === "PAID" || order.status === "CANCELLED") {
    redirect("/orders");
  }

  return <PaymentClient order={order} />;
}
