import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MOCK_PRODUCTS, RoutePath } from '../constants';
import { Product as ProductType } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Breadcrumb } from '../components/Breadcrumb';
import { Button } from '../components/Button';

export const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const filteredProducts = MOCK_PRODUCTS.filter(product =>
    query ? (
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    ) : false // If no query, show no results (or could show all, but specific search usually implies query)
  );

  const breadcrumbItems = [
    { name: 'Home', path: RoutePath.Home },
    { name: `Search results for "${query}"` }
  ];

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
          {query ? `Search Results for "${query}"` : 'Search Products'}
        </h1>

        {query && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : query && filteredProducts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg mb-4">
              No products found matching your search criteria "{query}".
            </p>
            <Button as={Link} to={RoutePath.Home} variant="primary">
              Continue Shopping
            </Button>
          </div>
        ) : (
             <div className="text-center py-10">
                <p className="text-gray-600 text-lg mb-4">
                    Please enter a search term in the bar above to find products.
                </p>
                <Button as={Link} to={RoutePath.Home} variant="primary">
                    Browse All Products
                </Button>
            </div>
        )}
      </div>
    </div>
  );
};
