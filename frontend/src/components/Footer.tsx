import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p>&copy; {new Date().getFullYear()} ModernStore. All rights reserved.</p>
        <p className="text-sm text-gray-400 mt-1">
          A placeholder footer for your amazing e-commerce site.
        </p>
      </div>
    </footer>
  );
};

// Exporting as a named export as per typical component structure
export default Footer;
