import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    // Kiểm tra quyền ADMIN
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, description, price, stock, image, categoryId } = body;

    // Build đối tượng cập nhật dữ liệu động
    const updateData: Prisma.ProductUncheckedUpdateInput = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) {
      if (typeof price !== "number" || price < 0) {
        return NextResponse.json({ error: "Giá sản phẩm không hợp lệ" }, { status: 400 });
      }
      updateData.price = price;
    }
    if (stock !== undefined) {
      if (typeof stock !== "number" || stock < 0) {
        return NextResponse.json({ error: "Số lượng tồn kho không hợp lệ" }, { status: 400 });
      }
      updateData.stock = stock;
    }
    if (image !== undefined) updateData.image = image;
    if (categoryId !== undefined) updateData.categoryId = categoryId;

    // Kiểm tra tính hợp lệ của slug mới nếu cập nhật slug
    if (slug) {
      const existingProduct = await prisma.product.findUnique({
        where: { slug },
      });
      if (existingProduct && existingProduct.id !== id) {
        return NextResponse.json({ error: "Slug sản phẩm đã tồn tại" }, { status: 400 });
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    // Kiểm tra quyền ADMIN
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Thực hiện xóa sản phẩm
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Đã xóa sản phẩm thành công" });
  } catch (error) {
    console.error("Error deleting product:", error);
    // Nếu có ràng buộc khóa ngoại (ví dụ: đã có người đặt mua sản phẩm này)
    if (error && typeof error === "object" && "code" in error && error.code === "P2003") {
      return NextResponse.json(
        { error: "Không thể xóa sản phẩm này vì đã có trong các đơn hàng đã đặt của hệ thống." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
