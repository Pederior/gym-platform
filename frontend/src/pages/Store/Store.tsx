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
import ProductSorting from "./ProductSorting";
import ProductsPerPage from "./ProductsPerPage";
import type { Product } from "../../types";
import { RiShoppingCartLine } from "react-icons/ri";
import { toast } from "react-hot-toast";

const categories = [
  { id: 1, title: "همه محصولات", count: 8 },
  { id: 2, title: "پودر", count: 7 },
  { id: 3, title: "محرک", count: 4 },
  { id: 4, title: "ست کامل", count: 3 },
  { id: 5, title: "نسخه محدود", count: 3 },
  { id: 6, title: "ساخت عضلات", count: 3 },
  { id: 7, title: "انحصاری", count: 3 },
  { id: 8, title: "مکمل غذایی", count: 1 },
];

export default function Store() {
  const [activeId, setActiveId] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("menu_order");
  const [perPage, setPerPage] = useState(16);
  const [page, setPage] = useState(1);
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get(
          `/products?sort=${sortBy}&limit=${perPage}&page=${page}`,
        );
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [sortBy, perPage, page]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setPage(1);
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setPage(1);
  };

  const addToCart = (product: Product) => {
    // Check if product is already in cart
    const existingItem = cart.find(item => item._id === product._id);
    
    if (existingItem) {
      toast.error('این محصول قبلاً به سبد خرید اضافه شده است', {
        duration: 2000,
      });
      return;
    }

    // Add product to cart
    const newCart = [...cart, product];
    setCart(newCart);

    // Show success toast
    toast.success(`${product.name} به سبد خرید اضافه شد`, {
      duration: 2000,
      icon: '🛒',
    });

    // Optional: Show cart count animation
    const cartCountElement = document.querySelector('[data-cart-count]');
    if (cartCountElement) {
      cartCountElement.classList.add('animate-bounce');
      setTimeout(() => {
        cartCountElement.classList.remove('animate-bounce');
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className="w-full bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/bg-header.jpg')",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <TopBar iconColor="gray-300" textColor="white" />
          <Navbar />
        </div>
        <div className="max-w-7xl mx-auto flex justify-between my-5 pb-5">
          <span className="text-white text-lg font-bold">فروشگاه</span>
          <div className="flex text-lg text-white gap-2">
            <Link to="/">
              <HiHome className="font-bold" />
            </Link>
            <MdKeyboardDoubleArrowLeft className="text-gray-300/70" />
            <span className="text-sm">فروشگاه</span>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-500">
            نمایش {products.length} نتیجه
          </div>
          <div className="flex items-center gap-4">
            <ProductsPerPage onPerPageChange={handlePerPageChange} />
            <ProductSorting onSortChange={handleSortChange} />
          </div>
        </div>

        {/* Categories Swiper */}
        <Swiper
          slidesPerView="auto"
          spaceBetween={20}
          dir="rtl"
          className="pb-6 mb-8"
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat.id} style={{ width: "230px" }}>
              <button
                onClick={() => setActiveId(cat.id)}
                className={`w-full flex items-center justify-start gap-4 px-4 py-4 rounded-lg transition ${
                  activeId === cat.id
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <FaRegFolder
                    className={`text-2xl ${
                      activeId === cat.id ? "text-red-500" : "text-gray-500"
                    }`}
                  />
                </div>

                <div className="text-right">
                  <div className="font-semibold">{cat.title}</div>
                  <div className="text-sm opacity-80">{cat.count} محصول</div>
                </div>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(perPage)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200" />
                <div className="bg-gray-800 p-3">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto" />
                  <div className="h-3 bg-gray-700 rounded w-1/2 mx-auto mt-1" />
                </div>
                <div className="bg-red-500 p-2">
                  <div className="h-4 bg-red-600 rounded w-3/4 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {products.map((product) => (
              <div
                key={product._id}
                className="group bg-white rounded-b-md overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Price Tag */}
                <div className="absolute bg-black text-red-500 font-extralight px-3 py-1 z-10">
                  <span className="font-bold text-lg">
                    {product.price.toLocaleString()} تومان
                  </span>
                </div>

                {/* Product Image */}
                <div className="h-80 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <span className="text-gray-400">بدون تصویر</span>
                  )}
                </div>

                {/* Black Section */}
                <div className="bg-black text-white p-3 h-24 flex flex-col items-center justify-center gap-1">
                  <h3 className="font-semibold text-center">{product.name}</h3>
                  <p className="text-sm text-center opacity-75">
                    {product.category}
                  </p>
                </div>

                <div className="bg-red-500 h-0.5 w-full"></div>

                {/* Red Button Section */}
                <div className="bg-red-500 text-white p-2 hover:bg-black/95 transition-all duration-300 ease-in-out">
                  <button
                    className="w-full text-center flex justify-center items-center gap-2"
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
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">محصولی یافت نشد</p>
          </div>
        )}

        {/* Pagination (optional) */}
        {products.length > 0 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
            >
              قبلی
            </button>
            <span className="px-4 py-2 mx-1 bg-red-500 text-white rounded">
              صفحه {page}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 mx-1 bg-gray-200 rounded"
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