import { useEffect, useState } from 'react';
import type { CartItem } from '../../context/CartContext';

type CartItemsTableProps = {
  items: CartItem[];
  darkMode: boolean;
  borderClass: string;
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  onCouponSubmit: (couponCode: string) => void;
  onUpdate: () => void;
};

type QuantityInputProps = {
  item: CartItem;
  darkMode: boolean;
  borderClass: string;
  onQuantityChange: (productId: number, quantity: number) => void;
};

const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

function QuantityInput({ item, darkMode, borderClass, onQuantityChange }: QuantityInputProps) {
  const [value, setValue] = useState(String(item.quantity));

  useEffect(() => {
    setValue(String(item.quantity));
  }, [item.quantity]);

  return (
    <input
      type="number"
      min="1"
      step="1"
      value={value}
      onChange={(event) => {
        const nextValue = event.target.value;
        const quantity = Number(nextValue);
        setValue(nextValue);
        if (nextValue.trim() && Number.isInteger(quantity) && quantity > 0) {
          onQuantityChange(item.productId, quantity);
        }
      }}
      onBlur={() => {
        const quantity = Number(value);
        if (value.trim() && Number.isInteger(quantity) && quantity > 0) {
          onQuantityChange(item.productId, quantity);
        } else {
          setValue(String(item.quantity));
        }
      }}
      aria-label={`Quantity for ${item.name}`}
      className={`w-16 rounded-lg border ${borderClass} ${darkMode ? 'bg-gray-900 text-light' : 'bg-white text-gray-800'} px-2 py-2 text-center`}
    />
  );
}

export default function CartItemsTable({
  items,
  darkMode,
  borderClass,
  onQuantityChange,
  onRemove,
  onCouponSubmit,
  onUpdate,
}: CartItemsTableProps) {
  const [couponCode, setCouponCode] = useState('');

  return (
    <div className={`${darkMode ? 'bg-gray-800 text-light' : 'bg-white text-gray-800'} overflow-hidden rounded-xl shadow-lg`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-center">
          <thead>
            <tr className={darkMode ? 'bg-gray-900/60' : 'bg-gray-100'}>
              {['S. No.', 'Product Image', 'Product Name', 'Unit Price', 'Quantity', 'Total', 'Remove'].map(
                (heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className={`border-b ${borderClass} px-4 py-4 text-sm font-semibold sm:text-base`}
                  >
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const unitPrice = item.price * (1 - (item.discount ?? 0));
              return (
                <tr key={item.productId} className={`border-b ${borderClass} last:border-0`}>
                  <td className="px-4 py-5 font-semibold">{index + 1}</td>
                  <td className="px-4 py-2">
                    <img
                      src={`/${item.imgName}`}
                      alt={item.name}
                      className="mx-auto h-20 w-24 object-contain"
                    />
                  </td>
                  <th scope="row" className="px-4 py-5 font-semibold">
                    {item.name}
                  </th>
                  <td className="px-4 py-5 font-semibold">{formatCurrency(unitPrice)}</td>
                  <td className="px-4 py-5">
                    <QuantityInput
                      item={item}
                      darkMode={darkMode}
                      borderClass={borderClass}
                      onQuantityChange={onQuantityChange}
                    />
                  </td>
                  <td className="px-4 py-5 font-semibold">
                    {formatCurrency(unitPrice * item.quantity)}
                  </td>
                  <td className="px-4 py-5">
                    <button
                      type="button"
                      onClick={() => onRemove(item.productId)}
                      aria-label={`Remove ${item.name} from cart`}
                      className="rounded p-2 text-primary transition-colors hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <svg
                        aria-hidden="true"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M4 7h16M10 11v6m4-6v6M5.5 7l1 14h11l1-14M9 7V4h6v3" />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div
        className={`flex flex-col gap-4 border-t ${borderClass} p-4 sm:flex-row sm:items-center sm:justify-between`}
      >
        <form
          className={`flex max-w-xl overflow-hidden rounded-full border ${borderClass}`}
          onSubmit={(event) => {
            event.preventDefault();
            onCouponSubmit(couponCode);
          }}
        >
          <label className="sr-only" htmlFor="coupon-code">
            Coupon Code
          </label>
          <input
            id="coupon-code"
            value={couponCode}
            onChange={(event) => setCouponCode(event.target.value)}
            placeholder="Coupon Code"
            className={`${darkMode ? 'bg-gray-900 text-light placeholder:text-gray-500' : 'bg-gray-50 text-gray-800 placeholder:text-gray-400'} min-w-0 flex-1 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary`}
          />
          <button
            type="submit"
            className="whitespace-nowrap bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-accent"
          >
            Apply Coupon
          </button>
        </form>
        <button
          type="button"
          onClick={onUpdate}
          className="rounded-full bg-primary px-8 py-3 font-semibold text-white transition-colors hover:bg-accent"
        >
          Update Cart
        </button>
      </div>
    </div>
  );
}
