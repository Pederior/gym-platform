import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Product, ProductStatus, ProductType } from "../../../types/index";
import { productService } from "../../../services/productService";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { HiStatusOnline, HiStatusOffline } from "react-icons/hi";
import { toast } from "react-hot-toast";
import useDocumentTitle from '../../../hooks/useDocumentTitle'

export default function AdminProducts() {
  useDocumentTitle('مدیریت کالا')
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<ProductType | "">("");
  const [filterStatus, setFilterStatus] = useState<ProductStatus | "">("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const productTypes: { value: ProductType; label: string; color: string }[] = [
    { value: "supplement", label: "مکمل", color: "bg-blue-500/10 text-blue-500" },
    { value: "clothing", label: "پوشاک", color: "bg-green-500/10 text-green-500" },
    {
      value: "accessory",
      label: "لوازم جانبی",
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      value: "digital",
      label: "دیجیتال",
      color: "bg-orange-500/10 text-orange-500",
    },
  ];

  const statusOptions: {
    value: ProductStatus;
    label: string;
    color: string;
  }[] = [
    { value: "active", label: "فعال", color: "bg-green-500/10 text-green-500" },
    { value: "inactive", label: "غیرفعال", color: "bg-destructive/10 text-destructive" },
    { value: "draft", label: "پیش‌نویس", color: "bg-muted/50 text-muted-foreground" },
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">مدیریت محصولات</h1>
        <Link
          to="/dashboard/admin/products/new"
          className="bg-primary text-primary-foreground px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-primary/80 transition flex items-center gap-2"
        >
          <FaPlus />
          افزودن محصول جدید
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg shadow-sm p-4 sm:p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="جستجو بر اساس نام یا دسته‌بندی..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as ProductType | "")
              }
              className="pl-4 pr-10 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
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
              className="pl-4 pr-10 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
            >
              <option value="">همه وضعیت‌ها</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-4 sm:px-6 py-2 rounded-lg hover:bg-primary/80 transition flex items-center gap-2 cursor-pointer"
            >
              <FaSearch />
              اعمال فیلترها
            </button>
            {(searchTerm || filterType || filterStatus) && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground transition"
              >
                پاک کردن فیلترها
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Products Table */}
      <div className="bg-card rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  تصویر
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  نام محصول
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  نوع
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  دسته‌بندی
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  قیمت
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  وضعیت
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 sm:px-6 py-8 text-center">
                    <div className="animate-pulse space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 bg-muted rounded" />
                      ))}
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 sm:px-6 py-12 text-center text-muted-foreground"
                  >
                    محصولی یافت نشد
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-muted transition">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-muted-foreground text-xs sm:text-sm">
                            بدون تصویر
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-foreground">
                        {product.name}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1 overflow-hidden text-ellipsis max-w-xs">
                        {product.description}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                          productTypes.find((t) => t.value === product.type)
                            ?.color || "bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        {productTypes.find((t) => t.value === product.type)
                          ?.label || product.type}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {product.category}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {product.price.toLocaleString()} تومان
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(product)}
                        className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                          product.status === "active"
                            ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                            : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                        } transition`}
                      >
                        {product.status === "active" ? (
                          <>
                            <HiStatusOnline />
                            <span className="hidden sm:inline">فعال</span>
                          </>
                        ) : (
                          <>
                            <HiStatusOffline />
                            <span className="hidden sm:inline">غیرفعال</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Link
                          to={`/dashboard/admin/products/${product._id}/edit`}
                          className="text-primary hover:text-primary/80 transition"
                          title="ویرایش"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id!)}
                          disabled={deletingId === product._id}
                          className={`text-destructive hover:text-destructive/80 transition cursor-pointer ${
                            deletingId === product._id
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          title="حذف"
                        >
                          {deletingId === product._id ? (
                            <span className="animate-spin text-xs">⏳</span>
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
          <div className="bg-muted px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-sm text-muted-foreground">
              نمایش {(page - 1) * 10 + 1} تا{" "}
              {Math.min(page * 10, products.length)} از {products.length} محصول
            </div>
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 sm:px-4 py-2 border border-border rounded-lg hover:bg-muted transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                قبلی
              </button>
              <span className="px-3 sm:px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                صفحه {page}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages}
                className="px-3 sm:px-4 py-2 border border-border rounded-lg hover:bg-muted transition disabled:opacity-50 disabled:cursor-not-allowed"
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