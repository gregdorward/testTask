import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { gbp } from '../utils/format';

const steps = ['Information', 'Shipping', 'Payment', 'Review'];

export default function CheckoutPage() {
  const { items, summary, couponCode, clearCart } = useCart();
  const { user } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({
    email: user?.email || '',
    name: user ? `${user.firstName} ${user.lastName}` : '',
    phone: '',
    address: '',
    city: '',
    postcode: '',
    country: 'United Kingdom',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Nothing to check out</h1>
        <p className="mt-2 text-gray-500">Add something to your cart first.</p>
        <button onClick={() => navigate('/products')} className="btn-accent mt-6">Shop products</button>
      </div>
    );
  }

  const ready =
    !!form.email &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    !!form.name &&
    !!form.address &&
    !!form.city &&
    !!form.postcode &&
    form.cardNumber.replace(/\s/g, '').length >= 12 &&
    !!form.expiry &&
    form.cvc.length >= 3;

  const placeOrder = async () => {
    if (!ready) {
      notify('Please complete all fields', 'error');
      return;
    }
    setPlacing(true);
    try {
      const res = await api.post('/orders', {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, size: i.size })),
        couponCode: couponCode || undefined,
        customer: { name: form.name, email: form.email, phone: form.phone },
        shipping: { address: form.address, city: form.city, postcode: form.postcode, country: form.country },
      });
      const order = res.data.order;
      clearCart();
      navigate(`/order-success/${order.id}`, { state: { order } });
    } catch (err: any) {
      notify(err?.response?.data?.message || 'Could not place order', 'error');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Step indicator */}
      <div className="mb-10 flex items-center justify-between">
        {steps.map((label, i) => (
          <div key={label} className="flex flex-1 items-center">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  i === 0 ? 'bg-ink text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {i + 1}
              </span>
              <span className={`hidden text-sm font-medium sm:block ${i === 0 ? 'text-ink' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && <div className="mx-3 h-px flex-1 bg-gray-200" />}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Column 1: Contact + Shipping */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="mb-5 text-lg font-bold">Contact Information</h2>
            <div className="space-y-4">
              <Field label="Email" data-pw="email-field" type="email" value={form.email} onChange={set('email')} placeholder="john.doe@example.com" />
              <Field label="Full Name" data-pw="full-name-field" value={form.name} onChange={set('name')} placeholder="John Doe" />
            </div>
          </div>

          <div className="card p-6">
            <h2 className="mb-5 text-lg font-bold">Shipping Address</h2>
            <div className="space-y-4">
              <Field label="Address" data-pw="address-line-1-field" value={form.address} onChange={set('address')} placeholder="10 Digital Drive" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="City" data-pw="city-field" value={form.city} onChange={set('city')} placeholder="Edinburgh" />
                <Field label="Postcode" data-pw="postcode-field" value={form.postcode} onChange={set('postcode')} placeholder="EH1 1AA" />
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Order Summary */}
        <div className="card h-fit p-6">
          <h2 className="mb-5 text-lg font-bold">Order Summary</h2>
          <div className="space-y-3">
            {items.map((i) => (
              <div key={`${i.productId}-${i.size}`} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {i.name}
                  {i.quantity > 1 && <span className="text-gray-400"> × {i.quantity}</span>}
                </span>
                <span className="font-medium">{gbp(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2.5 border-t border-gray-200 pt-4 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{gbp(summary.subtotal)}</span>
            </div>
            {summary.discount > 0 && (
              <div className="flex justify-between text-obsidian">
                <span>Coupon ({summary.couponCode})</span>
                <span>−{gbp(summary.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{gbp(summary.shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold">
              <span>Total</span>
              <span>{gbp(summary.total)}</span>
            </div>
          </div>
        </div>

        {/* Column 3: Payment */}
        <div className="card h-fit p-6">
          <h2 className="mb-5 text-lg font-bold">Payment</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Card Number</label>
              <div className="relative">
                <input value={form.cardNumber} data-pw="card-number-field" onChange={set('cardNumber')} placeholder="4242 4242 4242 4242" className="field pr-14" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold italic text-blue-700">VISA</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Expiry Date" data-pw="expiry-date-field" value={form.expiry} onChange={set('expiry')} placeholder="12 / 26" />
              <Field label="CVC" data-pw="cvc-field" value={form.cvc} onChange={set('cvc')} placeholder="123" />
            </div>
            <button onClick={placeOrder} data-pw="place-order-button" disabled={placing} className="btn-accent w-full">
              {placing ? 'Processing…' : `Pay ${gbp(summary.total)}`}
            </button>
            <p className="text-center text-xs leading-relaxed text-gray-400">
              By placing your order, you agree to our Terms &amp; Conditions and Privacy Policy. This is a
              mock payment form; no card is charged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  'data-pw': dataPw,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  'data-pw'?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input type={type} data-pw={dataPw} value={value} onChange={onChange} placeholder={placeholder} className="field" />
    </div>
  );
}
