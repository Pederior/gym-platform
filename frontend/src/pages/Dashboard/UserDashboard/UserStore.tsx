import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../../components/ui/Card";
import api from "../../../services/api";
import { useAppSelector } from "../../../store/hook";
import { RiShoppingBag4Fill, RiShoppingCart2Line, RiCloseLine } from "react-icons/ri";
import { toast } from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  price: number;
  type: 'supplement' | 'clothing' | 'accessory' | 'digital';
  category: string;
  description: string;
  image: string;
  compatiblePlans: string[];
  bundles: string[];
}

export default function UserStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'recommended' | 'all' | 'bundles'>('recommended');
  const [cart, setCart] = useState<Product[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  const { user } = useAppSelector((state) => state.auth);
  const userPlan = user?.subscription?.plan || 'bronze';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data.products || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // محصولات پیشنهادی بر اساس پلن کاربر
  const recommendedProducts = products.filter(product => 
    product.compatiblePlans.includes(userPlan)
  );

  // پکیج‌های ویژه
  const bundles = [
    {
      id: 'mass-gain-starter',
      name: 'پک افزایش حجم مبتدی',
      products: ['وی اقتصادی', 'کراتین', 'برنامه تمرینی PDF'],
      originalPrice: 1500000,
      bundlePrice: 1299000,
      discount: 14
    },
    {
      id: 'fat-loss-pro',
      name: 'پک چربی‌سوزی حرفه‌ای',
      products: ['چربی‌سوز', 'مولتی‌ویتامین', 'دوره ویدیویی چربی‌سوزی'],
      originalPrice: 2200000,
      bundlePrice: 1899000,
      discount: 14
    }
  ];

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR') + ' تومان';
  };

  // محاسبه تخفیف بر اساس پلن
  const getDiscountedPrice = (price: number) => {
    let discount = 0;
    if (userPlan === 'silver') discount = 10;
    if (userPlan === 'gold') discount = 15;
    
    return price - (price * discount / 100);
  };

  // Add to cart function
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

    setShowCart(true);
    setTimeout(() => setShowCart(false), 3000);
  };

  // const removeFromCart = (productId: string) => {
  //   const newCart = cart.filter(item => item._id !== productId);
  //   setCart(newCart);
  //   toast.success('محصول از سبد خرید حذف شد');
  // };
  // const clearCart = () => {
  //   if (!confirm('آیا مطمئن هستید که می‌خواهید سبد خرید را خالی کنید؟')) {
  //     return;
  //   }
  //   setCart([]);
  //   localStorage.removeItem('cart');
  //   toast.success('سبد خرید خالی شد');
  // };
  // const calculateTotal = () => {
  //   return cart.reduce((total, item) => total + getDiscountedPrice(item.price), 0);
  // };

  const viewCart = () => {
    navigate('/cart');
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setShowModal(false);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeProductModal();
      }
    };

    if (showModal) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [showModal]);

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeProductModal();
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">در حال بارگذاری محصولات...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="sticky top-0 z-50 bg-white shadow-sm py-4 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">فروشگاه شخصی شما</h1>
            <p className="text-sm text-gray-600 mt-1">
              پلن فعلی: <span className="font-bold text-red-600 capitalize">{userPlan}</span>
              {userPlan === 'silver' && ' (10% تخفیف)'}
              {userPlan === 'gold' && ' (15% تخفیف + ارسال رایگان)'}
            </p>
          </div>
          
          <button
            onClick={viewCart}
            className="relative bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition flex items-center gap-2 shadow-lg"
          >
            {cart.length > 0 && (
              <span className="absolute -top-2 -left-2 bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold animate-bounce">
                {cart.length}
              </span>
            )}
            <RiShoppingBag4Fill className="text-xl" />
            <span>سبد خرید</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-lg flex">
            {([
              { key: 'recommended', label: 'پیشنهادی برای شما' },
              { key: 'all', label: 'همه محصولات' },
              { key: 'bundles', label: 'پکیج‌های ویژه' }
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-2 rounded-md font-medium ${
                  activeTab === tab.key
                    ? 'bg-white text-red-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'recommended' && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">محصولات مناسب پلن {userPlan}</h2>
            {recommendedProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                محصولی برای پلن شما یافت نشد
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedProducts.map(product => (
                  <Card key={product._id} className="p-4 border-2 border-red-200 bg-red-50">
                    <div className="flex justify-between items-start mb-2">
                      <button
                        onClick={() => openProductModal(product)}
                        className="font-bold text-lg text-red-600 hover:text-red-700 transition cursor-pointer"
                      >
                        {product.name}
                      </button>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        مناسب پلن {userPlan}
                      </span>
                    </div>
                    
                    <div className="aspect-square bg-gray-200 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <span className="text-gray-500">بدون تصویر</span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-red-600 font-bold">
                          {formatPrice(getDiscountedPrice(product.price))}
                        </div>
                        {userPlan !== 'bronze' && (
                          <div className="text-sm text-gray-500 line-through">
                            {formatPrice(product.price)}
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => addToCart(product)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 transition transform hover:scale-105"
                      >
                        <RiShoppingCart2Line />
                        افزودن به سبد
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'all' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <Card key={product._id} className="p-4 hover:shadow-lg transition">
                <button
                  onClick={() => openProductModal(product)}
                  className="font-bold text-lg mb-2 text-red-600 hover:text-red-700 transition cursor-pointer"
                >
                  {product.name}
                </button>
                
                <div className="aspect-square bg-gray-200 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-gray-500">بدون تصویر</span>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-red-600 font-bold">
                      {formatPrice(getDiscountedPrice(product.price))}
                    </div>
                    {userPlan !== 'bronze' && (
                      <div className="text-sm text-gray-500 line-through">
                        {formatPrice(product.price)}
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => addToCart(product)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 transition transform hover:scale-105"
                  >
                    <RiShoppingCart2Line />
                    افزودن به سبد
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'bundles' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bundles.map(bundle => (
              <Card key={bundle.id} className="p-6 border-2 border-yellow-200 bg-yellow-50">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-yellow-800">{bundle.name}</h3>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                    %{bundle.discount} تخفیف
                  </span>
                </div>
                
                <ul className="mb-4 space-y-2">
                  {bundle.products.map((product, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>{product}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-bold text-red-600">
                      {formatPrice(getDiscountedPrice(bundle.bundlePrice))}
                    </div>
                    <div className="text-sm text-gray-500 line-through">
                      {formatPrice(bundle.originalPrice)}
                    </div>
                  </div>
                  <button className="bg-linear-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition transform hover:scale-105">
                    خرید پکیج
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={viewCart}
        className="fixed bottom-6 left-6 bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:bg-red-600 transition z-50 lg:hidden"
      >
        {cart.length > 0 && (
          <span className="absolute -top-2 -left-2 bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
            {cart.length}
          </span>
        )}
        <RiShoppingBag4Fill className="text-2xl" />
      </button>

      {showModal && selectedProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={handleModalClick}
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            {/* Close Button */}
            <button
              onClick={closeProductModal}
              className="absolute top-4 left-4 z-10 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-100 transition"
              aria-label="بستن"
            >
              <RiCloseLine className="text-2xl text-gray-600" />
            </button>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex items-center justify-center">
                  {selectedProduct.image ? (
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="max-w-full max-h-100 object-contain"
                    />
                  ) : (
                    <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-lg">بدون تصویر</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                      {selectedProduct.name}
                    </h2>
                    <p className="text-lg text-gray-600">{selectedProduct.category}</p>
                  </div>

                  {/* Price Section */}
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">قیمت:</span>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-red-600">
                          {formatPrice(getDiscountedPrice(selectedProduct.price))}
                        </div>
                        {userPlan !== 'bronze' && (
                          <div className="text-sm text-gray-500 line-through mt-1">
                            {formatPrice(selectedProduct.price)}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {userPlan !== 'bronze' && (
                      <div className="mt-3 text-center">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          تخفیف {userPlan === 'silver' ? '10%' : '15%'} برای کاربران {userPlan === 'silver' ? 'نقره‌ای' : 'طلایی'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-3">توضیحات:</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* Product Type */}
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-3">نوع محصول:</h3>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                      selectedProduct.type === 'supplement' ? 'bg-blue-100 text-blue-800' :
                      selectedProduct.type === 'clothing' ? 'bg-green-100 text-green-800' :
                      selectedProduct.type === 'accessory' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {selectedProduct.type === 'supplement' ? 'مکمل' :
                       selectedProduct.type === 'clothing' ? 'پوشاک' :
                       selectedProduct.type === 'accessory' ? 'لوازم جانبی' : 'محصول دیجیتال'}
                    </span>
                  </div>

                  {/* Compatible Plans */}
                  {selectedProduct.compatiblePlans.length > 0 && (
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 mb-3">پلن‌های سازگار:</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.compatiblePlans.map(plan => (
                          <span key={plan} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {plan === 'bronze' ? 'برنز' : plan === 'silver' ? 'نقره‌ای' : 'طلایی'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        addToCart(selectedProduct);
                        closeProductModal();
                      }}
                      className="w-full bg-red-500 text-white py-4 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2 text-lg font-bold shadow-lg hover:shadow-xl"
                    >
                      <RiShoppingCart2Line className="text-2xl" />
                      افزودن به سبد خرید
                    </button>
                    
                    <p className="text-center text-sm text-gray-500 mt-3">
                      با کلیک بر روی دکمه، محصول به سبد خرید شما اضافه می‌شود
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}