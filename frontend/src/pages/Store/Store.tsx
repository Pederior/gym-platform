import { Link } from "react-router-dom";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { HiHome } from "react-icons/hi";
import TopBar from "../../components/layout/TopBar";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaRegFolder } from "react-icons/fa6";
import api from "../../services/api";
import "swiper/css";
import type { Product } from "../../types";
import { RiShoppingCartLine } from "react-icons/ri";
import { toast } from "react-hot-toast";
import useDocumentTitle from "../../hooks/useDocumentTitle";

interface Category {
  id: string;
  name: string;
  count: number;
}

// ✅ اینترفیس جدید برای پاسخ API
interface ProductsResponse {
  products: Product[];
  totalPages: number;
  currentPage: number;
  totalProducts: number;
}

export default function Store() {
  useDocumentTitle("فروشگاه");

  const [activeCategory, setActiveCategory] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [sortBy, setSortBy] = useState("menu_order");
  const [perPage, setPerPage] = useState(8);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // ✅ اضافه شد
  const [cart, setCart] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const res = await api.get("/products/categories");
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        toast.error("خطا در بارگذاری دسته‌بندی‌ها");
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products based on active category
  useEffect(() => {
    if (categoriesLoading) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);

        let url = `/products?sort=${sortBy}&limit=${perPage}&page=${page}`;
        if (activeCategory) {
          url += `&category=${encodeURIComponent(activeCategory)}`;
        }

        const res = await api.get<ProductsResponse>(url);
        
        // ✅ استخراج اطلاعات صفحه‌بندی
        setProducts(res.data.products || []);
        setTotalPages(res.data.totalPages || 1);
        
      } catch (err) {
        console.error("Error fetching products:", err);
        toast.error("خطا در بارگذاری محصولات");
        setProducts([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, sortBy, perPage, activeCategory, categoriesLoading]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // const handleSortChange = (value: string) => {
  //   setSortBy(value);
  //   setPage(1);
  // };

  // const handlePerPageChange = (value: number) => {
  //   setPerPage(value);
  //   setPage(1);
  // };

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item._id === product._id);

    if (existingItem) {
      toast.error("این محصول قبلاً به سبد خرید اضافه شده است", {
        duration: 2000,
      });
      return;
    }

    const newCart = [...cart, product];
    setCart(newCart);

    toast.success(`${product.name} به سبد خرید اضافه شد`, {
      duration: 2000,
      icon: "🛒",
    });

    const cartCountElement = document.querySelector("[data-cart-count]");
    if (cartCountElement) {
      cartCountElement.classList.add("animate-bounce");
      setTimeout(() => {
        cartCountElement.classList.remove("animate-bounce");
      }, 500);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", search);
  };

  // ✅ توابع جدید برای مدیریت صفحه‌بندی
  const goToPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div
        className="w-full bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/images/bg-header.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="max-w-7xl mx-auto relative z-10 px-4">
          <TopBar iconColor="gray-300" textColor="white" />
          <Navbar />
        </div>
        <div className="max-w-7xl mx-auto flex justify-between my-5 pb-5 relative z-10 px-4">
          <div className="flex text-lg text-white gap-2">
            <Link to="/">
              <HiHome className="font-bold" />
            </Link>
            <MdKeyboardDoubleArrowLeft className="text-gray-300/70" />
            <span className="text-sm text-white">فروشگاه</span>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-muted-foreground">
            نمایش {products.length} نتیجه
          </div>
          <div className="w-full sm:w-1/4">
            <form onSubmit={handleSearch}>
              <div className="flex">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="جستجو در محصولات..."
                  className="bg-background flex-1 border border-border rounded-r-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-l-lg hover:bg-primary/80 cursor-pointer"
                >
                  جستجو
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Categories Swiper */}
        {categoriesLoading ? (
          <div className="pb-6 mb-8">
            <div className="animate-pulse h-12 w-32 bg-muted rounded"></div>
          </div>
        ) : (
          <Swiper
            slidesPerView="auto"
            spaceBetween={20}
            dir="rtl"
            className="pb-6 mb-8 cursor-grab"
          >
            {/* دسته‌بندی "همه محصولات" */}
            <SwiperSlide style={{ width: "230px" }}>
              <button
                onClick={() => {
                  setActiveCategory("");
                  setPage(1);
                }}
                className={`w-full flex items-center justify-start gap-4 px-4 py-4 rounded-lg transition cursor-grab hover:cursor-grabbing ${
                  activeCategory === ""
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                <div className="w-12 h-12 bg-card rounded-lg flex items-center justify-center shadow-sm">
                  <FaRegFolder
                    className={`text-2xl ${
                      activeCategory === "" ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                </div>
                <div className="text-right">
                  <div className="font-semibold">همه محصولات</div>
                  <div className="text-sm opacity-80">
                    {categories.reduce((sum, cat) => sum + cat.count, 0)} محصول
                  </div>
                </div>
              </button>
            </SwiperSlide>

            {categories.map((cat) => (
              <SwiperSlide key={cat.name} style={{ width: "230px" }}>
                <button
                  onClick={() => {
                    setActiveCategory(cat.name);
                    setPage(1);
                  }}
                  className={`w-full flex items-center justify-start gap-4 px-4 py-4 rounded-lg transition cursor-grab hover:cursor-grabbing ${
                    activeCategory === cat.name
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  <div className="w-12 h-12 bg-card rounded-lg flex items-center justify-center shadow-sm">
                    <FaRegFolder
                      className={`text-2xl ${
                        activeCategory === cat.name
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{cat.name}</div>
                    <div className="text-sm opacity-80">{cat.count} محصول</div>
                  </div>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(perPage)].map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-lg overflow-hidden animate-pulse border border-border"
              >
                <div className="h-48 bg-muted" />
                <div className="p-3">
                  <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
                  <div className="h-3 bg-muted rounded w-1/2 mx-auto mt-1" />
                </div>
                <div className="p-2">
                  <div className="h-4 bg-primary rounded w-3/4 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="group bg-card rounded-b-md overflow-hidden hover:shadow-md transition-shadow border border-border"
              >
                <div className="absolute bg-black/80 text-primary-foreground font-extralight px-3 py-1 z-10">
                  <span className="font-bold text-sm">
                    {product.price !== 0 ? (
                      <>{product.price.toLocaleString()} تومان</>
                    ) : (
                      "رایگان"
                    )}
                  </span>
                </div>

                <div className="h-64 bg-muted flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <span className="text-muted-foreground">بدون تصویر</span>
                  )}
                </div>

                <div className="bg-card text-foreground p-3 h-20 flex flex-col items-center justify-center gap-1">
                  <h3 className="font-semibold text-center text-sm line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-center text-muted-foreground line-clamp-1">
                    {product.category}
                  </p>
                </div>

                <div className="bg-primary h-0.5 w-full"></div>

                <div className="bg-primary text-primary-foreground p-2 hover:bg-primary/80 transition-all duration-300 ease-in-out">
                  <button
                    className="w-full text-center flex justify-center items-center gap-2 text-sm"
                    onClick={() => addToCart(product)}
                  >
                    <RiShoppingCartLine />
                    افزودن به سبد خرید
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-lg shadow-sm border border-border">
            <p className="text-muted-foreground">
              {activeCategory
                ? `محصولی در دسته‌بندی "${activeCategory}" یافت نشد`
                : "محصولی یافت نشد"}
            </p>
          </div>
        )}

        {/* Pagination */}
        {products.length > 0 && totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={goToPreviousPage}
              disabled={page === 1}
              className="px-4 py-2 bg-muted text-foreground rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted/80"
            >
              قبلی
            </button>
            
            {/* نمایش شماره صفحات */}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              // محاسبه شماره صفحه برای نمایش
              let pageNum = page <= 3 ? i + 1 : 
                           page >= totalPages - 2 ? totalPages - 4 + i :
                           page - 2 + i;
              
              if (pageNum < 1) pageNum = 1;
              if (pageNum > totalPages) pageNum = totalPages;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-4 py-2 rounded ${
                    page === pageNum
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={goToNextPage}
              disabled={page === totalPages}
              className="px-4 py-2 bg-muted text-foreground rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted/80"
            >
              بعدی
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}