
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import { MOCK_BANNERS } from '../constants';
import { ChevronLeftIcon } from './icons'; 

const ChevronRightIconRotated: React.FC<{className?: string}> = ({className}) => <ChevronLeftIcon className={`${className} transform rotate-180`} />;


interface BannerItemProps {
  imageUrl: string;
  title: string;
  subtitle?: string;
  link: string;
  buttonText?: string;
  isActive: boolean;
}

const BannerSlide: React.FC<BannerItemProps> = ({ imageUrl, title, subtitle, link, buttonText, isActive }) => {
  return (
    <div 
      className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
      role="tabpanel"
      aria-hidden={!isActive}
    >
        <div 
            className="w-full h-full bg-cover bg-center rounded-lg" 
            style={{ backgroundImage: `url(${imageUrl})` }}
            aria-label={title}
        >
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center p-4">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">{title}</h2>
                {subtitle && <p className="text-lg md:text-xl text-gray-200 mb-6 drop-shadow-md">{subtitle}</p>}
                {buttonText && (
                <Button as={Link} to={link} variant="primary" size="lg" className="shadow-lg">
                    {buttonText}
                </Button>
                )}
            </div>
        </div>
    </div>
  );
};


export const BannerCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const banners = MOCK_BANNERS;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === banners.length - 1 ? 0 : prevIndex + 1));
  }, [banners.length]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? banners.length - 1 : prevIndex - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  }

  useEffect(() => {
    if (banners.length <= 1) return; 

    const slideInterval = setInterval(nextSlide, 7000); // Increased interval
    return () => clearInterval(slideInterval);
  }, [nextSlide, banners.length]);

  if (!banners || banners.length === 0) return null;


  return (
    <div className="mb-12 relative group h-64 md:h-96" role="region" aria-roledescription="carousel" aria-label="Promotional Banners">
      <div className="relative w-full h-full overflow-hidden rounded-lg shadow-lg">
        {banners.map((banner, index) => (
            <BannerSlide
                key={banner.id}
                imageUrl={banner.imageUrl}
                title={banner.title}
                subtitle={banner.subtitle}
                link={banner.link}
                buttonText={banner.buttonText}
                isActive={index === currentIndex}
            />
        ))}
      </div>
      
      {banners.length > 1 && (
        <>
          {/* Previous Button */}
          <button 
            onClick={prevSlide}
            className="absolute top-1/2 left-1 sm:left-3 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 sm:p-3 rounded-full hover:bg-opacity-50 focus:bg-opacity-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none z-20"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          {/* Next Button */}
          <button 
            onClick={nextSlide}
            className="absolute top-1/2 right-1 sm:right-3 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 sm:p-3 rounded-full hover:bg-opacity-50 focus:bg-opacity-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none z-20"
            aria-label="Next slide"
          >
            <ChevronRightIconRotated className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          {/* Dot Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20" role="tablist">
            {banners.map((_, index) => (
              <button
                key={`dot-${index}`}
                onClick={() => goToSlide(index)}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${currentIndex === index ? 'bg-white ring-1 ring-offset-1 ring-offset-black/30 ring-white' : 'bg-gray-400 bg-opacity-70 hover:bg-gray-200'} transition-colors focus:outline-none focus:ring-1 focus:ring-white`}
                aria-label={`Go to slide ${index + 1}`}
                aria-selected={currentIndex === index}
                role="tab"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

