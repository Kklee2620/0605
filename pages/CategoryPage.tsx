import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_PRODUCTS, RoutePath, CATEGORIES } from '../constants';
import { Product as ProductType, ProductCategory } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Breadcrumb } from '../components/Breadcrumb';
import { Button } from '../components/Button';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'date-newest' | 'date-oldest';

export const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('default');

  const category = categoryName as ProductCategory; // Assume categoryName is a valid ProductCategory

  useEffect(() => {
    if (category) {
      const filtered = MOCK_PRODUCTS.filter(p => p.category.toLowerCase() === category.toLowerCase());
      setProducts(filtered);
      setSortOption('default'); // Reset sort on category change
    }
  }, [category]);

  const sortedProducts = useMemo(() => {
    let sorted = [...products];
    switch (sortOption) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'date-newest':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'date-oldest':
        sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      default:
        // 'default' or initial load - no specific sort or retain original MOCK_PRODUCTS order for the category
        // If MOCK_PRODUCTS is already sorted in some meaningful way, this will preserve it.
        // Or, you could apply a default sort here, e.g., by name.
        break;
    }
    return sorted;
  }, [products, sortOption]);

  if (!category || !CATEGORIES.includes(category)) {
    return (
      <div className="py-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Category not found.</h1>
        <Button as={Link} to={RoutePath.Home} variant="primary" className="mt-4">
          Go back to Home
        </Button>
      </div>
    );
  }

  const breadcrumbItems = [
    { name: 'Home', path: RoutePath.Home },
    { name: category }
  ];

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-0">
            {category}
          </h1>
          <div className="flex items-center space-x-2">
            <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              id="sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="bg-white border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="date-newest">Newest</option>
              <option value="date-oldest">Oldest</option>
            </select>
          </div>
        </div>

        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {sortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-lg text-center py-10">
            No products found in this category.
          </p>
        )}
      </div>
    </div>
  );
};
