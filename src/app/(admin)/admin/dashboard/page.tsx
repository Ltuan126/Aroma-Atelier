import React from "react";

export default function AdminDashboardPage() {
  const stats = [
    { title: "Doanh thu tháng này", value: "124,500,000đ", change: "+12.5% từ tháng trước", trend: "up" },
    { title: "Đơn hàng đang xử lý", value: "48 đơn hàng", change: "+8.3% từ tuần trước", trend: "up" },
    { title: "Tổng số sản phẩm", value: "120 sản phẩm", change: "Hoạt động: 114", trend: "neutral" },
    { title: "Khách hàng mới", value: "32 khách hàng", change: "+15.2% từ tuần trước", trend: "up" },
  ];

  const recentOrders = [
    { id: "ORD-9921", customer: "Nguyễn Văn A", date: "08/06/2026", total: "1,700,000đ", status: "Đã thanh toán", statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { id: "ORD-9920", customer: "Trần Thị B", date: "08/06/2026", total: "450,000đ", status: "Chờ xử lý", statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    { id: "ORD-9919", customer: "Lê Hoàng C", date: "07/06/2026", total: "1,180,000đ", status: "Đang giao", statusColor: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    { id: "ORD-9918", customer: "Phạm Minh D", date: "07/06/2026", total: "380,000đ", status: "Đã thanh toán", statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  ];

  return (
    <div className="space-y-8">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-serif">Tổng Quan Hệ Thống</h1>
          <p className="text-xs text-zinc-400 mt-1">Cập nhật lúc: {new Date().toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" })}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-9 px-4 text-xs font-semibold bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded-xl transition-all duration-200">
            Xuất báo cáo
          </button>
          <button className="h-9 px-4 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-lg shadow-emerald-900/20 active:scale-95 transition-all duration-200">
            + Thêm sản phẩm
          </button>
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
              <span className="text-2xl font-bold text-white tracking-tight">{stat.value}</span>
            </div>
            <p className={`text-[10px] font-semibold ${stat.trend === "up" ? "text-emerald-400" : "text-zinc-500"}`}>
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
            <button className="text-xs text-emerald-400 hover:underline font-semibold">Xem tất cả</button>
          </div>

          <div className="overflow-x-auto">
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
                    <td className="py-4 px-6 font-semibold text-zinc-200">{order.id}</td>
                    <td className="py-4 px-6 text-zinc-300">{order.customer}</td>
                    <td className="py-4 px-6 text-zinc-400">{order.date}</td>
                    <td className="py-4 px-6 text-right font-medium text-zinc-200">{order.total}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products - Col span 1 */}
        <div className="bg-zinc-900/20 border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between">
          <div className="border-b border-zinc-800/80 pb-4 mb-4">
            <h3 className="font-serif font-bold text-base text-white">Sản phẩm bán chạy</h3>
          </div>
          <div className="space-y-4 flex-grow">
            {[
              { name: "Sương Mai - Eau de Parfum", sales: "84 lượt mua", category: "Nước hoa" },
              { name: "Hoàng Hôn - Essential Oil", sales: "62 lượt mua", category: "Tinh dầu" },
              { name: "Đêm Đông - Scented Candle", sales: "48 lượt mua", category: "Nến thơm" },
            ].map((p, idx) => (
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
