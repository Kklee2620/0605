import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon } from './icons'; // Assuming a right chevron for breadcrumbs

interface BreadcrumbItem {
  name: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="breadcrumb" className={`mb-6 text-sm ${className}`}>
      <ol className="flex items-center space-x-2 text-gray-500">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.path ? (
              <Link to={item.path} className="hover:text-indigo-600 hover:underline">
                {item.name}
              </Link>
            ) : (
              <span className="font-medium text-gray-700">{item.name}</span>
            )}
            {index < items.length - 1 && (
              // Using a simple slash as separator, could use an icon
              <span className="mx-2 select-none" aria-hidden="true">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};