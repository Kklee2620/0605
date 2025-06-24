import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { SearchProvider } from './contexts/SearchContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { AdminLayout } from './layouts/AdminLayout';
import ErrorBoundary from './components/ErrorBoundary'; // Import ErrorBoundary
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AccountPage } from './pages/AccountPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CategoryPage } from './pages/CategoryPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { ReturnPolicyPage } from './pages/ReturnPolicyPage';
import { ShippingPolicyPage } from './pages/ShippingPolicyPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { RoutePath } from './constants';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsListPage from './pages/admin/AdminProductsListPage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';
import AdminOrdersListPage from './pages/admin/AdminOrdersListPage';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';
import AdminUsersListPage from './pages/admin/AdminUsersListPage'; 


const isAdminRoute = (pathname: string) => pathname.startsWith('/admin');

const AppContentWrapper: React.FC = () => {
  const location = useLocation(); // Use useLocation hook here
  const showHeaderFooter = !isAdminRoute(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {showHeaderFooter && <Header />}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path={RoutePath.Home} element={<HomePage />} />
          <Route path={RoutePath.ProductDetail} element={<ProductDetailPage />} />
          <Route path={RoutePath.CategoryPage} element={<CategoryPage />} />
          <Route path={RoutePath.Cart} element={<CartPage />} />
          <Route path={RoutePath.Login} element={<LoginPage />} />
          <Route path={RoutePath.Register} element={<RegisterPage />} />
          <Route path={RoutePath.About} element={<AboutPage />} />
          <Route path={RoutePath.Contact} element={<ContactPage />} />
          <Route path={RoutePath.PrivacyPolicy} element={<PrivacyPolicyPage />} />
          <Route path={RoutePath.ReturnPolicy} element={<ReturnPolicyPage />} />
          <Route path={RoutePath.ShippingPolicy} element={<ShippingPolicyPage />} />
          <Route path={RoutePath.SearchResultsPage} element={<SearchResultsPage />} />
          
          {/* Protected Routes (User) */}
          <Route 
            path={RoutePath.Account} 
            element={<ProtectedRoute><AccountPage /></ProtectedRoute>} 
          />
          <Route 
            path={RoutePath.Checkout} 
            element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} 
          />
          <Route 
            path={RoutePath.OrderConfirmation} 
            element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} 
          />

          {/* Admin Routes */}
          <Route path={RoutePath.AdminDashboard} element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsListPage />} />
            <Route path="products/create" element={<AdminProductFormPage />} />
            <Route path="products/edit/:id" element={<AdminProductFormPage />} />
            <Route path="orders" element={<AdminOrdersListPage />} />
            <Route path="orders/:orderId" element={<AdminOrderDetailPage />} />
            <Route path="users" element={<AdminUsersListPage />} /> 
          </Route>
          
          <Route path="*" element={<Navigate to={RoutePath.Home} replace />} /> 
        </Routes>
      </main>
      {showHeaderFooter && <Footer />}
    </div>
  );
}


const App: React.FC = () => {
  return (
    <AuthProvider>
      <SearchProvider>
        <CartProvider>
          <HashRouter>
            <ErrorBoundary 
              fallback={
                <div className="h-screen flex flex-col items-center justify-center bg-red-50 text-red-700 p-4">
                  <h1 className="text-2xl font-bold mb-2">Oops! Application Error</h1>
                  <p>Something went wrong. Please try refreshing the page or contact support if the issue persists.</p>
                </div>
              }
            >
              <AppContentWrapper />
            </ErrorBoundary>
          </HashRouter>
        </CartProvider>
      </SearchProvider>
    </AuthProvider>
  );
};

export default App;