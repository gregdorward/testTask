import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { Layout, ProtectedRoute } from './components/layout/Layout';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <Routes>
                {/* Auth pages render without the main chrome (own split layout) */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Everything else uses the shared Navbar + Footer layout */}
                <Route
                  path="/"
                  element={
                    <Layout>
                      <HomePage />
                    </Layout>
                  }
                />
                <Route
                  path="/products"
                  element={
                    <Layout>
                      <ProductsPage />
                    </Layout>
                  }
                />
                <Route
                  path="/products/:id"
                  element={
                    <Layout>
                      <ProductDetailsPage />
                    </Layout>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <Layout>
                      <CartPage />
                    </Layout>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <Layout>
                      <AboutPage />
                    </Layout>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <CheckoutPage />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order-success/:id"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <OrderSuccessPage />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="*"
                  element={
                    <Layout>
                      <NotFoundPage />
                    </Layout>
                  }
                />
              </Routes>
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
