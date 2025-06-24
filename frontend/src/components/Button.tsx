
import React from 'react';

// Define own props for the Button, generic over the element type C
type ButtonOwnProps<C extends React.ElementType> = {
  as?: C;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  isLoading?: boolean; // New prop for loading state
};

// Combine ButtonOwnProps with the props of the component C specified by 'as',
// omitting any keys from C's props that are already defined in ButtonOwnProps.
export type ButtonProps<C extends React.ElementType = 'button'> = ButtonOwnProps<C> &
  Omit<React.ComponentPropsWithoutRef<C>, keyof ButtonOwnProps<C>>;

export const Button = <C extends React.ElementType = 'button'>({
  as,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  leftIcon,
  rightIcon,
  isLoading = false, // Default isLoading to false
  ...rest // 'rest' will include props like 'to' for Link, or 'type' for button
}: ButtonProps<C>) => {
  const Component = as || 'button';

  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const componentSpecificProps: Record<string, any> = { ...rest };
  if (Component === 'button' && !rest.type) {
    componentSpecificProps.type = 'button';
  }

  return (
    <Component
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className} ${isLoading ? 'opacity-75 cursor-wait' : ''}`}
      disabled={isLoading || componentSpecificProps.disabled} // Disable button if isLoading or already disabled
      {...componentSpecificProps}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children} 
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </Component>
  );
};
