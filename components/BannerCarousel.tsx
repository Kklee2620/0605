import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import { MOCK_BANNERS } from '../constants'; // Assuming banners are defined in constants

interface BannerProps {
  imageUrl: string;
  title: string;
  subtitle?: string;
  link: string;
  buttonText?: string;
}

const Banner: React.FC<BannerProps> = ({ imageUrl, title, subtitle, link, buttonText }) => {
  return (
    <div 
      className="relative bg-cover bg-center h-64 md:h-96 rounded-lg overflow-hidden" 
      style={{ backgroundImage: `url(${imageUrl})` }}
      role="banner"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">{title}</h2>
        {subtitle && <p className="text-lg md:text-xl text-gray-200 mb-6">{subtitle}</p>}
        {buttonText && (
          <Button as={Link} to={link} variant="primary" size="lg">
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
};


export const BannerCarousel: React.FC = () => {
  // For V1, showing only the first banner statically.
  // A real carousel would require state and navigation logic.
  const firstBanner = MOCK_BANNERS[0];

  if (!firstBanner) return null;

  return (
    <div className="mb-12">
      <Banner 
        imageUrl={firstBanner.imageUrl}
        title={firstBanner.title}
        subtitle={firstBanner.subtitle}
        link={firstBanner.link}
        buttonText={firstBanner.buttonText}
      />
    </div>
  );
};