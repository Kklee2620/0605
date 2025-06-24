import React from 'react'; // Removed useContext as SearchContext is no longer directly used here for display
import { ProductCard } from '../components/ProductCard';
import { BannerCarousel } from '../components/BannerCarousel';
import { MOCK_PRODUCTS, CATEGORIES, RoutePath } from '../constants';
// import { SearchContext } from '../contexts/SearchContext'; // No longer needed for display
// import { SearchContextType } from '../types'; // No longer needed for display
import { Link } from 'react-router-dom'; 
import { ProductCategory } from '../types';

export const HomePage: React.FC = () => {
  // const { searchTerm } = useContext(SearchContext) as SearchContextType; // Not needed if search results are on a separate page

  // HomePage now always shows featured products, or you could have specific logic for "featured"
  // For simplicity, showing all products as "featured" unless a more specific filter is added.
  const featuredProducts = MOCK_PRODUCTS.slice(0, 8); // Example: show first 8 as featured

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
                to={RoutePath.CategoryPage.replace(':categoryName', category.toLowerCase())} // Ensure consistent casing for URL
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
        {/* Removed searchTerm dependent title and filtering logic */}
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-lg">
            No featured products available at the moment.
          </p>
        )}
      </div>
    </div>
  );
};