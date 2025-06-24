
import React, { useState, useEffect, useContext }from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Product, ProductCategory, ProductOption, ProductOptionValue, AuthContextType } from '../../types'; // Corrected import for AuthContextType
import { AuthContext } from '../../contexts/AuthContext';
import { fetchProductById } from '../../services/productApiService'; // Public API for fetch
import { createProductApi, updateProductApi, AdminProductPayload } from '../../services/adminProductApiService';
import { Button } from '../../components/Button';
import { RoutePath, CATEGORIES } from '../../constants';
import { ChevronLeftIcon } from '../../components/icons';

// Updated AdminProductPayload to remove rating and reviews
interface ModifiedAdminProductPayload {
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  category: ProductCategory;
  stock: number;
  options?: ProductOption[];
  // averageRating and reviewCount are not set by admin directly
}


const AdminProductFormPage: React.FC = () => {
  const { id: productId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext) as AuthContextType;

  const [productData, setProductData] = useState<Partial<ModifiedAdminProductPayload>>({
    name: '',
    description: '',
    price: 0,
    imageUrls: [],
    category: CATEGORIES[0], // Default to first category
    stock: 0,
    options: [],
    // Removed rating and reviews from initial state
  });
  const [imageUrlsString, setImageUrlsString] = useState('');
  const [optionsString, setOptionsString] = useState('[]'); // For JSON input of options

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (productId) {
      setIsEditMode(true);
      setLoading(true);
      fetchProductById(productId)
        .then(product => {
          if (product) {
            // Map fetched product (which might have averageRating/reviewCount) to form state (without them)
            const { averageRating, reviewCount, ...formData } = product;
            setProductData(formData);
            setImageUrlsString(product.imageUrls.join(', '));
            setOptionsString(JSON.stringify(product.options || [], null, 2));
          } else {
            setError('Product not found.');
          }
        })
        .catch(err => setError(err.message || 'Failed to load product details.'))
        .finally(() => setLoading(false));
    }
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const isNumberField = type === 'number' || e.target.dataset.type === 'number';
    setProductData(prev => ({ ...prev, [name]: isNumberField ? parseFloat(value) : value }));
  };

  const handleImageUrlsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setImageUrlsString(e.target.value);
  };
  
  const handleOptionsStringChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOptionsString(e.target.value);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Authentication token not found.");
      return;
    }
    setLoading(true);
    setError(null);

    let parsedImageUrls: string[];
    try {
        parsedImageUrls = imageUrlsString.split(',').map(url => url.trim()).filter(url => url);
        if (parsedImageUrls.length === 0 && productData.name) { 
            throw new Error("At least one image URL is required.");
        }
    } catch (parseError: any) {
        setError("Invalid image URLs format. Please provide comma-separated URLs.");
        setLoading(false);
        return;
    }

    let parsedOptions: ProductOption[] | undefined;
    try {
        parsedOptions = JSON.parse(optionsString);
        if (parsedOptions && !Array.isArray(parsedOptions)) throw new Error("Options must be an array.");
        parsedOptions?.forEach(opt => {
            if (typeof opt.name !== 'string' || !Array.isArray(opt.values)) throw new Error("Invalid option structure: name or values.");
            opt.values.forEach(val => {
                if (typeof val.value !== 'string' || typeof val.available !== 'boolean') throw new Error("Invalid option value structure.");
            });
        });

    } catch (parseError: any) {
        setError(parseError.message || 'Invalid JSON format for Product Options.');
        setLoading(false);
        return;
    }

    const payload: ModifiedAdminProductPayload = {
      name: productData.name || '',
      description: productData.description || '',
      price: Number(productData.price) || 0,
      imageUrls: parsedImageUrls,
      category: productData.category || CATEGORIES[0],
      stock: Number(productData.stock) || 0,
      options: parsedOptions,
    };
    
    if (!isEditMode && (!payload.name || !payload.category || payload.price <=0 || payload.imageUrls.length === 0 )) {
        setError('Name, Category, Price, and at least one Image URL are required for new products.');
        setLoading(false);
        return;
    }

    try {
      if (isEditMode && productId) {
        // The AdminProductPayload for updateProductApi might need adjustment if it still expects rating/reviews
        // For now, casting payload to AdminProductPayload for compatibility, assuming backend handles missing rating/reviews
        await updateProductApi(productId, payload as AdminProductPayload, token);
      } else {
        await createProductApi(payload as AdminProductPayload, token);
      }
      navigate(RoutePath.AdminProducts);
    } catch (err: any) {
      setError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} product.`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode && !productData.name) return <div className="text-center p-4">Loading product data...</div>;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-2xl mx-auto">
      <Link to={RoutePath.AdminProducts} className="inline-flex items-center text-indigo-600 hover:underline mb-6 text-sm group">
          <ChevronLeftIcon className="w-5 h-5 mr-1 transition-transform group-hover:-translate-x-1" />
          Back to Product List
      </Link>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">{isEditMode ? 'Edit Product' : 'Create New Product'}</h1>
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" name="name" id="name" value={productData.name} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" id="description" value={productData.description} onChange={handleChange} rows={4} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"></textarea>
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
          <input type="number" name="price" id="price" value={productData.price} onChange={handleChange} data-type="number" required min="0" step="0.01" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
        </div>
         <div>
          <label htmlFor="imageUrls" className="block text-sm font-medium text-gray-700">Image URLs (comma-separated)</label>
          <textarea name="imageUrls" id="imageUrls" value={imageUrlsString} onChange={handleImageUrlsChange} rows={3} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"></textarea>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select name="category" id="category" value={productData.category} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 bg-white">
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
          <input type="number" name="stock" id="stock" value={productData.stock} data-type="number" onChange={handleChange} required min="0" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
        </div>
        <div>
          <label htmlFor="optionsString" className="block text-sm font-medium text-gray-700">Options (JSON format)</label>
          <textarea name="optionsString" id="optionsString" value={optionsString} onChange={handleOptionsStringChange} rows={5} placeholder='e.g., [{"name": "Color", "values": [{"value": "Red", "available": true}]}]' className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 font-mono"></textarea>
          <p className="text-xs text-gray-500 mt-1">Enter a valid JSON array of ProductOption objects. See types.ts for structure. Example: `[{"name": "Color", "values": [{"value": "Red", "available": true}, {"value": "Blue", "available": false}]}]`</p>
        </div>
        {/* Removed rating and review count inputs */}
        
        <div className="flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={() => navigate(RoutePath.AdminProducts)} disabled={loading}>
                Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={loading} disabled={loading}>
                {isEditMode ? 'Update Product' : 'Create Product'}
            </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductFormPage;
