import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { Product } from '../types';
import ProductCard from '../components/product/ProductCard';
import Spinner from '../components/common/Spinner';

const categories = ['All', 'T-Shirts', 'Shorts', 'Headsets', 'Accessories'];
const genders = ['Men', 'Women', 'Unisex'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const colors = [
  { key: 'black', label: 'Black', swatch: '#0a0a0a' },
  { key: 'white', label: 'White', swatch: '#ffffff' },
  { key: 'navy', label: 'Navy', swatch: '#1e293b' },
  { key: 'grey', label: 'Grey', swatch: '#b9bcc2' },
];

// Derive a colour for a product from its illustration key.
function colorOf(p: Product): string {
  if (p.image.includes('white')) return 'white';
  if (p.image.includes('grey')) return 'grey';
  return 'black';
}

function toggle<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export default function ProductsPage() {
  const [params] = useSearchParams();
  const [category, setCategory] = useState<string[]>([]);
  const [gender, setGender] = useState<string[]>([]);
  const [size, setSize] = useState<string[]>([]);
  const [color, setColor] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(100);
  const [sort, setSort] = useState('newest');

  // Keep the filters in sync with the URL. Each navbar link encodes the full
  // intended filter state, so a param that is absent must CLEAR that dimension —
  // otherwise switching (e.g. Accessories -> Women) leaves a stale category and
  // produces an impossible combination that shows no products.
  useEffect(() => {
    const g = params.get('gender');
    const c = params.get('category');
    setGender(g ? [g] : []);
    setCategory(c && c !== 'All' ? [c] : []);
  }, [params]);

  const { data: all, isLoading } = useQuery({
    queryKey: ['all-products'],
    queryFn: async () => {
      const res = await api.get('/products');
      return res.data.products as Product[];
    },
  });

  const filtered = useMemo(() => {
    let items = [...(all || [])];
    const cat = category.filter((c) => c !== 'All');
    if (cat.length) items = items.filter((p) => cat.includes(p.category));
    if (gender.length) items = items.filter((p) => gender.includes(p.gender));
    if (size.length) items = items.filter((p) => p.sizes.some((s) => size.includes(s)));
    if (color.length) items = items.filter((p) => color.includes(colorOf(p)));
    items = items.filter((p) => p.price <= maxPrice);

    switch (sort) {
      case 'price_asc':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        items.sort((a, b) => b.price - a.price);
        break;
      default:
        items.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    }
    return items;
  }, [all, category, gender, size, color, maxPrice, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[230px_1fr]">
        {/* Filters */}
        <aside className="space-y-7">
          <h2 className="text-lg font-bold">Filters</h2>

          <Group title="Category">
            {categories.map((c) => (
              <Check
                key={c}
                label={c}
                checked={c === 'All' ? category.length === 0 : category.includes(c)}
                onChange={() => setCategory(c === 'All' ? [] : toggle(category, c))}
              />
            ))}
          </Group>

          <Group title="Gender">
            {genders.map((g) => (
              <Check key={g} label={g} checked={gender.includes(g)} onChange={() => setGender(toggle(gender, g))} />
            ))}
          </Group>

          <Group title="Size">
            {sizes.map((s) => (
              <Check key={s} label={s} checked={size.includes(s)} onChange={() => setSize(toggle(size, s))} />
            ))}
          </Group>

          <Group title="Colour">
            <div className="flex gap-2.5 pt-1">
              {colors.map((c) => {
                const active = color.includes(c.key);
                return (
                  <button
                    key={c.key}
                    onClick={() => setColor(toggle(color, c.key))}
                    aria-label={c.label}
                    className={`h-7 w-7 rounded-full border transition ${
                      active ? 'ring-2 ring-ink ring-offset-2' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: c.swatch }}
                  />
                );
              })}
            </div>
          </Group>

          <Group title="Price">
            <input
              type="range"
              min={0}
              max={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-ink"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>£0</span>
              <span>£{maxPrice}</span>
            </div>
          </Group>
        </aside>

        {/* Results */}
        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">All Products</h1>
              <p className="text-sm text-gray-500">
                {all ? `Showing ${filtered.length} of ${all.length} products` : ' '}
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-ink"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
              </select>
            </label>
          </div>

          {isLoading ? (
            <Spinner />
          ) : filtered.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="card flex flex-col items-center gap-2 py-20 text-center">
              <p className="text-lg font-semibold">No products match your filters</p>
              <p className="text-sm text-gray-500">Try widening your price range or clearing a filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-700">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 rounded accent-ink" />
      {label}
    </label>
  );
}
