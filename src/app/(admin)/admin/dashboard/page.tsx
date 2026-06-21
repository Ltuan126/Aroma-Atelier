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
  // 1. Fetch all orders (except CANCELLED) to aggregate details in JS
  const allOrders = await prisma.order.findMany({
    where: {
      status: {
        not: "CANCELLED",
      },
    },
    select: {
      totalAmount: true,
      paymentStatus: true,
      paymentMethod: true,
      createdAt: true,
    },
  });

  // Calculate stats
  const totalPaidRevenue = allOrders
    .filter((o) => o.paymentStatus === "PAID")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingRevenue = allOrders
    .filter((o) => o.paymentStatus !== "PAID")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // 2. Orders needing processing
  const pendingOrdersCount = await prisma.order.count({
    where: {
      status: {
        in: ["PENDING", "PROCESSING"],
      },
    },
  });

  // 3. Registered customers count
  const totalCustomersCount = await prisma.user.count({
    where: {
      role: "CUSTOMER",
    },
  });

  // 4. Payment Method Revenue Breakdown
  const stripeRevenue = allOrders
    .filter((o) => o.paymentMethod === "STRIPE")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const qrRevenue = allOrders
    .filter((o) => o.paymentMethod === "QR")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const codRevenue = allOrders
    .filter((o) => o.paymentMethod === "COD")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalRevenueAll = allOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  // 5. Calculate Last 7 Days Sales for Visual Bar Chart
  const salesByDay: Record<string, number> = {};
  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const formatted = d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
    const dayLabel = dayNames[d.getDay()];
    return {
      key: d.toDateString(),
      label: `${dayLabel} (${formatted})`,
      amount: 0,
    };
  });

  allOrders.forEach((o) => {
    const oDate = new Date(o.createdAt).toDateString();
    const dayObj = last7Days.find((d) => d.key === oDate);
    if (dayObj) {
      dayObj.amount += o.totalAmount;
    }
  });

  const maxDailySales = Math.max(...last7Days.map((d) => d.amount), 1);

  // 6. Get Top 5 Recent Orders
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
      paymentMethod: o.paymentMethod === "STRIPE" ? "Stripe" : o.paymentMethod === "QR" ? "QR Code" : "COD",
      paymentStatus: o.paymentStatus === "PAID" ? "Đã thanh toán" : "Chờ thanh toán",
      paymentStatusColor: o.paymentStatus === "PAID" ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" : "text-amber-400 border-amber-500/20 bg-amber-500/10",
      status: statusInfo.label,
      statusColor: statusInfo.color,
    };
  });

  // 7. Top Selling Products
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
    { title: "Doanh thu (Đã thanh toán)", value: formatPrice(totalPaidRevenue), change: "Thanh toán thành công qua cổng Stripe/QR", trend: "up", color: "text-emerald-400" },
    { title: "Doanh thu chưa thu (COD/Treo)", value: formatPrice(pendingRevenue), change: "Khách chọn COD hoặc chưa hoàn tất QR", trend: "neutral", color: "text-amber-400" },
    { title: "Đơn hàng cần xử lý", value: `${pendingOrdersCount} đơn`, change: "Trạng thái Chờ xử lý / Đang chuẩn bị", trend: "up", color: "text-blue-400" },
    { title: "Khách hàng đăng ký", value: `${totalCustomersCount} khách`, change: "Tổng số tài khoản CUSTOMER", trend: "up", color: "text-zinc-200" },
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
              <span className={`text-xl font-bold tracking-tight ${stat.color}`}>{stat.value}</span>
            </div>
            <p className="text-[10px] font-semibold text-zinc-500">
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Last 7 Days Sales Chart (Col span 2) */}
        <div className="lg:col-span-2 bg-zinc-900/20 border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="flex justify-between items-center border-b border-zinc-800/80 pb-4">
            <div>
              <h3 className="font-serif font-bold text-base text-white">Doanh số 7 ngày qua</h3>
              <p className="text-[10px] text-zinc-500">Tổng giá trị đơn hàng được tạo theo từng ngày</p>
            </div>
          </div>

          {/* Visual CSS-based Bar Chart */}
          <div className="flex items-end justify-between h-48 pt-4 px-2">
            {last7Days.map((day, idx) => {
              const percentage = (day.amount / maxDailySales) * 100;
              return (
                <div key={idx} className="flex flex-col items-center space-y-2 group w-full">
                  <div className="relative w-full flex justify-center">
                    {/* Tooltip on Hover */}
                    <span className="absolute bottom-full mb-2 hidden group-hover:block bg-zinc-950 text-white text-[9px] font-bold px-2 py-1 rounded-md border border-zinc-800 whitespace-nowrap shadow-xl">
                      {formatPrice(day.amount)}
                    </span>
                    {/* The Bar */}
                    <div
                      style={{ height: `${Math.max(percentage, 4)}%` }}
                      className={`w-8 rounded-t-lg transition-all duration-500 cursor-pointer ${
                        day.amount > 0
                          ? "bg-gradient-to-t from-emerald-600 to-teal-500 group-hover:from-emerald-500 group-hover:to-teal-400 shadow-md shadow-emerald-950/20"
                          : "bg-zinc-800/50"
                      }`}
                    />
                  </div>
                  <span className="text-[9px] font-semibold text-zinc-500 group-hover:text-zinc-300 transition-colors">
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Payment Method Breakdown */}
        <div className="bg-zinc-900/20 border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="border-b border-zinc-800/80 pb-4">
            <h3 className="font-serif font-bold text-base text-white">Cơ cấu thanh toán</h3>
            <p className="text-[10px] text-zinc-500">Tỷ lệ doanh thu theo các phương thức</p>
          </div>

          <div className="space-y-5 flex-grow justify-center flex flex-col">
            {[
              {
                name: "Thẻ Tín Dụng (Stripe)",
                amount: stripeRevenue,
                color: "bg-indigo-500",
                textColor: "text-indigo-400",
                percentage: totalRevenueAll > 0 ? (stripeRevenue / totalRevenueAll) * 100 : 0,
              },
              {
                name: "Ví Điện Tử (QR Code)",
                amount: qrRevenue,
                color: "bg-emerald-500",
                textColor: "text-emerald-400",
                percentage: totalRevenueAll > 0 ? (qrRevenue / totalRevenueAll) * 100 : 0,
              },
              {
                name: "Thanh Toán Khi Nhận (COD)",
                amount: codRevenue,
                color: "bg-amber-500",
                textColor: "text-amber-400",
                percentage: totalRevenueAll > 0 ? (codRevenue / totalRevenueAll) * 100 : 0,
              },
            ].map((method, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-300">{method.name}</span>
                  <span className={`font-semibold ${method.textColor}`}>{formatPrice(method.amount)}</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${method.percentage}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${method.color}`}
                  />
                </div>
                <div className="flex justify-end text-[9px] text-zinc-500 font-semibold">
                  {method.percentage.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
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
                    <th className="py-3 px-6">Phương thức</th>
                    <th className="py-3 px-6">Thanh toán</th>
                    <th className="py-3 px-6 text-right">Tổng cộng</th>
                    <th className="py-3 px-6 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-xs">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="py-4 px-6 font-mono font-semibold text-emerald-400">{order.id}</td>
                      <td className="py-4 px-6 text-zinc-300 font-medium">{order.customer}</td>
                      <td className="py-4 px-6 text-zinc-400">{order.paymentMethod}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${order.paymentStatusColor}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
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
            <p className="text-[10px] text-zinc-500">Xếp hạng theo tổng số lượng bán ra</p>
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
