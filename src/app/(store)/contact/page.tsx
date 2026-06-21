"use client";

import React, { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg("Vui lòng điền đầy đủ các thông tin bắt buộc.");
      return;
    }
    setErrorMsg("");
    setIsSubmitting(true);

    // Mock API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      // Clear message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1200);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-zinc-50 to-teal-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 py-16 sm:py-24 border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="absolute top-1/4 left-1/10 w-72 h-72 bg-emerald-300/10 dark:bg-emerald-800/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-teal-300/10 dark:bg-teal-800/5 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/30">
            <span>📞</span>
            <span>Liên hệ</span>
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
            Kết Nối Với Chúng Tôi
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Bạn có câu hỏi về sản phẩm, dịch vụ hoặc mong muốn hợp tác kinh doanh? Hãy gửi tin nhắn cho chúng tôi.
          </p>
        </div>
      </section>

      {/* Contact Content Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          
          {/* Information Column (Col span 2) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white">Thông Tin Liên Hệ</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Đội ngũ chăm sóc khách hàng của Aroma Atelier sẽ phản hồi các câu hỏi của bạn sớm nhất có thể.
              </p>
            </div>

            {/* Information Cards */}
            <div className="space-y-4">
              {[
                { title: "Văn phòng xưởng chế tác", value: "Q. Bình Thạnh, TP. Hồ Chí Minh, Việt Nam", icon: "📍" },
                { title: "Hỗ trợ khách hàng", value: "tuanlenguyen612@gmail.com", icon: "✉️" },
                { title: "Hotline phản hồi nhanh", value: "+84 (0) 90 123 4567 (8:00 - 18:00)", icon: "📞" },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-5 bg-white dark:bg-zinc-900/35 border border-zinc-200/40 dark:border-zinc-800/50 rounded-2xl">
                  <div className="w-10 h-10 shrink-0 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 rounded-xl flex items-center justify-center text-lg">
                    {item.icon}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{item.title}</h4>
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive map placeholder */}
            <div className="relative h-48 rounded-2xl border border-zinc-200/40 dark:border-zinc-800/50 overflow-hidden bg-gradient-to-br from-emerald-100/10 via-zinc-100 to-teal-100/10 dark:from-emerald-950/10 dark:via-zinc-950/50 dark:to-teal-950/10 flex items-center justify-center">
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
              <div className="text-center space-y-2 relative z-10">
                <span className="text-3xl animate-bounce inline-block">📍</span>
                <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Xưởng Chế Tác Aroma Atelier</p>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500">Q. Bình Thạnh, TP. Hồ Chí Minh</p>
              </div>
            </div>
          </div>

          {/* Form Column (Col span 3) */}
          <div className="lg:col-span-3 bg-white dark:bg-zinc-900/35 border border-zinc-200/40 dark:border-zinc-800/50 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="font-serif font-bold text-xl text-zinc-900 dark:text-white">Gửi tin nhắn cho xưởng</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 text-xs font-medium text-red-700 bg-red-100 border border-red-200 rounded-xl">
                  ⚠️ {errorMsg}
                </div>
              )}

              {submitted && (
                <div className="p-4 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-xl">
                  ✨ Cảm ơn bạn! Tin nhắn của bạn đã được gửi thành công. Chúng tôi sẽ liên hệ lại sớm nhất.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Họ và tên *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                    required
                    className="w-full px-4 h-11 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-emerald-500 focus:outline-none text-sm rounded-xl transition-all duration-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Email liên hệ *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    required
                    className="w-full px-4 h-11 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-emerald-500 focus:outline-none text-sm rounded-xl transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Chủ đề</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Hợp tác, hỗ trợ đơn hàng..."
                  className="w-full px-4 h-11 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-emerald-500 focus:outline-none text-sm rounded-xl transition-all duration-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Nội dung tin nhắn *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Nhập nội dung cần hỗ trợ hoặc hợp tác với chúng tôi..."
                  required
                  rows={4}
                  className="w-full p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-emerald-500 focus:outline-none text-sm rounded-xl transition-all duration-200 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center h-12 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-lg shadow-emerald-500/10 transition-all duration-200 active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}
