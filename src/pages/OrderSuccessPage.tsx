import { useLocation, useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { Order } from '../types';
import { gbp, formatDate } from '../utils/format';
import Spinner from '../components/common/Spinner';

export default function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const stateOrder = (location.state as { order?: Order })?.order;

  const { data, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const res = await api.get(`/orders/${id}`);
      return res.data.order as Order;
    },
    initialData: stateOrder,
    enabled: !!id && !stateOrder,
  });

  if (isLoading) return <Spinner label="Confirming your order…" />;
  const order = data;
  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Order not found</h1>
        <Link to="/products" className="btn-accent mt-6">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 animate-fade-in">
        <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="mt-6 text-3xl font-bold tracking-tight">Thank you for your order!</h1>
      <p className="mt-2 text-gray-600">Your order has been placed successfully.</p>
      <p className="text-sm text-gray-500">
        A confirmation email has been sent to {order.customer.email}.
      </p>

      <div className="card mt-8 p-6 text-left">
        <div className="grid grid-cols-3 gap-4 text-center">
          <Detail label="Order Number" value={`#${order.orderNumber}`} />
          <Detail label="Order Date" value={formatDate(order.createdAt)} />
          <Detail label="Total Paid" value={gbp(order.total)} />
        </div>

        <div className="mt-6 divide-y divide-gray-100 border-t border-gray-100">
          {order.products.map((p, i) => (
            <div key={i} className="flex justify-between py-2 text-sm">
              <span>{p.name} × {p.quantity}{p.size ? ` (${p.size})` : ''}</span>
              <span>{gbp(p.price * p.quantity)}</span>
            </div>
          ))}
          {order.discount > 0 && (
            <div className="flex justify-between py-2 text-sm text-obsidian">
              <span>Coupon ({order.couponCode})</span>
              <span>–{gbp(order.discount)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <button onClick={() => navigate('/products')} className="btn-dark">Continue Shopping</button>
        <Link to="/products" className="btn-outline">Order Details</Link>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
