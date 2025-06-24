
import React, { useState } from 'react';
import { StarIcon } from './icons'; // Assuming StarIcon is in icons.tsx

interface StarRatingInputProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  maxRating?: number;
  starSize?: string;
  disabled?: boolean;
}

export const StarRatingInput: React.FC<StarRatingInputProps> = ({
  rating,
  onRatingChange,
  maxRating = 5,
  starSize = "w-6 h-6", // Default size for input stars
  disabled = false,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseOver = (index: number) => {
    if (!disabled) setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (!disabled) setHoverRating(0);
  };

  const handleClick = (index: number) => {
    if (!disabled) onRatingChange(index);
  };

  return (
    <div className={`flex items-center space-x-1 ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}>
      {[...Array(maxRating)].map((_, i) => {
        const starValue = i + 1;
        const isFilled = (hoverRating || rating) >= starValue;
        return (
          <button
            type="button"
            key={starValue}
            className={`focus:outline-none transition-colors duration-150 ${
              isFilled ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
            }`}
            onClick={() => handleClick(starValue)}
            onMouseOver={() => handleMouseOver(starValue)}
            onMouseLeave={handleMouseLeave}
            disabled={disabled}
            aria-label={`Rate ${starValue} out of ${maxRating} stars`}
          >
            <StarIcon className={`${starSize} ${isFilled ? 'fill-current' : ''}`} />
          </button>
        );
      })}
    </div>
  );
};
