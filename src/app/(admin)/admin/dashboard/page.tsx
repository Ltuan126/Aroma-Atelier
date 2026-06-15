import React from "react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/data/products";

export const dynamic = "force-dynamic";

function getOrderStatusDisplay(status: string) {
  const mapping: Record<string, { label: string; color: string }> = {
    PENDING: { label: "Chờ thanh toán", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    PROCESSING: { label: "Đang xử lý", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    SHIPPED: { label: "Đang giao", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
    DELIVERED: { label: "Đã giao", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    CANCELLED: { label: "Đã hủy", color: "text-red-400 bg-red-500/10 border-red-500/20" },
  };
  return mapping[status] || { label: status, color: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20" };
}

export default async function AdminDashboardPage() {
  // 1. Tính doanh thu (Tổng tiền các đơn hàng khác CANCELLED)
  const orders = await prisma.order.findMany({
    where: {
      status: {
        not: "CANCELLED",
      },
    },
    select: {
      totalAmount: true,
    },
  });
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  // 2. Tính đơn hàng đang xử lý (PENDING hoặc PROCESSING)
  const pendingOrdersCount = await prisma.order.count({
    where: {
      status: {
        in: ["PENDING", "PROCESSING"],
      },
    },
  });

  // 3. Tính tổng số sản phẩm
  const totalProductsCount = await prisma.product.count();

  // 4. Tính số lượng khách hàng mới (User có role CUSTOMER)
  const totalCustomersCount = await prisma.user.count({
    where: {
      role: "CUSTOMER",
    },
  });

  // 5. Lấy danh sách 5 đơn hàng gần đây
  const dbRecentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  const recentOrders = dbRecentOrders.map((o) => {
    const statusInfo = getOrderStatusDisplay(o.status);
    return {
      id: `ORD-${o.id.slice(0, 6).toUpperCase()}`,
      customer: o.user.name || "Khách hàng",
      date: new Date(o.createdAt).toLocaleDateString("vi-VN"),
      total: formatPrice(o.totalAmount),
      status: statusInfo.label,
      statusColor: statusInfo.color,
    };
  });

  // 6. Tính sản phẩm bán chạy (nhóm theo productId trong OrderItem)
  const topSold = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 3,
  });

  let topProductsList = [];
  if (topSold.length > 0) {
    topProductsList = await Promise.all(
      topSold.map(async (item, index) => {
        const prod = await prisma.product.findUnique({
          where: { id: item.productId },
          include: { category: true },
        });
        return {
          name: prod?.name || "Sản phẩm ẩn",
          sales: `${item._sum.quantity || 0} lượt mua`,
          category: prod?.category.name || "Danh mục",
        };
      })
    );
  } else {
    // Dự phòng nếu chưa có lượt mua nào: Lấy 3 sản phẩm đầu tiên
    const defaultProds = await prisma.product.findMany({
      take: 3,
      include: { category: true },
    });
    topProductsList = defaultProds.map((p) => ({
      name: p.name,
      sales: "0 lượt mua",
      category: p.category.name,
    }));
  }

  const stats = [
    { title: "Tổng doanh thu thực", value: formatPrice(totalRevenue), change: "Tất cả đơn hàng hợp lệ", trend: "up" },
    { title: "Đơn hàng cần xử lý", value: `${pendingOrdersCount} đơn`, change: "Chờ thanh toán & chuẩn bị", trend: "up" },
    { title: "Danh mục sản phẩm", value: `${totalProductsCount} sản phẩm`, change: "Có trong cơ sở dữ liệu", trend: "neutral" },
    { title: "Khách hàng đăng ký", value: `${totalCustomersCount} khách`, change: "Tài khoản CUSTOMER", trend: "up" },
  ];

  return (
    <div className="space-y-8">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-serif">Tổng Quan Hệ Thống</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Cập nhật lúc:{" "}
            {new Date().toLocaleString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-9 px-4 text-xs font-semibold bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded-xl transition-all duration-200">
            Xuất báo cáo
          </button>
          <a
            href="/admin/products"
            className="inline-flex items-center justify-center h-9 px-4 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-lg shadow-emerald-900/20 active:scale-95 transition-all duration-200"
          >
            + Quản lý sản phẩm
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="p-6 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl space-y-4 hover:border-zinc-700 transition-all duration-200"
          >
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{stat.title}</p>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-white tracking-tight">{stat.value}</span>
            </div>
            <p className="text-[10px] font-semibold text-zinc-500">
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders - Col span 2 */}
        <div className="lg:col-span-2 bg-zinc-900/20 border border-zinc-800/80 rounded-2xl overflow-hidden flex flex-col justify-between">
          <div className="p-6 border-b border-zinc-800/80 flex justify-between items-center">
            <h3 className="font-serif font-bold text-base text-white">Đơn hàng gần đây</h3>
            <span className="text-xs text-zinc-500">Hiển thị 5 đơn hàng mới nhất</span>
          </div>

          <div className="overflow-x-auto">
            {recentOrders.length === 0 ? (
              <div className="p-10 text-center text-zinc-500 text-xs">
                Chưa có đơn hàng nào được tạo trong hệ thống.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-950/20">
                    <th className="py-3 px-6">Mã đơn</th>
                    <th className="py-3 px-6">Khách hàng</th>
                    <th className="py-3 px-6">Ngày đặt</th>
                    <th className="py-3 px-6 text-right">Tổng cộng</th>
                    <th className="py-3 px-6 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-xs">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="py-4 px-6 font-mono font-semibold text-emerald-400">{order.id}</td>
                      <td className="py-4 px-6 text-zinc-300 font-medium">{order.customer}</td>
                      <td className="py-4 px-6 text-zinc-400">{order.date}</td>
                      <td className="py-4 px-6 text-right font-medium text-zinc-200">{order.total}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${order.statusColor}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Top Products - Col span 1 */}
        <div className="bg-zinc-900/20 border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between">
          <div className="border-b border-zinc-800/80 pb-4 mb-4">
            <h3 className="font-serif font-bold text-base text-white">Sản phẩm bán chạy nhất</h3>
          </div>
          <div className="space-y-4 flex-grow">
            {topProductsList.map((p, idx) => (
              <div key={idx} className="flex items-center space-x-3 p-3 bg-zinc-900/40 border border-zinc-800/50 rounded-xl hover:border-zinc-700 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 text-xs">
                  {idx + 1}
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-xs font-semibold text-zinc-200 truncate">{p.name}</h4>
                  <p className="text-[10px] text-zinc-500">{p.category}</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
                  {p.sales}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
