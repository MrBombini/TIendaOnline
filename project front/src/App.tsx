import React, { useEffect, useState } from 'react';
import { ShoppingCart as CartIcon } from 'lucide-react';
import { Product, CartItem,CheckoutForm  } from './types';
import { getProducts } from './services/api';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';7


function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const productsList = await getProducts();
      setProducts(productsList);
      setLoading(false);
    };
    loadProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    setShowCart(false);
    setIsCheckout(true);
  };

  const handleCompletePurchase = (formData: CheckoutForm) => {
    // Here you would typically send the order to your backend
    console.log('Purchase completed:', { formData, items: cartItems });
    setCartItems([]);
    setIsCheckout(false);
    alert('Thank you for your purchase!');
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Online Store</h1>
          <button
            onClick={() => setShowCart(true)}
            className="relative p-2 text-gray-600 hover:text-gray-900"
          >
            <CartIcon size={24} />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isCheckout ? (
          <Checkout total={cartTotal} onSubmit={handleCompletePurchase} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </main>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-gray-100 shadow-xl">
            <div className="flex justify-between items-center p-4 bg-white">
              <h2 className="text-xl font-semibold">Your Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="sr-only">Close cart</span>
                ×
              </button>
            </div>
            <Cart
              items={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;