import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiShoppingBag4Fill, RiDeleteBin6Line } from "react-icons/ri";
import { FaArrowLeft, FaTrash, FaCheckCircle } from "react-icons/fa";
import { MdLocationOn, MdPhone, MdEmail } from "react-icons/md";
import type { Product } from "../../types";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { useAppSelector } from "../../store/hook";

export default function Cart() {
  const [cart, setCart] = useState<Product[]>([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { token } = useAppSelector((state) => state.auth);
  // فرم اطلاعات خریدار
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    postalCode: "",
    city: "",
    notes: "",
  });

  const navigate = useNavigate();

  // لود سبد خرید از localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // حذف محصول از سبد خرید
  const removeFromCart = (productId: string) => {
    const newCart = cart.filter((item) => item._id !== productId);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    toast.success("محصول از سبد خرید حذف شد");
  };

  // خالی کردن سبد خرید
  const clearCart = () => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید سبد خرید را خالی کنید؟")) {
      return;
    }
    setCart([]);
    localStorage.removeItem("cart");
    toast.success("سبد خرید خالی شد");
  };

  // محاسبه مجموع قیمت
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  // تغییرات فرم
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // اعتبارسنجی فرم
  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("لطفاً نام و نام خانوادگی را وارد کنید");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("لطفاً شماره تماس را وارد کنید");
      return false;
    }
    if (!formData.address.trim()) {
      toast.error("لطفاً آدرس را وارد کنید");
      return false;
    }
    if (!formData.postalCode.trim()) {
      toast.error("لطفاً کد پستی را وارد کنید");
      return false;
    }
    if (!formData.city.trim()) {
      toast.error("لطفاً شهر را وارد کنید");
      return false;
    }
    return true;
  };

  // پرداخت/خرید
  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("سبد خرید شما خالی است");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setCheckoutLoading(true);

    try {
      const response = await api.post(
        "/orders",
        {
          products: cart.map((p) => ({
            productId: p._id,
            name: p.name,
            price: p.price,
            quantity: 1,
          })),
          customer: formData,
          totalAmount: calculateTotal(),
          type: 'order'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ اضافه کن
          },
        },
      );

      // پاک کردن سبد خرید
      setCart([]);
      localStorage.removeItem("cart");

      toast.success("سفارش شما با موفقیت ثبت شد!", {
        duration: 3000,
        icon: "✅",
      });

      // ریدایرکت به صفحه موفقیت
      setTimeout(() => {
        navigate("/order-success", { state: { order: response.data } });
      }, 2000);
    } catch (err) {
      console.error("Error placing order:", err);
      toast.error(err.response?.data?.message || "خطا در ثبت سفارش");
    } finally {
      setCheckoutLoading(false);
    }
  };

  // ادامه خرید
  const continueShopping = () => {
    navigate("/store");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/store"
            className="inline-flex items-center gap-2 text-red-500 hover:text-red-600 mb-4"
          >
            <FaArrowLeft />
            بازگشت به فروشگاه
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">
            سبد خرید ({cart.length})
          </h1>
          <p className="text-gray-500 mt-2">
            لطفاً اطلاعات خود را برای ادامه خرید وارد کنید
          </p>
        </div>

        {cart.length === 0 ? (
          // سبد خرید خالی
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <RiShoppingBag4Fill className="text-6xl mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              سبد خرید شما خالی است
            </h2>
            <p className="text-gray-500 mb-6">
              محصولی برای خرید انتخاب نکرده‌اید
            </p>
            <button
              onClick={continueShopping}
              className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition"
            >
              ادامه خرید
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* سمت چپ - لیست محصولات */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-red-500 text-white px-6 py-4 flex justify-between items-center">
                  <h2 className="font-bold text-lg">محصولات سبد خرید</h2>
                  <button
                    onClick={clearCart}
                    className="text-white hover:text-gray-200 flex items-center gap-2 text-sm"
                  >
                    <FaTrash />
                    خالی کردن سبد
                  </button>
                </div>

                {/* Products List */}
                <div className="divide-y divide-gray-100">
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="p-6 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-start gap-4">
                        {/* Image */}
                        <div className="shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-400 text-xs">
                                بدون تصویر
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.category}
                          </p>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {item.description}
                          </p>
                        </div>

                        {/* Price & Actions */}
                        <div className="shrink-0 text-right">
                          <div className="font-bold text-red-500 text-lg mb-2">
                            {item.price.toLocaleString()} تومان
                          </div>
                          <button
                            onClick={() => removeFromCart(item._id!)}
                            className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                          >
                            <RiDeleteBin6Line />
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* سمت راست - فرم و خلاصه سفارش */}
            <div className="lg:col-span-1">
              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-sm mb-6 p-6 sticky top-24">
                <h3 className="font-bold text-lg text-gray-800 mb-4">
                  خلاصه سفارش
                </h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">تعداد محصولات:</span>
                    <span className="font-bold">{cart.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">مجموع کل:</span>
                    <span className="font-bold text-red-500 text-xl">
                      {calculateTotal().toLocaleString()} تومان
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowForm(!showForm)}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2 mb-4"
                >
                  {showForm ? "پنهان کردن فرم" : "نمایش فرم اطلاعات"}
                  <span
                    className={`transform transition-transform ${showForm ? "rotate-180" : ""}`}
                  >
                    ▼
                  </span>
                </button>

                {showForm && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        نام و نام خانوادگی *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="نام و نام خانوادگی خود را وارد کنید"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        شماره تماس *
                      </label>
                      <div className="relative">
                        <MdPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="09123456789"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ایمیل
                      </label>
                      <div className="relative">
                        <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="example@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        آدرس کامل *
                      </label>
                      <div className="relative">
                        <MdLocationOn className="absolute left-3 top-3 text-gray-400" />
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="آدرس کامل خود را وارد کنید"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          کد پستی *
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="1234567890"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          شهر *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="تهران"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        توضیحات (اختیاری)
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="توضیحات بیشتر..."
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className={`w-full bg-red-500 text-white py-4 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2 ${
                    checkoutLoading ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {checkoutLoading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      در حال پردازش...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      پرداخت و ثبت سفارش
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 mt-3 text-center">
                  با کلیک بر روی دکمه پرداخت، شما با قوانین و مقررات ما موافقت
                  می‌کنید
                </p>
              </div>

              {/* Continue Shopping */}
              <button
                onClick={continueShopping}
                className="w-full bg-white border-2 border-red-500 text-red-500 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition"
              >
                ادامه خرید
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
