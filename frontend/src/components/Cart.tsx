import { Link } from 'react-router-dom';
import { useState } from 'react';
import CartItemsTable from './cart/CartItemsTable';
import OrderSummary from './cart/OrderSummary';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const DISCOUNT_RATE = 0.05;
const SHIPPING_COST = 10;

export default function Cart() {
  const { items, updateQuantity, removeItem } = useCart();
  const { darkMode } = useTheme();
  const [statusMessage, setStatusMessage] = useState('');

  const subtotal = items.reduce((total, item) => {
    const unitPrice = item.price * (1 - (item.discount ?? 0));
    return total + unitPrice * item.quantity;
  }, 0);
  const discount = subtotal * DISCOUNT_RATE;
  const shipping = items.length > 0 ? SHIPPING_COST : 0;
  const grandTotal = subtotal - discount + shipping;

  const panelClass = darkMode ? 'bg-gray-800 text-light' : 'bg-white text-gray-800';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <section
      className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} px-4 pb-16 pt-24 transition-colors duration-300`}
    >
      <div className="mx-auto max-w-7xl">
        <h1 className={`mb-6 text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
          Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div className={`${panelClass} rounded-xl p-10 text-center shadow-lg`}>
            <p className="mb-5 text-lg">Your cart is empty.</p>
            <Link
              to="/products"
              className="inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-accent"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <CartItemsTable
              items={items}
              darkMode={darkMode}
              borderClass={borderClass}
              onQuantityChange={updateQuantity}
              onRemove={removeItem}
              onCouponSubmit={(couponCode) =>
                setStatusMessage(
                  couponCode.trim()
                    ? 'Coupon codes are not available yet.'
                    : 'Enter a coupon code to apply it.',
                )
              }
              onUpdate={() => setStatusMessage('Cart updated.')}
            />
            <OrderSummary
              subtotal={subtotal}
              discount={discount}
              shipping={shipping}
              grandTotal={grandTotal}
              darkMode={darkMode}
              borderClass={borderClass}
              onCheckout={() => setStatusMessage('Checkout is not available yet.')}
            />
          </div>
        )}

        {statusMessage && (
          <p
            className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-4 text-center`}
            role="status"
            aria-live="polite"
          >
            {statusMessage}
          </p>
        )}
      </div>
    </section>
  );
}
