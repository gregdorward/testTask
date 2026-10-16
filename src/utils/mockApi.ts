/**
 * Local, in-browser API (used when VITE_API_URL is not set).
 *
 * The app is fully standalone: instead of calling a remote server, this module
 * mimics the small slice of the axios interface the app uses (`get` / `post`)
 * and resolves requests against an in-memory store. A short delay is added so
 * loading spinners behave as they would against a real network.
 *
 * Swapping back to a real backend later is a one-file change: point these
 * methods at axios and the rest of the app is unaffected.
 */
import { products } from '../data/products';
import { calculateTotals } from '../services/pricing';
import { Order, OrderLine, Product, User } from '../types';
// @ts-ignore
import bcrypt from 'bcryptjs';

interface StoredUser extends User {
  password: string;
}

// ---- in-memory store -------------------------------------------------------
const users: StoredUser[] = [
  {
    id: 'u-demo',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: bcrypt.hashSync('Password123', 10),
    role: 'customer',
    createdAt: new Date().toISOString(),
  },
];
const orders: Order[] = [];
let orderCounter = 123;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const delay = (ms = 220) => new Promise((r) => setTimeout(r, ms));

// axios-style error so pages reading err.response.data.message keep working
function apiError(status: number, message: string) {
  return { response: { status, data: { message } } };
}

function publicUser(u: StoredUser): User {
  const { password, ...rest } = u;
  return rest;
}

function tokenFor(u: StoredUser) {
  return `mock-token.${u.id}`;
}

function currentUser(): StoredUser | null {
  const token = localStorage.getItem('waracle_token');
  if (!token) return null;
  const id = token.split('.')[1];
  return users.find((u) => u.id === id) || null;
}

// ---- handlers --------------------------------------------------------------
function listProducts(params: Record<string, any> = {}) {
  let items = [...products];
  const { category, gender, minPrice, maxPrice, search, sort } = params;

  if (category && category !== 'All') items = items.filter((p) => p.category === category);
  if (gender && gender !== 'All') items = items.filter((p) => p.gender === gender);
  if (minPrice !== undefined) items = items.filter((p) => p.price >= Number(minPrice));
  if (maxPrice !== undefined) items = items.filter((p) => p.price <= Number(maxPrice));
  if (search) {
    const q = String(search).toLowerCase();
    items = items.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

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

  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.max(1, Number(params.limit) || items.length || 1);
  const start = (page - 1) * limit;
  return { total: items.length, page, limit, products: items.slice(start, start + limit) };
}

function getProduct(id: string): Product {
  const product = products.find((p) => p.id === id);
  if (!product) throw apiError(404, 'Product not found.');
  return product;
}

function getSuggestions(id: string) {
  const product = getProduct(id);
  const score = (p: Product) =>
    (p.category === product.category ? 2 : 0) + (p.gender === product.gender ? 1 : 0);
  const related = products
    .filter((p) => p.id !== product.id)
    .sort((a, b) => score(b) - score(a))
    .slice(0, 4);
  return { products: related };
}

function cartSummary(body: any) {
  const { items = [], couponCode } = body || {};
  const resolved = items.map((line: any) => {
    const product = getProduct(line.productId);
    const quantity = Math.max(1, Number(line.quantity) || 1);
    return { productId: product.id, name: product.name, price: product.price, quantity };
  });
  const totals = calculateTotals(resolved, couponCode);
  const couponApplied = !!couponCode && totals.discount > 0;
  return { items: resolved, couponCode: couponApplied ? couponCode : null, couponApplied, ...totals };
}

function register(body: any) {
  const { firstName, lastName, email, password, confirmPassword } = body || {};
  if (!firstName || !lastName || !email || !password) throw apiError(400, 'All fields are required.');
  if (!EMAIL_RE.test(email)) throw apiError(400, 'Please enter a valid email address.');
  if (password.length < 8) throw apiError(400, 'Password must be at least 8 characters.');
  if (confirmPassword !== undefined && password !== confirmPassword)
    throw apiError(400, 'Passwords do not match.');
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase()))
    throw apiError(409, 'An account with that email already exists.');

  const user: StoredUser = {
    id: `u-${Date.now()}`,
    firstName,
    lastName,
    email,
    password: bcrypt.hashSync(password, 10),
    role: 'customer',
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  return { token: tokenFor(user), user: publicUser(user) };
}

function login(body: any) {
  const { email, password } = body || {};
  if (!email || !password) throw apiError(400, 'Email and password are required.');
  const user = users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.password)) throw apiError(401, 'Incorrect email or password.');
  return { token: tokenFor(user), user: publicUser(user) };
}

function me() {
  const user = currentUser();
  if (!user) throw apiError(401, 'Authentication required.');
  return { user: publicUser(user) };
}

function createOrder(body: any) {
  const user = currentUser();
  if (!user) throw apiError(401, 'Authentication required.');

  const { items = [], couponCode, customer, shipping } = body || {};
  if (!Array.isArray(items) || items.length === 0)
    throw apiError(400, 'Your order must contain at least one item.');
  if (!customer?.name || !customer?.email) throw apiError(400, 'Customer name and email are required.');
  if (!shipping?.address || !shipping?.city || !shipping?.postcode)
    throw apiError(400, 'A complete shipping address is required.');

  const resolved: OrderLine[] = items.map((line: any) => {
    const product = getProduct(line.productId);
    return {
      productId: product.id,
      name: product.name,
      price: product.price,
      size: line.size || null,
      quantity: Math.max(1, Number(line.quantity) || 1),
    };
  });

  const totals = calculateTotals(resolved, couponCode);
  const order: Order = {
    id: `o-${Date.now()}`,
    orderNumber: `WS-2024-${String(++orderCounter).padStart(6, '0')}`,
    userId: user.id,
    products: resolved,
    customer,
    shipping,
    couponCode: couponCode && totals.discount > 0 ? couponCode : null,
    subtotal: totals.subtotal,
    discount: totals.discount,
    shipping_cost: totals.shipping,
    total: totals.total,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  return { order };
}

function getOrder(idOrNumber: string) {
  const user = currentUser();
  if (!user) throw apiError(401, 'Authentication required.');
  const order = orders.find((o) => o.id === idOrNumber || o.orderNumber === idOrNumber);
  if (!order) throw apiError(404, 'Order not found.');
  if (order.userId !== user.id) throw apiError(403, 'You do not have access to this order.');
  return { order };
}

// ---- router ----------------------------------------------------------------
const api = {
  async get(url: string, config?: { params?: Record<string, any> }) {
    await delay();
    if (url === '/products') return { data: listProducts(config?.params) };
    const suggMatch = url.match(/^\/products\/(.+)\/suggestions$/);
    if (suggMatch) return { data: getSuggestions(suggMatch[1]) };
    const prodMatch = url.match(/^\/products\/(.+)$/);
    if (prodMatch) return { data: { product: getProduct(prodMatch[1]) } };
    if (url === '/auth/me') return { data: me() };
    const orderMatch = url.match(/^\/orders\/(.+)$/);
    if (orderMatch) return { data: getOrder(orderMatch[1]) };
    throw apiError(404, `No handler for GET ${url}`);
  },

  async post(url: string, body?: any) {
    await delay();
    if (url === '/auth/register') return { data: register(body) };
    if (url === '/auth/login') return { data: login(body) };
    if (url === '/cart/summary') return { data: cartSummary(body) };
    if (url === '/orders') return { data: createOrder(body) };
    throw apiError(404, `No handler for POST ${url}`);
  },
};

export default api;
