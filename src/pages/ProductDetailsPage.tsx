import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { Product } from '../types';
import { gbp } from '../utils/format';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ProductImage from '../components/common/ProductImage';
import ProductCard from '../components/product/ProductCard';
import Spinner from '../components/common/Spinner';

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { notify } = useToast();
  const [size, setSize] = useState<string>('');
  const [qty, setQty] = useState(1);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await api.get(`/products/${id}`);
      const p = res.data.product as Product;
      setSize(p.sizes[0]);
      return p;
    },
  });

  const { data: suggestions } = useQuery({
    queryKey: ['suggestions', id],
    queryFn: async () => {
      const res = await api.get(`/products/${id}/suggestions`);
      return res.data.products as Product[];
    },
    enabled: !!id,
  });

  if (isLoading || !product) return <Spinner label="Loading product…" />;

  const add = () => {
    addItem(product, size, qty);
    notify(`${product.name} added to cart`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav className="mb-6 text-sm text-gray-500">
        <Link to="/products" className="hover:text-ink">Products</Link> / {product.name}
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="space-y-4">
          <ProductImage image={product.image} className="aspect-square rounded-2xl" />
          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <ProductImage key={i} image={product.image} className="aspect-square rounded-xl opacity-70" />
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {product.gender} · {product.category}
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">{product.name}</h1>
          <p className="mt-3 text-2xl font-bold">{gbp(product.price)}</p>
          <p className="mt-5 text-gray-600">{product.description}</p>

          <div className="mt-7">
            <p className="label">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-[3rem] rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                    size === s ? 'border-ink bg-ink text-white' : 'border-gray-300 hover:border-ink'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="label">Quantity</p>
            <div className="inline-flex items-center rounded-lg border border-gray-300">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2.5 text-lg">–</button>
              <span className="w-10 text-center text-sm font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="px-4 py-2.5 text-lg">+</button>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button onClick={add} className="btn-accent flex-1">Add to Cart</button>
            <Link to="/cart" className="btn-outline">View Cart</Link>
          </div>

          <p className="mt-4 text-xs text-gray-400">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'} · Free returns within 30 days
          </p>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 text-2xl font-bold tracking-tight">You may also like</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {suggestions.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
