export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  gender: 'Men' | 'Women' | 'Unisex';
  image: string;
  price: number;
  sizes: string[];
  stock: number;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

export interface PriceSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode: string | null;
  couponApplied: boolean;
}

export interface OrderLine {
  productId: string;
  name: string;
  price: number;
  size: string | null;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  products: OrderLine[];
  customer: { name: string; email: string; phone?: string };
  shipping: { address: string; city: string; postcode: string; country: string };
  couponCode: string | null;
  subtotal: number;
  discount: number;
  shipping_cost: number;
  total: number;
  status: string;
  createdAt: string;
}
