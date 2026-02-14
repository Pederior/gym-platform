import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../../components/ui/Card";
import api from "../../../services/api";
import { useAppSelector } from "../../../store/hook";
import { RiShoppingBag4Fill, RiShoppingCart2Line, RiCloseLine, RiDeleteBin6Line } from "react-icons/ri";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-hot-toast";
import useDocumentTitle from '../../../hooks/useDocumentTitle';

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
  useDocumentTitle('فروشگاه شخصی');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'recommended' | 'all' | 'bundles'>('recommended');
  const [cart, setCart] = useState<Product[]>([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  
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
        toast.error('خطا در بارگذاری محصولات');
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

  // محاسبه مجموع سبد خرید
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + getDiscountedPrice(item.price), 0);
  };

  // Add to cart function
  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item._id === product._id);
    
    if (existingItem) {
      toast.error('این محصول قبلاً به سبد خرید اضافه شده است', { duration: 2000 });
      return;
    }

    const newCart = [...cart, product];
    setCart(newCart);

    toast.success(`${product.name} به سبد خرید اضافه شد`, {
      duration: 2000,
      icon: '🛒',
    });

    setShowCartModal(true);
  };

  // Remove from cart
  const removeFromCart = (productId: string) => {
    const newCart = cart.filter(item => item._id !== productId);
    setCart(newCart);
    toast.success('محصول از سبد خرید حذف شد');
    
    if (newCart.length === 0) {
      setShowCartModal(false);
    }
  };

  // Clear cart
  const clearCart = () => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید سبد خرید را خالی کنید؟')) {
      return;
    }
    setCart([]);
    localStorage.removeItem('cart');
    setShowCartModal(false);
    toast.success('سبد خرید خالی شد');
  };

  // نمایش صفحه سبد خرید کامل
  const viewFullCart = () => {
    setShowCartModal(false);
    navigate('/cart');
  };

  // ادامه خرید
  const continueShopping = () => {
    setShowCartModal(false);
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setShowProductModal(false);
    document.body.style.overflow = 'auto';
  };

  // بستن مودال سبد خرید
  const closeCartModal = () => {
    setShowCartModal(false);
    document.body.style.overflow = 'auto';
  };

  // بستن با کلید ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showProductModal) closeProductModal();
        if (showCartModal) closeCartModal();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showProductModal, showCartModal]);

  // بستن با کلیک خارج از مودال
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>, closeFn: () => void) => {
    if (e.target === e.currentTarget) {
      closeFn();
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">در حال بارگذاری محصولات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header with Cart Button */}
      <div className="sticky top-0 z-50 bg-card shadow-sm py-4 px-4 border-b border-border">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">فروشگاه شخصی شما</h1>
            <p className="text-sm text-muted-foreground mt-1">
              پلن فعلی: <span className="font-bold text-primary capitalize">{userPlan}</span>
              {userPlan === 'silver' && ' (10% تخفیف)'}
              {userPlan === 'gold' && ' (15% تخفیف + ارسال رایگان)'}
            </p>
          </div>
          
          <button
            onClick={() => setShowCartModal(true)}
            className="relative bg-primary text-primary-foreground px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-primary/80 transition flex items-center gap-2 shadow-lg"
          >
            {cart.length > 0 && (
              <span className="absolute -top-2 -left-2 bg-background text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold animate-bounce">
                {cart.length}
              </span>
            )}
            <RiShoppingBag4Fill className="text-lg sm:text-xl" />
            <span>سبد خرید</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* تب‌ها */}
        <div className="flex justify-center mb-8">
          <div className="bg-muted p-1 rounded-lg flex flex-wrap justify-center gap-1">
            {([
              { key: 'recommended', label: 'پیشنهادی برای شما' },
              { key: 'all', label: 'همه محصولات' },
              { key: 'bundles', label: 'پکیج‌های ویژه' }
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 sm:px-6 py-2 rounded-md text-sm sm:text-base font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-card text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* محتوای تب‌ها */}
        {activeTab === 'recommended' && (
          <div>
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-foreground">محصولات مناسب پلن {userPlan}</h2>
            {recommendedProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                محصولی برای پلن شما یافت نشد
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedProducts.map(product => (
                  <Card key={product._id} className="p-4 border-2 border-primary/20 bg-primary/5">
                    <div className="flex justify-between items-start mb-2">
                      <button
                        onClick={() => openProductModal(product)}
                        className="font-bold text-base sm:text-lg text-primary hover:text-primary/80 transition cursor-pointer"
                      >
                        {product.name}
                      </button>
                      <span className="bg-accent/10 text-accent px-2 py-1 rounded-full text-xs">
                        مناسب پلن {userPlan}
                      </span>
                    </div>
                    
                    <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <span className="text-muted-foreground">بدون تصویر</span>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-primary font-bold">
                          {formatPrice(getDiscountedPrice(product.price))}
                        </div>
                        {userPlan !== 'bronze' && (
                          <div className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.price)}
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => addToCart(product)}
                        className="bg-primary text-primary-foreground px-3 sm:px-4 py-2 rounded-lg hover:bg-primary/80 flex items-center gap-2 transition transform hover:scale-105"
                      >
                        <RiShoppingCart2Line />
                        <span className="hidden sm:inline">افزودن به سبد</span>
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
                  className="font-bold text-base sm:text-lg mb-2 text-primary hover:text-primary/80 transition cursor-pointer"
                >
                  {product.name}
                </button>
                
                <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-muted-foreground">بدون تصویر</span>
                  )}
                </div>
                
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-primary font-bold">
                      {formatPrice(getDiscountedPrice(product.price))}
                    </div>
                    {userPlan !== 'bronze' && (
                      <div className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.price)}
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => addToCart(product)}
                    className="bg-primary text-primary-foreground px-3 sm:px-4 py-2 rounded-lg hover:bg-primary/80 flex items-center gap-2 transition transform hover:scale-105"
                  >
                    <RiShoppingCart2Line />
                    <span className="hidden sm:inline">افزودن به سبد</span>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'bundles' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bundles.map(bundle => (
              <Card key={bundle.id} className="p-6 border-2 border-accent/20 bg-accent/5">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-accent">{bundle.name}</h3>
                  <span className="bg-destructive/10 text-destructive px-2 py-1 rounded-full text-sm">
                    %{bundle.discount} تخفیف
                  </span>
                </div>
                
                <ul className="mb-4 space-y-2">
                  {bundle.products.map((product, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="text-primary mr-2">✓</span>
                      <span>{product}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-primary">
                      {formatPrice(getDiscountedPrice(bundle.bundlePrice))}
                    </div>
                    <div className="text-sm text-muted-foreground line-through">
                      {formatPrice(bundle.originalPrice)}
                    </div>
                  </div>
                  <button className="bg-accent text-accent-foreground px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-accent/80 transition transform hover:scale-105">
                    خرید پکیج
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Button (Mobile) */}
      <button
        onClick={() => setShowCartModal(true)}
        className="fixed bottom-6 right-6 bg-primary text-primary-foreground w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:bg-primary/80 transition z-50 lg:hidden"
      >
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-background text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
            {cart.length}
          </span>
        )}
        <RiShoppingBag4Fill className="text-xl" />
      </button>

      {/* Product Detail Modal */}
      {showProductModal && selectedProduct && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => handleModalClick(e, closeProductModal)}
        >
          <div className="bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative border border-border">
            <button
              onClick={closeProductModal}
              className="absolute top-4 left-4 z-10 bg-background rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-muted transition"
              aria-label="بستن"
            >
              <RiCloseLine className="text-2xl text-muted-foreground" />
            </button>

            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <div className="flex items-center justify-center">
                  {selectedProduct.image ? (
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="max-w-full max-h-80 sm:max-h-100 object-contain"
                    />
                  ) : (
                    <div className="w-full h-64 sm:h-80 bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-muted-foreground text-base sm:text-lg">بدون تصویر</span>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                      {selectedProduct.name}
                    </h2>
                    <p className="text-muted-foreground">{selectedProduct.category}</p>
                  </div>

                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">قیمت:</span>
                      <div className="text-right">
                        <div className="text-2xl sm:text-3xl font-bold text-primary">
                          {formatPrice(getDiscountedPrice(selectedProduct.price))}
                        </div>
                        {userPlan !== 'bronze' && (
                          <div className="text-sm text-muted-foreground line-through mt-1">
                            {formatPrice(selectedProduct.price)}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {userPlan !== 'bronze' && (
                      <div className="mt-3 text-center">
                        <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
                          تخفیف {userPlan === 'silver' ? '10%' : '15%'} برای کاربران {userPlan === 'silver' ? 'نقره‌ای' : 'طلایی'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-foreground mb-3">توضیحات:</h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {selectedProduct.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-foreground mb-3">نوع محصول:</h3>
                    <span className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-sm font-medium ${
                      selectedProduct.type === 'supplement' ? 'bg-primary/10 text-primary' :
                      selectedProduct.type === 'clothing' ? 'bg-green-500/10 text-green-500' :
                      selectedProduct.type === 'accessory' ? 'bg-purple-500/10 text-purple-500' :
                      'bg-orange-500/10 text-orange-500'
                    }`}>
                      {selectedProduct.type === 'supplement' ? 'مکمل' :
                       selectedProduct.type === 'clothing' ? 'پوشاک' :
                       selectedProduct.type === 'accessory' ? 'لوازم جانبی' : 'محصول دیجیتال'}
                    </span>
                  </div>

                  {selectedProduct.compatiblePlans.length > 0 && (
                    <div>
                      <h3 className="font-bold text-lg text-foreground mb-3">پلن‌های سازگار:</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.compatiblePlans.map(plan => (
                          <span key={plan} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                            {plan === 'bronze' ? 'برنز' : plan === 'silver' ? 'نقره‌ای' : 'طلایی'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border">
                    <button
                      onClick={() => {
                        addToCart(selectedProduct);
                        closeProductModal();
                      }}
                      className="w-full bg-primary text-primary-foreground py-3 sm:py-4 rounded-lg hover:bg-primary/80 transition flex items-center justify-center gap-2 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl"
                    >
                      <RiShoppingCart2Line className="text-xl" />
                      افزودن به سبد خرید
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Preview Modal */}
      {showCartModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => handleModalClick(e, closeCartModal)}
        >
          <div className="bg-card rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative border border-border">
            <button
              onClick={closeCartModal}
              className="absolute top-4 left-4 z-10 bg-background rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-muted transition"
              aria-label="بستن سبد خرید"
            >
              <RiCloseLine className="text-2xl text-muted-foreground" />
            </button>

            <div className="p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                  <RiShoppingBag4Fill className="text-primary" />
                  سبد خرید شما ({cart.length})
                </h2>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-sm text-destructive hover:text-destructive/80 flex items-center gap-1"
                  >
                    <RiDeleteBin6Line />
                    خالی کردن سبد
                  </button>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <RiShoppingBag4Fill className="text-3xl text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-lg font-medium">سبد خرید شما خالی است</p>
                  <p className="text-muted-foreground mt-2">محصولی برای خرید انتخاب نکرده‌اید</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                    {cart.map((item) => (
                      <div key={item._id} className="flex gap-3 pb-3 border-b border-border">
                        <div className="w-16 h-16 shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                              <span className="text-muted-foreground text-xs">بدون تصویر</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <h3 className="font-bold text-foreground line-clamp-1">{item.name}</h3>
                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="text-destructive hover:text-destructive/80 p-1"
                              title="حذف"
                            >
                              <RiDeleteBin6Line />
                            </button>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{item.category}</p>
                          <div className="mt-2 flex justify-between items-end">
                            <span className="text-xs text-muted-foreground">
                              پلن {userPlan === 'bronze' ? 'برنز' : userPlan === 'silver' ? 'نقره‌ای' : 'طلایی'}
                            </span>
                            <span className="font-bold text-primary text-sm">
                              {formatPrice(getDiscountedPrice(item.price))}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-muted p-4 rounded-lg mb-6">
                    <div className="flex justify-between text-lg font-bold text-foreground mb-2">
                      <span>مجموع کل:</span>
                      <span className="text-primary">{formatPrice(calculateTotal())}</span>
                    </div>
                    {userPlan !== 'bronze' && (
                      <p className="text-xs text-accent text-center mt-1">
                        شامل تخفیف {userPlan === 'silver' ? '10%' : '15%'} برای کاربران {userPlan === 'silver' ? 'نقره‌ای' : 'طلایی'}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={viewFullCart}
                      className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/80 transition flex items-center justify-center gap-2 font-bold text-base shadow-lg"
                    >
                      <FaCheckCircle />
                      ادامه و پرداخت
                    </button>
                    <button
                      onClick={continueShopping}
                      className="w-full bg-background border-2 border-primary text-primary py-3 rounded-lg hover:bg-primary/5 hover:text-primary/80 transition font-medium"
                    >
                      <FaArrowLeft className="inline ml-1" />
                      ادامه خرید
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}