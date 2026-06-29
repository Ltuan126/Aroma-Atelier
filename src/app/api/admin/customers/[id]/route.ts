import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = session.user.role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { isBlocked } = body;

    if (typeof isBlocked !== "boolean") {
      return NextResponse.json(
        { error: "Dữ liệu isBlocked không hợp lệ" },
        { status: 400 }
      );
    }

    // Check if user exists and is a customer (cannot block another admin)
    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "Không tìm thấy khách hàng này" },
        { status: 404 }
      );
    }

    if (targetUser.role === "ADMIN") {
      return NextResponse.json(
        { error: "Không thể khóa tài khoản quản trị viên" },
        { status: 400 }
      );
    }

    // Update user block status
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isBlocked },
      select: {
        id: true,
        name: true,
        email: true,
        isBlocked: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: isBlocked ? "Đã khóa tài khoản khách hàng" : "Đã mở khóa tài khoản khách hàng",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating customer block status:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi cập nhật trạng thái tài khoản" },
      { status: 500 }
    );
  }
}
