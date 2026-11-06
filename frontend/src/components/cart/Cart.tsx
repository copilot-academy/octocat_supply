import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { cartTotals, formatCurrency, unitPriceCents } from './cartTotals';

export default function Cart() {
  const { items, removeItem, updateQuantities } = useCart();
  const { darkMode } = useTheme();
  const [draftQuantities, setDraftQuantities] = useState<Record<number, string>>({});
  const [message, setMessage] = useState('');
  const totals = cartTotals(items);
  const panel = darkMode ? 'bg-[#1d2323] border-white/10' : 'bg-white border-gray-200';
  const cell = 'border border-gray-500/20 px-4 py-4 text-center';
  const button = 'rounded-full bg-gradient-to-r from-[#4a8c2b] to-[#a6bd38] px-6 py-3 font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary';

  const updateCart = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const quantities = Object.fromEntries(items.map((item) => [
      item.product.productId,
      Number(draftQuantities[item.product.productId] ?? item.quantity),
    ]));
    if (Object.values(quantities).some((quantity) => !Number.isSafeInteger(quantity) || quantity < 1)) {
      setMessage('Enter a positive whole number for every quantity.');
      return;
    }
    updateQuantities(quantities);
    setDraftQuantities({});
    setMessage('Cart updated.');
  };

  return (
    <div className={`min-h-screen pt-24 pb-16 px-4 ${darkMode ? 'text-light bg-gradient-to-br from-dark to-[#192014]' : 'text-gray-800'}`}>
      <div className="max-w-[1500px] mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <Link to="/products" className="underline underline-offset-4 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">Continue shopping</Link>
        </div>
        {items.length === 0 ? (
          <div className={`rounded-xl border p-10 text-center ${panel}`}>
            <p className="text-xl mb-6" role="status">Your cart is empty.</p>
            <Link to="/products" className={button}>Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,3fr)_minmax(300px,1fr)] gap-6 items-start">
            <form onSubmit={updateCart} className={`rounded-xl border overflow-hidden ${panel}`}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse font-semibold">
                  <caption className="sr-only">Products in your shopping cart</caption>
                  <thead>
                    <tr>
                      {['S. No.', 'Product Image', 'Product Name', 'Unit Price', 'Quantity', 'Total', 'Remove'].map((heading) => (
                        <th key={heading} scope="col" className={cell}>{heading}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(({ product, quantity }, index) => (
                      <tr key={product.productId}>
                        <td className={cell}>{index + 1}</td>
                        <td className={cell}>
                          <img src={`/${product.imgName}`} alt={product.name} width={96} height={80} className="h-20 w-24 object-contain mx-auto" />
                        </td>
                        <th scope="row" className={cell}>{product.name}</th>
                        <td className={cell}>{formatCurrency(unitPriceCents(product) / 100)}</td>
                        <td className={cell}>
                          <input
                            type="number" min="1" max={Number.MAX_SAFE_INTEGER} step="1" required
                            aria-label={`Quantity of ${product.name}`}
                            value={draftQuantities[product.productId] ?? quantity}
                            onChange={(event) => {
                              setDraftQuantities((current) => ({ ...current, [product.productId]: event.target.value }));
                              setMessage('');
                            }}
                            className="w-16 rounded-xl border-2 border-gray-500/30 bg-transparent px-2 py-2 text-center focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </td>
                        <td className={cell}>{formatCurrency(unitPriceCents(product) * quantity / 100)}</td>
                        <td className={cell}>
                          <button type="button" aria-label={`Remove ${product.name}`} onClick={() => {
                            removeItem(product.productId);
                            setDraftQuantities((current) => {
                              const next = { ...current };
                              delete next[product.productId];
                              return next;
                            });
                            setMessage(`${product.name} removed.`);
                          }} className="p-2 text-[#9cb631] hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 p-3">
                <p className="text-sm">5% discount applied automatically. No coupon needed.</p>
                <button type="submit" className={button}>Update Cart</button>
              </div>
            </form>
            <aside aria-labelledby="order-summary" className={`rounded-xl border overflow-hidden ${panel}`}>
              <h2 id="order-summary" className="text-2xl font-bold text-center p-4">Order Summary</h2>
              <dl>
                {([
                  ['Subtotal', totals.subtotal],
                  ['Discount (5%)', -totals.discount],
                  ['Shipping', totals.shipping],
                  ['Grand Total', totals.grandTotal],
                ] as const).map(([label, cents]) => (
                  <div key={label} className="grid grid-cols-[1.6fr_1fr] border-t border-gray-500/20">
                    <dt className="font-semibold text-center px-3 py-3">{label}</dt>
                    <dd className="border-l border-gray-500/20 text-center px-3 py-3" data-testid={label}>{formatCurrency(cents / 100)}</dd>
                  </div>
                ))}
              </dl>
              <div className="p-5">
                <button type="button" disabled className={`${button} w-full opacity-60 cursor-not-allowed`}>Checkout unavailable</button>
                <p className="text-sm text-center mt-3">Checkout is not available in this demo.</p>
              </div>
            </aside>
          </div>
        )}
        <p role="status" aria-live="polite" className="mt-4">{message}</p>
      </div>
    </div>
  );
}
