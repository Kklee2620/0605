import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_PRODUCTS, RoutePath } from '../constants';
import { Product as ProductType, CartContextType, ProductOption, AuthContextType } from '../types';
import { Button } from '../components/Button';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { ShoppingCartIcon, PlusIcon, MinusIcon, ChevronLeftIcon, StarIcon } from '../components/icons';

// Simple StarRating component (could be moved to a shared components file if used elsewhere)
const StarRating: React.FC<{ rating: number; reviews?: number }> = ({ rating, reviews }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0; // Simplified, assumes whole numbers or .5
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="flex items-center my-2">
      {[...Array(fullStars)].map((_, i) => <StarIcon key={`full-${i}`} className="w-5 h-5 text-yellow-400 fill-current" />)}
      {/* For simplicity, not showing half stars icons yet */}
      {[...Array(emptyStars)].map((_, i) => <StarIcon key={`empty-${i}`} className="w-5 h-5 text-gray-300 fill-current" />)}
      {reviews !== undefined && <span className="ml-2 text-sm text-gray-600">({reviews} reviews)</span>}
    </div>
  );
};


export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductType | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});

  const { addToCart } = useContext(CartContext) as CartContextType;
  const { currentUser } = useContext(AuthContext) as AuthContextType;


  useEffect(() => {
    const foundProduct = MOCK_PRODUCTS.find(p => p.id === id);
    setProduct(foundProduct);
    if (foundProduct) {
      setSelectedImage(foundProduct.imageUrls[0]);
      if (foundProduct.stock < 1) {
        setQuantity(0);
      } else {
        setQuantity(1);
      }
      // Initialize selectedOptions
      const initialOptions: { [key: string]: string } = {};
      foundProduct.options?.forEach(opt => {
        const firstAvailableValue = opt.values.find(v => v.available)?.value;
        if (firstAvailableValue) {
          initialOptions[opt.name] = firstAvailableValue;
        }
      });
      setSelectedOptions(initialOptions);
    }
  }, [id]);

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
  };

  if (!product) {
    return (
      <div className="py-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Product not found.</h1>
        <Button as={Link} to={RoutePath.Home} variant="primary" className="mt-4">
           <ChevronLeftIcon className="w-5 h-5 mr-1" /> Go back to Home
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (quantity > 0) {
        addToCart(product, quantity, selectedOptions);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, product.stock));
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };
  
  const isOutOfStock = product.stock === 0;

  return (
    <div className="py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to={RoutePath.Home} className="inline-flex items-center text-indigo-600 hover:underline mb-6 text-sm group">
          <ChevronLeftIcon className="w-5 h-5 mr-1 transition-transform group-hover:-translate-x-1" />
          Back to products
        </Link>
        <div className="bg-white shadow-xl rounded-lg overflow-hidden md:flex">
          <div className="md:w-1/2 p-4">
            <div className="mb-4 h-96">
              <img 
                src={selectedImage} 
                alt={product.name} 
                className="w-full h-full object-contain rounded-lg" 
              />
            </div>
            {product.imageUrls.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.imageUrls.map((url, index) => (
                  <button 
                    key={index} 
                    onClick={() => setSelectedImage(url)}
                    className={`w-20 h-20 rounded-md overflow-hidden border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${selectedImage === url ? 'border-indigo-600' : 'border-transparent hover:border-gray-300'}`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img src={url} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">{product.name}</h1>
            <p className="text-sm text-gray-500 mb-2">{product.category}</p>
            {product.rating !== undefined && <StarRating rating={product.rating} reviews={product.reviews} />}
            <p className="text-3xl font-semibold text-indigo-600 my-4">${product.price.toFixed(2)}</p>
            
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Description</h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>

            {product.options && product.options.length > 0 && (
              <div className="mb-6 space-y-4">
                {product.options.map(option => (
                  <div key={option.name}>
                    <label htmlFor={`option-${option.name}`} className="block text-sm font-medium text-gray-700 mb-1">
                      {option.name}: <span className="font-normal">{selectedOptions[option.name]}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map(val => (
                        <Button
                          key={val.value}
                          variant={selectedOptions[option.name] === val.value ? 'primary' : 'secondary'}
                          size="sm"
                          onClick={() => handleOptionChange(option.name, val.value)}
                          disabled={!val.available}
                          className={`min-w-[4rem] ${!val.available ? 'line-through opacity-60' : ''}`}
                        >
                          {val.value}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className={`text-sm mb-4 font-medium ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                {isOutOfStock ? 'Out of Stock' : `${product.stock} items in stock`}
            </p>

            {!isOutOfStock && (
                <div className="flex items-center space-x-3 mb-6">
                <Button variant="ghost" size="sm" onClick={decrementQuantity} disabled={quantity <= 1} aria-label="Decrease quantity">
                    <MinusIcon className="w-5 h-5" />
                </Button>
                <span className="text-lg font-medium w-10 text-centertabular-nums" aria-live="polite">{quantity}</span>
                <Button variant="ghost" size="sm" onClick={incrementQuantity} disabled={quantity >= product.stock} aria-label="Increase quantity">
                    <PlusIcon className="w-5 h-5" />
                </Button>
                </div>
            )}
            
            <Button 
              variant="primary" 
              size="lg" 
              className="w-full mt-auto" 
              onClick={handleAddToCart}
              disabled={isOutOfStock || quantity === 0}
              leftIcon={<ShoppingCartIcon className="w-5 h-5" />}
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};