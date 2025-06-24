
import React, { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { BannerCarousel } from '../components/BannerCarousel';
import { CATEGORIES, RoutePath } from '../constants';
import { Link } from 'react-router-dom';
import { Product, ProductCategory, PaginatedResponse } from '../types';
import { fetchProducts } from '../services/productApiService';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        // Fetch first 8 products as featured, sorted by creation date (newest first)
        const response: PaginatedResponse<Product> = await fetchProducts({
          page: 1,
          limit: 8, // Fetch 8 featured products
          sortBy: 'createdAt', // Assuming you want newest as featured
          sortOrder: 'desc',
        });
        setFeaturedProducts(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load featured products.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BannerCarousel />

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Shop by Category</h2>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map(category => (
              <Link
                key={category}
                to={RoutePath.CategoryPage.replace(':categoryName', category.toLowerCase() as string)}
                className="bg-gray-200 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 font-medium py-2 px-4 rounded-full transition-colors duration-150"
                aria-label={`Shop ${category}`}
              >
                {category}
              </Link>
            ))}
          </div>
        </section>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
          Featured Products
        </h1>
        {loading && <p className="text-gray-600">Loading products...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && featuredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        {!loading && !error && featuredProducts.length === 0 && (
          <p className="text-gray-600 text-lg">
            No featured products available at the moment.
          </p>
        )}
      </div>
    </div>
  );
};
