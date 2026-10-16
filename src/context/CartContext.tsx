import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import api from '../utils/api';
import { CartItem, PriceSummary, Product } from '../types';

interface CartContextValue {
  items: CartItem[];
  summary: PriceSummary;
  couponCode: string;
  addItem: (product: Product, size: string, quantity?: number) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  removeItem: (productId: string, size: string) => void;
  applyCoupon: (code: string) => void;
  clearCoupon: () => void;
  clearCart: () => void;
  itemCount: number;
}

const EMPTY_SUMMARY: PriceSummary = {
  subtotal: 0,
  discount: 0,
  shipping: 0,
  total: 0,
  couponCode: null,
  couponApplied: false,
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'waracle_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const [couponCode, setCouponCode] = useState('');
  const [summary, setSummary] = useState<PriceSummary>(EMPTY_SUMMARY);

  // Persist cart to localStorage.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Whenever the cart or coupon changes, ask the backend for the authoritative
  // price breakdown. 
  useEffect(() => {
    if (items.length === 0) {
      setSummary(EMPTY_SUMMARY);
      return;
    }
    const payload = {
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      couponCode: couponCode || undefined,
    };
    api
      .post('/cart/summary', payload)
      .then((res) => setSummary(res.data))
      .catch(() => setSummary(EMPTY_SUMMARY));
  }, [items, couponCode]);

  const addItem = useCallback((product: Product, size: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id && i.size === size);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id && i.size === size
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size,
          quantity,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, size: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.productId === productId && i.size === size ? { ...i, quantity } : i))
    );
  }, []);

  const removeItem = useCallback((productId: string, size: string) => {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.size === size)));
  }, []);

  const applyCoupon = useCallback((code: string) => setCouponCode(code.trim()), []);
  const clearCoupon = useCallback(() => setCouponCode(''), []);
  const clearCart = useCallback(() => {
    setItems([]);
    setCouponCode('');
  }, []);

  const itemCount = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        summary,
        couponCode,
        addItem,
        updateQuantity,
        removeItem,
        applyCoupon,
        clearCoupon,
        clearCart,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
