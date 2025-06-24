
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { RoutePath } from '../constants';
import { Product as ProductType, PaginatedResponse } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Breadcrumb } from '../components/Breadcrumb';
import { Button } from '../components/Button';
import { fetchProducts } from '../services/productApiService';
import { PaginationControls } from '../components/PaginationControls'; // Import PaginationControls

export const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(8); // Products per page

  useEffect(() => {
    if (query) {
      const loadSearchResults = async () => {
        try {
          setLoading(true);
          const params = { 
            searchTerm: query, 
            page: currentPage, 
            limit 
          };
          const response: PaginatedResponse<ProductType> = await fetchProducts(params);
          setProducts(response.data);
          setTotalPages(Math.ceil(response.total / response.limit));
          setCurrentPage(response.page); // Ensure current page is updated from response
          setError(null);
        } catch (err) {
          setError('Failed to load search results.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      loadSearchResults();
    } else {
      setProducts([]); 
      setLoading(false);
      setTotalPages(1);
      setCurrentPage(1);
    }
  }, [query, currentPage, limit]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const breadcrumbItems = [
    { name: 'Home', path: RoutePath.Home },
    { name: `Search results for "${query}"` }
  ];

  if (!query && !loading) {
     return (
        <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumb items={[{ name: 'Home', path: RoutePath.Home }, {name: 'Search'}]} />
                 <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">Search Products</h1>
                 <div className="text-center py-10">
                    <p className="text-gray-600 text-lg mb-4">
                        Please enter a search term in the bar above to find products.
                    </p>
                    <Button as={Link} to={RoutePath.Home} variant="primary">
                        Browse All Products
                    </Button>
                </div>
            </div>
        </div>
    );
  }


  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
          {`Search Results for "${query}"`}
        </h1>
        {loading && <p className="text-gray-600 text-center py-10">Loading search results...</p>}
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
        {!loading && !error && products.length === 0 && query && (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg mb-4">
              No products found matching your search criteria "{query}".
            </p>
            <Button as={Link} to={RoutePath.Home} variant="primary">
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
