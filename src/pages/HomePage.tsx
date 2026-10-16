import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { Product } from '../types';
import Logo from '../components/common/Logo';
import ProductCard from '../components/product/ProductCard';
import Spinner from '../components/common/Spinner';

const TAGLINE = 'Digital products trusted by millions of people';

const values = [
  { title: 'Raise The Bar', body: 'We see every opportunity as a chance to raise the bar, for our clients and for ourselves.' },
  { title: 'Bring Others With You', body: 'We succeed together, leading with empathy and helping the people around us grow.' },
  { title: 'Make It Count', body: 'We focus our energy on the work that delivers real, measurable impact.' },
  { title: 'Work In The Open', body: 'We stay transparent with each other and our partners, sharing progress as we go.' },
  { title: 'Enjoy The Journey', body: 'We care deeply about our craft and have a lot of fun building things worth being proud of.' },
];

export default function HomePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured'],
    queryFn: async () => {
      const res = await api.get('/products', { params: { sort: 'newest', limit: 4 } });
      return res.data.products as Product[];
    },
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-obsidian text-white">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
          <Logo variant="light" />
          <h1 className="mt-8 max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">
            {TAGLINE}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/70">
            Official Waracle apparel and gear, for the people who design and engineer the products
            millions rely on.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/products" className="btn-accent">Shop Now</Link>
            <Link to="/about" className="btn-outline border-white/30 bg-transparent text-white hover:border-white">
              Our Story
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-clay/10 blur-3xl" />
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <p className="eyebrow">Our Values</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">What we stand for</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {values.map((v, i) => (
            <div key={v.title} className="card p-6 transition hover:shadow-md">
              <span className="text-sm font-bold text-obsidian/40">0{i + 1}</span>
              <h3 className="mt-3 text-lg font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-obsidian/60">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Marketing banner */}
      <section className="bg-clay">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {TAGLINE}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-obsidian/70">
            Every piece in the collection is made with the same care we bring to the digital products
            we design and engineer for our clients.
          </p>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="eyebrow">Featured</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">New in</h2>
          </div>
          <Link to="/products" className="text-sm font-semibold text-obsidian hover:opacity-70">
            View all →
          </Link>
        </div>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {data?.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}
