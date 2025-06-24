import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Product, CartContextType } from '../types';
import { RoutePath } from '../constants';
import { Button } from './Button';
import { CartContext } from '../contexts/CartContext';
import { ShoppingCartIcon, StarIcon } from './icons'; // Assuming StarIcon is added to icons.tsx

interface ProductCardProps {
  product: Product;
}

// Simple StarRating component
const StarRating: React.FC<{ rating: number; reviews?: number }> = ({ rating, reviews }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => <StarIcon key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-current" />)}
      {halfStar && <StarIcon key="half" className="w-4 h-4 text-yellow-400 fill-current" /> /* Simple half, could be improved with a half-star icon */}
      {[...Array(emptyStars)].map((_, i) => <StarIcon key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" />)}
      {reviews !== undefined && <span className="ml-1 text-xs text-gray-500">({reviews})</span>}
    </div>
  );
};


export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useContext(CartContext) as CartContextType;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    // For V1, not handling option selection on card. Defaulting to first available if needed or none.
    addToCart(product);
  };
  
  const productDetailPath = RoutePath.ProductDetail.replace(':id', product.id);

  return (
    <Link to={productDetailPath} className="group block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col h-full">
        <div className="relative w-full h-64 overflow-hidden">
          <img 
            src={product.imageUrls[0]} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
           {product.stock === 0 && (
            <span className="absolute top-2 right-2 bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded">Out of Stock</span>
          )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <p className="text-xs text-gray-500 mb-1">{product.category}</p>
          <h3 className="text-lg font-medium text-gray-900 mb-1 truncate" title={product.name}>
            {product.name}
          </h3>
          {product.rating !== undefined && <StarRating rating={product.rating} reviews={product.reviews} />}
          <p className="text-xl font-semibold text-indigo-600 my-2 mt-auto pt-2">
            ${product.price.toFixed(2)}
          </p>
          <Button 
            variant="primary" 
            className="w-full mt-2"
            onClick={handleAddToCart}
            leftIcon={<ShoppingCartIcon className="w-5 h-5"/>}
            disabled={product.stock === 0}
            aria-label={`Add ${product.name} to cart`}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </Link>
  );
};