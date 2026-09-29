type OrderSummaryProps = {
  subtotal: number;
  discount: number;
  shipping: number;
  grandTotal: number;
  darkMode: boolean;
  borderClass: string;
  onCheckout: () => void;
};

const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

export default function OrderSummary({
  subtotal,
  discount,
  shipping,
  grandTotal,
  darkMode,
  borderClass,
  onCheckout,
}: OrderSummaryProps) {
  return (
    <aside
      className={`${darkMode ? 'bg-gray-800 text-light' : 'bg-white text-gray-800'} overflow-hidden rounded-xl shadow-lg`}
    >
      <h2 className={`border-b ${borderClass} px-6 py-4 text-center text-2xl font-bold`}>
        Order Summary
      </h2>
      <dl>
        <div className={`flex justify-between border-b ${borderClass} px-6 py-3`}>
          <dt className="font-semibold">Subtotal</dt>
          <dd>{formatCurrency(subtotal)}</dd>
        </div>
        <div className={`flex justify-between border-b ${borderClass} px-6 py-3`}>
          <dt className="font-semibold">Discount (5%)</dt>
          <dd>-{formatCurrency(discount)}</dd>
        </div>
        <div className={`flex justify-between border-b ${borderClass} px-6 py-3`}>
          <dt className="font-semibold">Shipping</dt>
          <dd>{formatCurrency(shipping)}</dd>
        </div>
        <div className="flex justify-between px-6 py-3 font-bold">
          <dt>Grand Total</dt>
          <dd>{formatCurrency(grandTotal)}</dd>
        </div>
      </dl>
      <div className="p-5">
        <button
          type="button"
          onClick={onCheckout}
          className="w-full rounded-full bg-gradient-to-r from-primary to-lime-500 px-4 py-3 font-semibold text-white transition-opacity hover:opacity-90"
        >
          Proceed To Checkout
        </button>
      </div>
    </aside>
  );
}
