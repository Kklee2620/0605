
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RoutePath, CATEGORIES } from '../constants'; 
import { Product as ProductType, ProductCategory, PaginatedResponse } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Breadcrumb } from '../components/Breadcrumb';
import { Button } from '../components/Button';
import { fetchProducts } from '../services/productApiService';
import { PaginationControls } from '../components/PaginationControls'; // Import PaginationControls

type SortOptionKey = 'default' | 'price' | 'createdAt' | 'averageRating' | 'name';
type SortOrder = 'asc' | 'desc';

interface SortOptionValue {
  key: SortOptionKey;
  order: SortOrder | 'none'; 
  label: string;
}

const sortOptionsConfig: Record<string, SortOptionValue> = {
  default: { key: 'default', order: 'none', label: 'Default' },
  priceAsc: { key: 'price', order: 'asc', label: 'Price: Low to High' },
  priceDesc: { key: 'price', order: 'desc', label: 'Price: High to Low' },
  ratingDesc: { key: 'averageRating', order: 'desc', label: 'Rating: High to Low'},
  dateNewest: { key: 'createdAt', order: 'desc', label: 'Newest' },
  dateOldest: { key: 'createdAt', order: 'asc', label: 'Oldest' },
  nameAsc: { key: 'name', order: 'asc', label: 'Name: A to Z'},
  nameDesc: { key: 'name', order: 'desc', label: 'Name: Z to A'},
};


export const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSortValue, setCurrentSortValue] = useState<string>('default');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(8); // Products per page

  const category = categoryName?.toLowerCase() as ProductCategory | undefined;
  const isValidCategory = category && CATEGORIES.map(c => c.toLowerCase()).includes(category);

  useEffect(() => {
    if (isValidCategory && category) {
      const loadProducts = async () => {
        try {
          setLoading(true);
          const selectedSortOption = sortOptionsConfig[currentSortValue];
          
          const params = {
            category,
            page: currentPage,
            limit,
            sortBy: selectedSortOption.key === 'default' ? undefined : selectedSortOption.key,
            sortOrder: selectedSortOption.order === 'none' ? undefined : selectedSortOption.order,
          };

          const response: PaginatedResponse<ProductType> = await fetchProducts(params);
          setProducts(response.data);
          setTotalPages(Math.ceil(response.total / response.limit));
          setCurrentPage(response.page); // Ensure current page is updated from response
          setError(null);
        } catch (err) {
          setError('Failed to load products for this category.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      loadProducts();
    } else if (categoryName) {
        setError('Category not found.');
        setLoading(false);
        setProducts([]);
    }
  }, [category, isValidCategory, categoryName, currentSortValue, currentPage, limit]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentSortValue(e.target.value);
    setCurrentPage(1); // Reset to first page on sort change
  };


  if (!category || !isValidCategory) {
    return (
      <div className="py-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Category not found.</h1>
        <p className="text-gray-600">The category "{categoryName}" does not exist.</p>
        <Button as={Link} to={RoutePath.Home} variant="primary" className="mt-4">
          Go back to Home
        </Button>
      </div>
    );
  }
  
  const displayCategoryName = CATEGORIES.find(c => c.toLowerCase() === category) || category;

  const breadcrumbItems = [
    { name: 'Home', path: RoutePath.Home },
    { name: displayCategoryName }
  ];

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-0">
            {displayCategoryName}
          </h1>
          <div className="flex items-center space-x-2">
            <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              id="sort-select"
              value={currentSortValue}
              onChange={handleSortChange}
              className="bg-white border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {Object.entries(sortOptionsConfig).map(([value, { label }]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
        {loading && <p className="text-gray-600 text-center py-10">Loading products...</p>}
        {error && <p className="text-red-600 text-center py-10">{error}</p>}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className="mt-12"
            />
          </>
        )}
        {!loading && !error && products.length === 0 && (
          <p className="text-gray-600 text-lg text-center py-10">
            No products found in this category.
          </p>
        )}
      </div>
    </div>
  );
};
