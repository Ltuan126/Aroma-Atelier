"use client";

import React, { useState, useEffect } from "react";
import { getProductDisplay, formatPrice } from "@/data/products";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  image: string | null;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: 0,
    stock: 0,
    categoryId: "",
    image: "p1",
    description: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Delete State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteProductInfo, setDeleteProductInfo] = useState<{ id: string; name: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch Data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories")
      ]);

      if (!prodRes.ok || !catRes.ok) {
        throw new Error("Không thể tải dữ liệu từ máy chủ");
      }

      const prodData = await prodRes.json();
      const catData = await catRes.json();

      setProducts(prodData.data);
      setCategories(catData.categories || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper to generate slug from name
  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Xóa dấu tiếng Việt
      .replace(/[đĐ]/g, "d")
      .replace(/([^a-z0-9\s-]|_)+/g, "") // Xóa ký tự đặc biệt
      .trim()
      .replace(/\s+/g, "-") // Thay khoảng trắng bằng gạch ngang
      .replace(/-+/g, "-"); // Xóa gạch ngang thừa
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      // Chỉ tự động cập nhật slug nếu đang tạo mới
      slug: modalMode === "create" ? generateSlug(name) : prev.slug,
    }));
  };

  // Open Create Modal
  const openCreateModal = () => {
    setModalMode("create");
    setFormData({
      name: "",
      slug: "",
      price: 0,
      stock: 10,
      categoryId: categories[0]?.id || "",
      image: "p1",
      description: "",
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (product: Product) => {
    setModalMode("edit");
    setCurrentProductId(product.id);
    setFormData({
      name: product.name,
      slug: product.slug,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      image: product.image || "p1",
      description: product.description || "",
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  // Submit Modal Form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug || !formData.categoryId) {
      setFormError("Vui lòng điền các trường bắt buộc.");
      return;
    }
    if (formData.price < 0 || formData.stock < 0) {
      setFormError("Giá bán và tồn kho không được nhỏ hơn 0.");
      return;
    }

    setFormLoading(true);
    setFormError(null);

    try {
      const url = modalMode === "create" ? "/api/products" : `/api/products/${currentProductId}`;
      const method = modalMode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gặp lỗi khi lưu sản phẩm");
      }

      setIsModalOpen(false);
      fetchData(); // Refetch
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || "Lỗi kết nối");
    } finally {
      setFormLoading(false);
    }
  };

  // Open Delete Confirm
  const openDeleteConfirm = (id: string, name: string) => {
    setDeleteProductInfo({ id, name });
    setIsDeleteOpen(true);
  };

  // Delete Action
  const handleDeleteProduct = async () => {
    if (!deleteProductInfo) return;
    setDeleteLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/products/${deleteProductInfo.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gặp lỗi khi xóa sản phẩm");
      }

      setIsDeleteOpen(false);
      setDeleteProductInfo(null);
      fetchData(); // Refetch
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Không thể xóa sản phẩm");
      setIsDeleteOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || p.category.slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header & Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-serif">Quản Lý Sản Phẩm</h1>
          <p className="text-xs text-zinc-400 mt-1">Tổng cộng: {products.length} sản phẩm thực tế trong hệ thống</p>
        </div>
        <button
          onClick={openCreateModal}
          className="h-10 px-4 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-lg shadow-emerald-900/20 active:scale-95 transition-all duration-200"
        >
          + Thêm sản phẩm mới
        </button>
      </div>

      {/* General Error Banner */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Filter controls */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-zinc-900/20 border border-zinc-800/80 rounded-2xl">
        <div className="flex-grow relative">
          <input
            type="text"
            placeholder="Tìm sản phẩm theo tên hoặc mô tả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-4 text-xs bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none rounded-xl text-zinc-300"
          />
          <span className="absolute left-3.5 top-3 text-zinc-500 text-sm">🔍</span>
        </div>
        <div className="w-full sm:w-56">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full h-10 px-3 text-xs bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none rounded-xl text-zinc-300"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-zinc-900/20 border border-zinc-800/80 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs text-zinc-500">Đang tải danh sách sản phẩm...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-xs text-zinc-500">
            Không tìm thấy sản phẩm nào phù hợp với điều kiện lọc.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-950/20">
                  <th className="py-3.5 px-6">Sản phẩm</th>
                  <th className="py-3.5 px-6">Danh mục</th>
                  <th className="py-3.5 px-6 text-right">Đơn giá</th>
                  <th className="py-3.5 px-6 text-center">Tồn kho</th>
                  <th className="py-3.5 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-xs">
                {filteredProducts.map((p) => {
                  const display = getProductDisplay(p.image);
                  return (
                    <tr key={p.id} className="hover:bg-zinc-900/30 transition-colors">
                      {/* Product Name & Visual image card */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${display.imageGrad} flex items-center justify-center text-lg shadow-inner shrink-0`}>
                            <span>{display.icon}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-zinc-200 line-clamp-1">{p.name}</p>
                            <p className="font-mono text-[9px] text-zinc-500 mt-0.5">{p.slug}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6 text-zinc-400 font-medium">{p.category?.name || "N/A"}</td>

                      {/* Price */}
                      <td className="py-4 px-6 text-right font-semibold text-zinc-200">{formatPrice(p.price)}</td>

                      {/* Stock Status */}
                      <td className="py-4 px-6 text-center">
                        {p.stock === 0 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border border-red-500/20 bg-red-500/10 text-red-400">
                            Hết hàng
                          </span>
                        ) : p.stock < 10 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border border-amber-500/20 bg-amber-500/10 text-amber-400">
                            Sắp hết ({p.stock})
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                            Còn ({p.stock})
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="px-2.5 py-1.5 border border-zinc-800 hover:border-emerald-500 text-zinc-400 hover:text-emerald-400 rounded-lg transition-all duration-200"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => openDeleteConfirm(p.id, p.name)}
                            className="px-2.5 py-1.5 border border-zinc-800 hover:border-red-500 text-zinc-450 hover:text-red-400 rounded-lg transition-all duration-200"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="font-serif text-base font-bold text-white">
                {modalMode === "create" ? "Thêm Sản Phẩm Mới" : "Chỉnh Sửa Sản Phẩm"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 text-sm focus:outline-none"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit}>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {formError && (
                  <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg animate-pulse">
                    ⚠️ {formError}
                  </p>
                )}

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập tên sản phẩm (Ví dụ: Sương Vy - Eau de Parfum)..."
                    value={formData.name}
                    onChange={handleNameChange}
                    className="w-full h-10 px-3 text-xs bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none rounded-xl text-zinc-300"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Slug sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="suong-vy-eau-de-parfum"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: generateSlug(e.target.value) }))}
                    className="w-full h-10 px-3 text-xs bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none rounded-xl text-zinc-300 font-mono"
                  />
                </div>

                {/* Row: Price & Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Giá bán (đ) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData((prev) => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                      className="w-full h-10 px-3 text-xs bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none rounded-xl text-zinc-300"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Tồn kho <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData((prev) => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                      className="w-full h-10 px-3 text-xs bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none rounded-xl text-zinc-300"
                    />
                  </div>
                </div>

                {/* Row: Category & Image Key */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))}
                      className="w-full h-10 px-3 text-xs bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none rounded-xl text-zinc-300"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Ảnh khóa (Template) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.image || "p1"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                      className="w-full h-10 px-3 text-xs bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none rounded-xl text-zinc-300"
                    >
                      <option value="p1">🧪 p1 (Best Seller)</option>
                      <option value="p2">💧 p2 (Mới nhất Cam)</option>
                      <option value="p3">🕯️ p3 (Giới hạn Tím)</option>
                      <option value="p4">🧪 p4 (Độc quyền Hồng)</option>
                      <option value="p5">💧 p5 (Mới nhất Vàng)</option>
                      <option value="p6">🕯️ p6 (Cơ bản Xanh)</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Mô tả sản phẩm
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Mô tả công dụng, hương liệu, nốt hương chính..."
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full p-3 text-xs bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none rounded-xl text-zinc-300"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-zinc-800 flex justify-end gap-3 bg-zinc-950/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-9 px-4 text-xs font-semibold bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded-xl transition-all duration-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="h-9 px-4 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {formLoading ? "Đang lưu..." : "Lưu sản phẩm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Alert */}
      {isDeleteOpen && deleteProductInfo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto text-lg">
                ⚠️
              </div>
              <h3 className="font-serif text-base font-bold text-white">Xác nhận xóa sản phẩm</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Bạn có chắc chắn muốn xóa sản phẩm <strong>"{deleteProductInfo.name}"</strong>? Thao tác này không thể hoàn tác.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-zinc-800 flex justify-end gap-3 bg-zinc-950/20">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="h-9 px-4 text-xs font-semibold bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded-xl transition-all duration-200"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteProduct}
                disabled={deleteLoading}
                className="h-9 px-4 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-xl disabled:opacity-50 transition-all duration-200"
              >
                {deleteLoading ? "Đang xóa..." : "Xác nhận xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
