import React from "react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-zinc-50 to-teal-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 py-20 sm:py-28 border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="absolute top-1/4 left-1/10 w-72 h-72 bg-emerald-300/10 dark:bg-emerald-800/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-teal-300/10 dark:bg-teal-800/5 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/30">
            <span>🌿</span>
            <span>Về chúng tôi</span>
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
            Kiến Tạo Không Gian Sống <br />
            Qua <span className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">Khứu Giác</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light">
            Hành trình khơi dậy cảm xúc, đánh thức ký ức và nâng niu tâm hồn bằng những liệu pháp hương thơm nguyên bản từ thiên nhiên.
          </p>
        </div>
      </section>

      {/* Brand Values & Story */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-white">Câu chuyện thương hiệu</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Khởi nguồn từ mong muốn tái hiện những khoảnh khắc trong trẻo của sương sớm rừng sâu và làn gió mát đại ngàn, 
              **Aroma Atelier** ra đời như một xưởng chế tác hương thơm cao cấp, kết hợp các phương thức tinh chế thủ công truyền thống với triết lý thiết kế đương đại.
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Chúng tôi không chỉ bán những sản phẩm mùi hương; chúng tôi kiến tạo các không gian sống sống động qua từng giác quan. 
              Mỗi giọt tinh dầu hay hũ nến thơm mang trong mình nguồn năng lượng kỳ diệu, xoa dịu tâm trí sau ngày dài bận rộn.
            </p>
          </div>
          <div className="h-80 rounded-3xl bg-gradient-to-br from-emerald-100/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-zinc-900 flex items-center justify-center p-8 relative overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 shadow-inner">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/20 dark:border-zinc-850 rounded-full animate-pulse" />
            <span className="text-7xl relative z-10 filter drop-shadow-md">✨</span>
          </div>
        </div>

        {/* Brand Pillars */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white">Triết Lý Sản Phẩm</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Ba nền tảng làm nên giá trị cốt lõi của Aroma Atelier</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "100% Tự Nhiên & Lành Tính",
                desc: "Cam kết sử dụng nguyên liệu thực vật thuần khiết, nói không với hương liệu tổng hợp độc hại và cồn công nghiệp.",
                icon: "🍃",
              },
              {
                title: "Chế Tác Thủ Công Tỉ Mỉ",
                desc: "Từng hũ nến thơm được rót tay, từng chai nước hoa được phối trộn với tỷ lệ hoàn hảo nhằm giữ trọn đặc tính trị liệu tốt nhất.",
                icon: "🏺",
              },
              {
                title: "Bền Vững Với Môi Trường",
                desc: "Sử dụng sáp đậu nành thân thiện, chai lọ thủy tinh tái chế và hạn chế tối đa bao bì nhựa dùng một lần.",
                icon: "🌍",
              },
            ].map((pillar, idx) => (
              <div key={idx} className="p-6 bg-white dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-350">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-xl border border-emerald-100 dark:border-emerald-900">
                  {pillar.icon}
                </div>
                <h3 className="font-serif font-bold text-sm text-zinc-800 dark:text-zinc-200">{pillar.title}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics section */}
        <div className="p-8 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-900/50 dark:to-teal-900/50 rounded-3xl text-white grid grid-cols-3 gap-4 text-center shadow-lg shadow-emerald-500/10">
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-bold font-serif">100%</p>
            <p className="text-[10px] sm:text-xs text-emerald-100 font-semibold uppercase tracking-wider">Tự nhiên</p>
          </div>
          <div className="space-y-1 border-x border-white/20">
            <p className="text-2xl sm:text-3xl font-bold font-serif">5000+</p>
            <p className="text-[10px] sm:text-xs text-emerald-100 font-semibold uppercase tracking-wider">Khách hàng tin chọn</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-bold font-serif">3+</p>
            <p className="text-[10px] sm:text-xs text-emerald-100 font-semibold uppercase tracking-wider">Năm đồng hành</p>
          </div>
        </div>
      </section>
    </div>
  );
}
