# Waracle Store — Web UI

A modern, responsive e-commerce front end built with React, TypeScript, Vite and Tailwind CSS.
**Think. Create. Deliver. Together.**

This is a **standalone web app**: the product catalogue, authentication and pricing all run in the
browser via a small in-memory data layer, so there is **no backend to start**. Run one command and
the full shopping flow works end to end.

## Requirements

- Node.js 18 or newer (includes npm)

## Run locally — step by step

1. Open a terminal in this folder (the one containing `package.json`).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. It opens **http://localhost:5173** automatically. If not, open that URL in your browser.

To stop the server, press `Ctrl + C`. To build a production bundle:
```bash
npm run build      # output in dist/
npm run preview    # serve the built bundle locally
```

## Demo login

A demo account is preloaded:

```
Email:    john.doe@example.com
Password: Password123
```

You can also register a new account from the Sign up link — it is stored in memory for the session.

## What you can do

- Browse the home page (hero, values, featured products) and the About page
- Filter and sort the product listing (category, gender, price, newest / price)
- Open a product, pick a size and quantity, see suggested products, add to cart
- Update quantities and remove items in the cart, apply the `Waracle25` coupon
- Complete the four-step checkout (information, shipping, payment, review) and see the order
  confirmation

Everything resets when you refresh, because the data lives in memory (the cart is kept in
`localStorage` so it survives a refresh).

## Brand values

The site showcases the five Waracle values: Raise the bar, Bring others with you, Make it count,
Work in the open, and Enjoy the journey. They appear in the login/registration panel, the home page
values section, the About page and the footer.

## Project structure

```
src/
├── main.tsx                 # entry point
├── App.tsx                  # routes + providers
├── index.css                # Tailwind + base styles
├── data/products.ts         # in-browser product catalogue
├── services/pricing.ts      # totals + coupon logic
├── utils/
│   ├── api.ts               # in-browser API (mimics axios get/post)
│   └── format.ts            # currency + date helpers
├── context/                 # Auth, Cart, Toast (Context API state management)
├── components/
│   ├── common/              # Logo, ProductImage (SVG art), Spinner
│   ├── layout/              # Navbar, Footer, BrandPanel, Layout, ProtectedRoute
│   └── product/             # ProductCard
└── pages/                   # Home, Products, ProductDetails, Cart, Checkout,
                             # OrderSuccess, About, Login, Register, NotFound
```

## Tech stack

React 18, TypeScript, Vite, React Router, Tailwind CSS, TanStack Query (React Query), and the
Context API for state. No external image or network dependencies — product art is inline SVG.

## Pointing at a real backend (optional)

The whole app talks to one module, `src/utils/api.ts`, through an axios-style `get` / `post`
interface. To use a real API instead of the in-browser one, replace that file with an axios
instance pointed at your server. No other file needs to change.