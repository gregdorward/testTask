import { Link } from 'react-router-dom';
import Logo from '../common/Logo';

const TAGLINE = 'Digital products trusted by millions of people';

const columns = [
  { title: 'Shop', links: [['Men', '/products?gender=Men'], ['Women', '/products?gender=Women'], ['Accessories', '/products?category=Accessories']] },
  { title: 'Support', links: [['About Us', '/about']] },
];

const values = ['Raise The Bar', 'Bring Others With You', 'Make It Count', 'Work In The Open', 'Enjoy The Journey'];

export default function Footer() {
  return (
    <footer className="bg-obsidian text-white/60">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.6fr_repeat(3,1fr)]">
          <div>
            <Logo variant="light" />
            <p className="mt-4 max-w-xs text-sm text-white/70">{TAGLINE}</p>
            <ul className="mt-5 space-y-1.5 text-xs text-white/45">
              {values.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-sm font-semibold text-white">{col.title}</h4>
              <ul className="space-y-2 text-sm">
                {col.links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="transition hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Waracle. All rights reserved.</span>
          <div className="flex gap-3">
            {['X', 'in', 'gh'].map((s) => (
              <span
                key={s}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-xs font-semibold transition hover:border-white hover:text-white"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
