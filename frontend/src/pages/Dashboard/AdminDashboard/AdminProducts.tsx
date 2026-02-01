import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Product, ProductStatus, ProductType } from "../../../types/index";
import { productService } from "../../../services/productService";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { HiStatusOnline, HiStatusOffline } from "react-icons/hi";
import { toast } from "react-hot-toast";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<ProductType | "">("");
  const [filterStatus, setFilterStatus] = useState<ProductStatus | "">("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const productTypes: { value: ProductType; label: string; color: string }[] = [
    { value: "supplement", label: "مکمل", color: "bg-blue-100 text-blue-800" },
    { value: "clothing", label: "پوشاک", color: "bg-green-100 text-green-800" },
    {
      value: "accessory",
      label: "لوازم جانبی",
      color: "bg-purple-100 text-purple-800",
    },
    {
      value: "digital",
      label: "دیجیتال",
      color: "bg-orange-100 text-orange-800",
    },
  ];

  const statusOptions: {
    value: ProductStatus;
    label: string;
    color: string;
  }[] = [
    { value: "active", label: "فعال", color: "bg-green-100 text-green-800" },
    { value: "inactive", label: "غیرفعال", color: "bg-red-100 text-red-800" },
    { value: "draft", label: "پیش‌نویس", color: "bg-gray-100 text-gray-800" },
  ];

  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm, filterType, filterStatus]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll({
        page,
        limit: 10,
        search: searchTerm,
        type: filterType || undefined,
        status: filterStatus || undefined,
      });
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      toast.error("خطا در دریافت محصولات");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("آیا مطمئن هستید؟ این عمل غیرقابل بازگشت است.")) {
      return;
    }

    setDeletingId(id);
    try {
      await productService.delete(id);
      toast.success("محصول با موفقیت حذف شد");
      fetchProducts();
    } catch (err) {
      toast.error("خطا در حذف محصول");
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (product: Product) => {
    const newStatus: ProductStatus =
      product.status === "active" ? "inactive" : "active";

    try {
      await productService.toggleStatus(product._id!, newStatus);
      toast.success(
        `وضعیت به ${newStatus === "active" ? "فعال" : "غیرفعال"} تغییر کرد`,
      );
      fetchProducts();
    } catch (err) {
      toast.error("خطا در تغییر وضعیت");
      console.error(err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterType("");
    setFilterStatus("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">مدیریت محصولات</h1>
        <Link
          to="/dashboard/admin/products/new"
          className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition flex items-center gap-2"
        >
          <FaPlus />
          افزودن محصول جدید
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="جستجو بر اساس نام یا دسته‌بندی..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as ProductType | "")
              }
              className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">همه نوع‌ها</option>
              {productTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as ProductStatus | "")
              }
              className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">همه وضعیت‌ها</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2"
            >
              <FaSearch />
              اعمال فیلترها
            </button>
            {(searchTerm || filterType || filterStatus) && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-gray-600 hover:text-gray-800 transition"
              >
                پاک کردن فیلترها
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تصویر
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نام محصول
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نوع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  دسته‌بندی
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  قیمت
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  وضعیت
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="animate-pulse space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-200 rounded" />
                      ))}
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    محصولی یافت نشد
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-sm">
                            بدون تصویر
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-1 overflow-hidden text-ellipsis max-w-xs">
                        {product.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          productTypes.find((t) => t.value === product.type)
                            ?.color || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {productTypes.find((t) => t.value === product.type)
                          ?.label || product.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.price.toLocaleString()} تومان
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(product)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                          product.status === "active"
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        } transition`}
                      >
                        {product.status === "active" ? (
                          <>
                            <HiStatusOnline />
                            فعال
                          </>
                        ) : (
                          <>
                            <HiStatusOffline />
                            غیرفعال
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/dashboard/admin/products/${product._id}/edit`}
                          className="text-blue-600 hover:text-blue-900 transition"
                          title="ویرایش"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id!)}
                          disabled={deletingId === product._id}
                          className={`text-red-600 hover:text-red-900 transition ${
                            deletingId === product._id
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          title="حذف"
                        >
                          {deletingId === product._id ? (
                            <span className="animate-spin">⏳</span>
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {products.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              نمایش {(page - 1) * 10 + 1} تا{" "}
              {Math.min(page * 10, products.length)} از {products.length} محصول
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                قبلی
              </button>
              <span className="px-4 py-2 bg-red-500 text-white rounded-lg">
                صفحه {page}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                بعدی
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
