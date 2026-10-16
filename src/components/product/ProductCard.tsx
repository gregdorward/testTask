import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { gbp } from '../../utils/format';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import ProductImage from '../common/ProductImage';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { notify } = useToast();

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.sizes[0], 1);
    notify(`${product.name} added to cart`);
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:shadow-md"
      data-pw="product-card"
    >
      <div className="relative aspect-square overflow-hidden">
        <ProductImage
          image={product.image}
          className="h-full w-full transition-transform duration-300 group-hover:scale-105"
        />
        <button
          onClick={quickAdd}
          className="absolute bottom-3 left-3 right-3 translate-y-2 rounded-lg bg-accent py-2.5 text-sm font-semibold text-white opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
          data-pw="add-to-cart-button"
        >
          Add to cart
        </button>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-obsidian/40">
          {product.category}
        </span>
        <h3 className="mt-1 text-sm font-semibold leading-snug">{product.name}</h3>
        <p className="mt-2 text-sm font-bold">{gbp(product.price)}</p>
      </div>
    </Link>
  );
}
