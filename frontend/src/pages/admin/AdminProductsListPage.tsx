
import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Product, AuthContextType, PaginatedResponse } from '../../types';
import { AuthContext } from '../../contexts/AuthContext';
import { fetchProducts } from '../../services/productApiService';
import { deleteProductApi } from '../../services/adminProductApiService';
import { Button } from '../../components/Button';
import { RoutePath } from '../../constants';
import { PlusIcon, TrashIcon, StarIcon } from '../../components/icons';
import { PaginationControls } from '../../components/PaginationControls';

const EditIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);


const AdminProductsListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useContext(AuthContext) as AuthContextType;

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10); // Products per page for admin list

  const loadProducts = useCallback(async (page: number) => {
    try {
      setLoading(true);
      // For admin, list all products by default, sort by newest.
      const response: PaginatedResponse<Product> = await fetchProducts({ 
        page, 
        limit,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      setProducts(response.data);
      setTotalPages(Math.ceil(response.total / response.limit));
      setCurrentPage(response.page);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load products.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    loadProducts(currentPage);
  }, [loadProducts, currentPage]);

  const handleDeleteProduct = async (productId: string) => {
    if (!token) {
      setError("Authentication token not found.");
      return;
    }
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        setLoading(true); // Show loading indicator during delete
        await deleteProductApi(productId, token);
        // Refresh product list for the current page after deletion
        // If current page becomes empty after deletion, and it's not the first page, navigate to previous page
        if (products.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1); // This will trigger useEffect to reload
        } else {
            loadProducts(currentPage); // Reload current page
        }
      } catch (err: any) {
        setError(err.message || 'Failed to delete product.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  if (loading && products.length === 0) return <div className="text-center p-4">Loading products...</div>;
  if (error) return <div className="text-center p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Products</h1>
        <Button as={Link} to={RoutePath.AdminProductCreate} variant="primary" leftIcon={<PlusIcon />}>
          Add Product
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Rating</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 && !loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={product.imageUrls[0]} alt={product.name} className="w-10 h-10 object-cover rounded" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                    {product.averageRating !== undefined && product.averageRating > 0 ? (
                        <>
                            <StarIcon className="w-4 h-4 text-yellow-400 fill-current mr-1"/> 
                            {product.averageRating.toFixed(1)} ({product.reviewCount || 0})
                        </>
                    ) : (
                        'N/A'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button 
                      as={Link} 
                      to={RoutePath.AdminProductEdit.replace(':id', product.id)} 
                      variant="ghost" 
                      size="sm" 
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit Product"
                    >
                      <EditIcon />
                    </Button>
                    <Button 
                      onClick={() => handleDeleteProduct(product.id)} 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:text-red-900"
                      title="Delete Product"
                      disabled={loading} // Disable while any loading is in progress
                    >
                      <TrashIcon />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="mt-6"
        />
      )}
    </div>
  );
};

export default AdminProductsListPage;
