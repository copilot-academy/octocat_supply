import { ChangeEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const { darkMode } = useTheme();
  const {
    items,
    subtotal,
    shippingFee,
    total,
    setItemQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const [couponCode, setCouponCode] = useState('');

  const updateQuantity = (productId: number, nextQuantity: number) => {
    if (nextQuantity < 1) {
      return;
    }
    setItemQuantity(productId, nextQuantity);
  };

  const handleQuantityInput = (productId: number, event: ChangeEvent<HTMLInputElement>) => {
    const parsed = Number(event.target.value);
    if (Number.isNaN(parsed)) {
      return;
    }
    updateQuantity(productId, parsed);
  };

  return (
    <div
      className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto">
        <h1
          className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}
        >
          Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div
            className={`mt-8 rounded-xl p-10 text-center ${darkMode ? 'bg-gray-800 text-light' : 'bg-white text-gray-800'} shadow-sm`}
          >
            <p className="text-lg font-semibold">Your cart is empty.</p>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
              Add products to your cart to review quantity and totals here.
            </p>
            <Link
              to="/products"
              className="inline-flex mt-6 bg-primary hover:bg-accent text-white px-5 py-3 rounded-lg font-medium transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <section className="lg:col-span-2">
              <div
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm overflow-hidden transition-colors duration-300`}
              >
                <div
                  className={`hidden md:grid grid-cols-[80px_1.4fr_0.8fr_1fr_0.8fr_100px] gap-3 px-4 py-3 text-sm font-semibold uppercase tracking-wide ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-600'}`}
                >
                  <span>SR</span>
                  <span>Products</span>
                  <span>Price</span>
                  <span>Quantity</span>
                  <span>Total</span>
                  <span>Action</span>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {items.map((item, index) => {
                    const effectivePrice = item.discount ? item.price * (1 - item.discount) : item.price;
                    const lineTotal = effectivePrice * item.quantity;

                    return (
                      <article
                        key={item.productId}
                        className="grid grid-cols-1 md:grid-cols-[80px_1.4fr_0.8fr_1fr_0.8fr_100px] gap-3 px-4 py-4 items-center"
                      >
                        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="flex items-center gap-3">
                          <img
                            src={`/${item.imgName}`}
                            alt={item.name}
                            className={`h-16 w-16 rounded-md object-contain ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-1`}
                          />
                          <div>
                            <p className={`${darkMode ? 'text-light' : 'text-gray-800'} font-semibold`}>
                              {item.name}
                            </p>
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                              Unit: {item.unit}
                            </p>
                          </div>
                        </div>
                        <p className={`${darkMode ? 'text-light' : 'text-gray-700'} font-medium`}>
                          ${effectivePrice.toFixed(2)}
                        </p>

                        <div
                          className={`inline-flex items-center justify-between rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} p-1 max-w-[170px]`}
                        >
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className={`${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} w-8 h-8 text-xl transition-colors`}
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(event) => handleQuantityInput(item.productId, event)}
                            className={`${darkMode ? 'bg-gray-700 text-light' : 'bg-gray-200 text-gray-800'} w-12 text-center border-none focus:ring-0`}
                            aria-label={`Quantity for ${item.name}`}
                          />
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className={`${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} w-8 h-8 text-xl transition-colors`}
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            +
                          </button>
                        </div>

                        <p className="text-primary font-semibold">${lineTotal.toFixed(2)}</p>

                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="text-red-500 hover:text-red-400 transition-colors text-sm font-semibold"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          Remove
                        </button>
                      </article>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={clearCart}
                  className={`${darkMode ? 'bg-gray-700 text-light hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} px-4 py-2 rounded-lg transition-colors`}
                >
                  Clear Cart
                </button>
                <Link
                  to="/products"
                  className="bg-primary hover:bg-accent text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </section>

            <aside
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm transition-colors duration-300`}
            >
              <h2 className={`${darkMode ? 'text-light' : 'text-gray-800'} text-xl font-bold`}>
                Cart Total
              </h2>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Subtotal</span>
                  <span className={darkMode ? 'text-light' : 'text-gray-800'}>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Shipping</span>
                  <span className={darkMode ? 'text-light' : 'text-gray-800'}>
                    {shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
              </div>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-3 text-xs`}>
                Free shipping on orders of $100 or more, otherwise $25 shipping.
              </p>

              <div
                className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}
              >
                <span className={`${darkMode ? 'text-light' : 'text-gray-800'} font-semibold`}>Total</span>
                <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="coupon"
                  className={`block mb-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    id="coupon"
                    type="text"
                    value={couponCode}
                    onChange={(event) => setCouponCode(event.target.value)}
                    placeholder="Enter code"
                    className={`flex-1 px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-light' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                  />
                  <button
                    type="button"
                    className="bg-primary hover:bg-accent text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponCode.length > 0 && (
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-2 text-xs`}>
                    Coupon validation will be available when checkout APIs are connected.
                  </p>
                )}
              </div>

              <button
                type="button"
                className="mt-6 w-full bg-primary hover:bg-accent text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Proceed to Checkout
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
