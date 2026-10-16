import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center">
      <p className="text-7xl font-extrabold tracking-tight text-ink">404</p>
      <span className="mt-2 h-1 w-12 rounded-full bg-accent" />
      <h1 className="mt-6 text-2xl font-bold">This page wandered off.</h1>
      <p className="mt-2 text-gray-500">
        The page you're looking for doesn't exist or has moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Link to="/" className="btn-dark">Back to home</Link>
        <Link to="/products" className="btn-outline">Shop products</Link>
      </div>
    </div>
  );
}
