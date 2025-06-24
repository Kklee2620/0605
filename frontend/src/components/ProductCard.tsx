
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Product, CartContextType } from '../types';
import { RoutePath } from '../constants';
import { Button } from './Button';
import { CartContext } from '../contexts/CartContext';
import { ShoppingCartIcon, StarIcon } from './icons'; 

interface ProductCardProps {
  product: Product;
}

const StarRatingDisplay: React.FC<{ rating: number; reviews?: number, starSize?: string }> = ({ rating, reviews, starSize = "w-4 h-4" }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5; // Display half star if rating is .5 or more
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  // Basic half-star SVG (can be improved)
  const HalfStarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
    </svg>
  );


  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => <StarIcon key={`full-${i}`} className={`${starSize} text-yellow-400 fill-current`} />)}
      {halfStar && <HalfStarIcon className={`${starSize} text-yellow-400`} />}
      {[...Array(emptyStars)].map((_, i) => <StarIcon key={`empty-${i}`} className={`${starSize} text-gray-300 fill-current`} />)}
      {reviews !== undefined && <span className="ml-1.5 text-xs text-gray-500">({reviews})</span>}
    </div>
  );
};


export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, generateCartItemId } = useContext(CartContext) as CartContextType;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    // For card, add to cart without selected options or with default first available if any
    let defaultOptions: { [key: string]: string } | undefined = undefined;
    if (product.options && product.options.length > 0) {
        defaultOptions = {};
        product.options.forEach(opt => {
            const firstAvailable = opt.values.find(v => v.available);
            if (firstAvailable) {
                if(defaultOptions) defaultOptions[opt.name] = firstAvailable.value;
            }
        });
    }
    addToCart(product, 1, defaultOptions);
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
          {product.averageRating !== undefined && product.averageRating > 0 ? (
            <StarRatingDisplay rating={product.averageRating} reviews={product.reviewCount} />
          ) : (
            <div className="text-xs text-gray-400 h-[20px] flex items-center">No reviews yet</div> // Placeholder for consistent height
          )}
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

// Export StarRatingDisplay for use on ProductDetailPage too
export { StarRatingDisplay };
