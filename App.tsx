import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { SearchProvider } from './contexts/SearchContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
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

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SearchProvider>
        <CartProvider>
          <HashRouter>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Header />
              <main className="flex-grow">
                <Routes>
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
                  
                  {/* Fallback for unmatched routes */}
                  <Route path="*" element={<Navigate to={RoutePath.Home} replace />} /> 
                </Routes>
              </main>
              <Footer />
            </div>
          </HashRouter>
        </CartProvider>
      </SearchProvider>
    </AuthProvider>
  );
};

export default App;