
import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { RoutePath } from '../constants';
import { Product as ProductType, CartContextType, ProductOption, Review, AuthContextType } from '../types';
import { Button } from '../components/Button';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { ShoppingCartIcon, PlusIcon, MinusIcon, ChevronLeftIcon } from '../components/icons';
import { fetchProductById, fetchRelatedProducts } from '../services/productApiService';
import { StarRatingInput } from '../components/StarRatingInput';
import { StarRatingDisplay, ProductCard } from '../components/ProductCard';
import { fetchReviewsApi, addReviewApi, CreateReviewPayload } from '../services/reviewApiService';
import { checkIfUserPurchasedProductApi } from '../services/orderApiService';


const ReviewItem: React.FC<{ review: Review }> = ({ review }) => (
  <div className="py-4 border-b border-gray-200 last:border-b-0">
    <div className="flex items-center mb-1">
      <StarRatingDisplay rating={review.rating} starSize="w-4 h-4" />
      <p className="ml-2 text-sm font-semibold text-gray-800">{review.user.name || 'Anonymous'}</p>
    </div>
    <p className="text-xs text-gray-500 mb-2">
      {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
    </p>
    {review.comment && <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>}
  </div>
);


export const ProductDetailPage: React.FC = () => {
  const { id: productId } = useParams<{ id: string }>();
  const { currentUser, token } = useContext(AuthContext) as AuthContextType;
  const { addToCart } = useContext(CartContext) as CartContextType;
  const location = useLocation();

  const [product, setProduct] = useState<ProductType | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [loadingPurchaseCheck, setLoadingPurchaseCheck] = useState(true);

  const fetchProductData = useCallback(async (currentProductId: string) => {
    try {
      setLoadingProduct(true);
      const foundProduct = await fetchProductById(currentProductId);
      setProduct(foundProduct);
      if (foundProduct) {
        setSelectedImage(foundProduct.imageUrls[0]);
        setQuantity(foundProduct.stock < 1 ? 0 : 1);
        const initialOptions: { [key: string]: string } = {};
        foundProduct.options?.forEach(opt => {
          const firstAvailableValue = opt.values.find(v => v.available)?.value;
          if (firstAvailableValue) initialOptions[opt.name] = firstAvailableValue;
        });
        setSelectedOptions(initialOptions);
        setError(null);
      } else {
        setError('Product not found.');
      }
    } catch (err) {
      setError('Failed to load product details.');
      console.error(err);
    } finally {
      setLoadingProduct(false);
    }
  }, []);
  
  const fetchProductReviews = useCallback(async (currentProductId: string) => {
    try {
      setLoadingReviews(true);
      const fetchedReviews = await fetchReviewsApi(currentProductId);
      setReviews(fetchedReviews);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  }, []);

  const loadRelatedProducts = useCallback(async (currentProductId: string) => {
    try {
      setLoadingRelated(true);
      const fetchedRelated = await fetchRelatedProducts(currentProductId, 4);
      setRelatedProducts(fetchedRelated);
    } catch (err) {
      console.error('Failed to load related products:', err);
      // Optionally set a specific error for related products
    } finally {
      setLoadingRelated(false);
    }
  }, []);

  const checkPurchaseStatus = useCallback(async (currentProductId: string) => {
    if (!currentUser || !token) {
      setHasPurchased(false);
      setLoadingPurchaseCheck(false);
      return;
    }
    try {
      setLoadingPurchaseCheck(true);
      const response = await checkIfUserPurchasedProductApi(currentProductId, token);
      setHasPurchased(response.purchased);
    } catch (err) {
      console.error('Failed to check purchase status:', err);
      setHasPurchased(false);
    } finally {
      setLoadingPurchaseCheck(false);
    }
  }, [currentUser, token]);


  useEffect(() => {
    if (!productId) {
      setError("No product ID provided.");
      setLoadingProduct(false);
      setLoadingReviews(false);
      setLoadingPurchaseCheck(false);
      setLoadingRelated(false);
      return;
    }
    fetchProductData(productId);
    fetchProductReviews(productId);
    loadRelatedProducts(productId);
    if(currentUser && token) {
      checkPurchaseStatus(productId);
    } else {
      setLoadingPurchaseCheck(false);
      setHasPurchased(false);
    }
  }, [productId, currentUser, token, fetchProductData, fetchProductReviews, loadRelatedProducts, checkPurchaseStatus]);


  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
  };

  const handleAddToCart = () => {
    if (quantity > 0 && product) {
      setIsAddingToCart(true);
      setTimeout(() => { // Simulate network delay for visual feedback
        addToCart(product, quantity, selectedOptions);
        setIsAddingToCart(false);
        // Optionally show a success toast/message
      }, 300);
    }
  };

  const incrementQuantity = () => {
    if(product) setQuantity(prev => Math.min(prev + 1, product.stock));
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };
  
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !token || !currentUser) {
      setReviewError("You must be logged in to submit a review.");
      return;
    }
    if (userRating === 0) {
      setReviewError("Please select a rating.");
      return;
    }
    setIsSubmittingReview(true);
    setReviewError(null);
    try {
      const payload: CreateReviewPayload = { rating: userRating, comment: userComment };
      await addReviewApi(productId, payload, token);
      await fetchProductData(productId); // Refresh product data for updated averageRating/reviewCount
      await fetchProductReviews(productId); // Refresh reviews list
      setUserRating(0);
      setUserComment('');
    } catch (err: any) {
      setReviewError(err.message || "Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };
  
  if (loadingProduct && !product) {
    return <div className="py-8 text-center text-gray-600">Loading product details...</div>;
  }

  if (error && !product) { 
    return (
      <div className="py-8 text-center">
        <h1 className="text-2xl font-semibold text-red-600">{error}</h1>
        <Button as={Link} to={RoutePath.Home} variant="primary" className="mt-4">
           <ChevronLeftIcon className="w-5 h-5 mr-1" /> Go back to Home
        </Button>
      </div>
    );
  }
  
  if (!product) { 
     return (
      <div className="py-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Product could not be loaded.</h1>
        <Button as={Link} to={RoutePath.Home} variant="primary" className="mt-4">
           <ChevronLeftIcon className="w-5 h-5 mr-1" /> Go back to Home
        </Button>
      </div>
    );
  }
  
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
                src={selectedImage || product.imageUrls[0]} 
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
            
             <div className="flex items-center my-2">
              {product.averageRating !== undefined && product.averageRating > 0 ? (
                <StarRatingDisplay rating={product.averageRating} reviews={product.reviewCount} starSize="w-5 h-5" />
              ) : (
                <span className="text-sm text-gray-500">No reviews yet</span>
              )}
            </div>

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
                          disabled={!val.available || isAddingToCart}
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
                <Button variant="ghost" size="sm" onClick={decrementQuantity} disabled={quantity <= 1 || isAddingToCart} aria-label="Decrease quantity">
                    <MinusIcon className="w-5 h-5" />
                </Button>
                <span className="text-lg font-medium w-10 text-centertabular-nums" aria-live="polite">{quantity}</span>
                <Button variant="ghost" size="sm" onClick={incrementQuantity} disabled={quantity >= product.stock || isAddingToCart} aria-label="Increase quantity">
                    <PlusIcon className="w-5 h-5" />
                </Button>
                </div>
            )}
            
            <Button 
              variant="primary" 
              size="lg" 
              className="w-full mt-auto" 
              onClick={handleAddToCart}
              disabled={isOutOfStock || quantity === 0 || isAddingToCart}
              isLoading={isAddingToCart}
              leftIcon={!isAddingToCart ? <ShoppingCartIcon className="w-5 h-5" /> : undefined}
            >
              {isOutOfStock ? 'Out of Stock' : (isAddingToCart ? 'Adding...' : 'Add to Cart')}
            </Button>
          </div>
        </div>

        <div className="mt-12 bg-white shadow-xl rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Customer Reviews</h2>
          {currentUser && !loadingPurchaseCheck && (
            hasPurchased ? (
              <form onSubmit={handleReviewSubmit} className="mb-8 p-4 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Write a Review</h3>
                {reviewError && <p className="text-sm text-red-600 bg-red-100 p-2 rounded mb-3">{reviewError}</p>}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating:</label>
                  <StarRatingInput rating={userRating} onRatingChange={setUserRating} disabled={isSubmittingReview} />
                </div>
                <div className="mb-4">
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Your Comment (Optional):</label>
                  <textarea id="comment" value={userComment} onChange={(e) => setUserComment(e.target.value)} rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" disabled={isSubmittingReview}></textarea>
                </div>
                <Button type="submit" variant="primary" isLoading={isSubmittingReview} disabled={isSubmittingReview || userRating === 0}>
                  Submit Review
                </Button>
              </form>
            ) : (
              <p className="mb-8 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">You must purchase this product to leave a review.</p>
            )
          )}
          {!currentUser && !loadingPurchaseCheck && (
             <p className="mb-8 text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
                Please <Link to={{ pathname: RoutePath.Login }} state={{ from: location }} className="font-medium text-indigo-600 hover:underline">log in</Link> to write a review.
            </p>
          )}
          {loadingPurchaseCheck && <p className="mb-8 text-sm text-gray-500">Checking if you can review...</p>}
          {loadingReviews ? (
            <p className="text-gray-600">Loading reviews...</p>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map(review => <ReviewItem key={review.id} review={review} />)}
            </div>
          ) : (
            <p className="text-gray-600">This product has no reviews yet. Be the first to review it!</p>
          )}
        </div>

        {/* Related Products Section */}
        {loadingRelated ? (
          <p className="mt-12 text-gray-600 text-center">Loading similar products...</p>
        ) : relatedProducts.length > 0 ? (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {relatedProducts.map(relatedProd => (
                <ProductCard key={relatedProd.id} product={relatedProd} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
