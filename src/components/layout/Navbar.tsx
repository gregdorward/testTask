import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Logo from '../common/Logo';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'Men', to: '/products?gender=Men' },
  { label: 'Women', to: '/products?gender=Women' },
  { label: 'Accessories', to: '/products?category=Accessories' },
];

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
   };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" aria-label="Waracle home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className="text-sm font-medium text-gray-600 transition hover:text-ink"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <form onSubmit={handleSearch} className="relative hidden sm:block">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalog..."
            aria-label="Search field"
            data-test-id="search-input"
            className="w-44 rounded-lg border border-gray-300 bg-gray-50 py-1.5 pl-9 pr-3 text-sm outline-none transition-all focus:w-60 focus:border-obsidian focus:bg-white"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ink"
          >
            <SearchIcon />
          </button>
        </form>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="hidden items-center gap-3 sm:flex">
              <span className="text-sm text-gray-600">Hi, {user.firstName}</span>
              <button onClick={logout} className="text-sm font-medium text-gray-500 hover:text-ink">
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              aria-label="Account"
              className="hidden text-gray-600 hover:text-ink sm:block"
            >
              <UserIcon />
            </button>
          )}

          <Link to="/cart" className="relative text-gray-600 hover:text-ink" aria-label="Cart">
            <CartIcon />
            {itemCount > 0 && (
              <span
                data-pw="cart-count"
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white"
              >
                {itemCount}
              </span>
            )}
          </Link>

          <button
            className="md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-gray-200 bg-white px-4 py-3 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm font-medium text-gray-700"
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <button onClick={logout} className="py-2 text-sm font-medium text-gray-500">
              Sign out
            </button>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-medium text-gray-700">
              Sign in
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}

const ic = 'h-5 w-5';
function SearchIcon() {
  return (
    <svg className={ic} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
    </svg>
  );
}
function CartIcon() {
  return (
    <svg className={ic} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.4l1.7 11.4a2 2 0 002 1.7h8.7a2 2 0 002-1.6l1.4-7.1H6" />
      <circle cx="9" cy="20" r="1.2" /><circle cx="17" cy="20" r="1.2" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg className={ic} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 8.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zM4.5 19.5a7.5 7.5 0 0115 0" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg className={ic} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
