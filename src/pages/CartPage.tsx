import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { gbp } from '../utils/format';
import ProductImage from '../components/common/ProductImage';

export default function CartPage() {
  const { items, summary, updateQuantity, removeItem, applyCoupon, clearCoupon, couponCode } = useCart();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [code, setCode] = useState(couponCode);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-clay">
          <svg className="h-9 w-9 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.4l1.7 11.4a2 2 0 002 1.7h8.7a2 2 0 002-1.6l1.4-7.1H6" />
            <circle cx="9" cy="20" r="1.2" /><circle cx="17" cy="20" r="1.2" />
          </svg>
        </div>
        <h1 className="mt-6 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-gray-500">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn-accent mt-6">Start Shopping</Link>
      </div>
    );
  }

  const handleCoupon = () => {
    if (!code.trim()) {
      clearCoupon();
      return;
    }
    applyCoupon(code);
    notify(code.trim().toUpperCase() === 'WARACLE25' ? 'Coupon applied' : 'Coupon entered', 'info');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={`${item.productId}-${item.size}`} className="card flex gap-4 p-4">
              <ProductImage image={item.image} className="h-24 w-24 shrink-0 rounded-xl" />
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.size)}
                    className="text-sm text-gray-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="inline-flex items-center rounded-lg border border-gray-300">
                    <button onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)} className="px-3 py-1.5">–</button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)} className="px-3 py-1.5">+</button>
                  </div>
                  <span className="font-semibold">{gbp(item.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="card h-fit p-6">
          <h2 className="text-lg font-bold" data-pw="order-summary-title">Order Summary</h2>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium" data-pw="coupon-code-label">Coupon code</span>
            </div>
            <div className="flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. WARACLE25"
                data-pw="coupon-code-input"
                className="field"
              />
              <button onClick={handleCoupon} className="btn-outline whitespace-nowrap">Apply</button>
            </div>
            {summary.couponApplied && (
              <p className="text-xs text-obsidian" data-pw="coupon-applied-message">Coupon “{summary.couponCode}” applied</p>
            )}
          </div>

          <div className="mt-6 space-y-3 border-t border-gray-200 pt-4 text-sm">
            <Row label="Subtotal" value={gbp(summary.subtotal)} />
            {summary.discount > 0 && (
              <Row label={`Coupon (${summary.couponCode})`} value={`–${gbp(summary.discount)}`} accent />
            )}
            <Row label="Shipping" value={gbp(summary.shipping)} />
            <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold">
              <span>Total</span>
              <span data-pw="order-total">{gbp(summary.total)}</span>
            </div>
          </div>

          <button onClick={() => navigate('/checkout')} className="btn-accent mt-6 w-full">
            Proceed to Checkout
          </button>
          <Link to="/products" className="mt-3 block text-center text-sm text-gray-500 hover:text-ink">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`flex justify-between ${accent ? 'text-obsidian' : 'text-gray-600'}`}>
      <span>{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
