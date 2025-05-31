import React, { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'large',
  ...props
}) => {
  const baseClasses =
    'rounded-3xl transition font-semibold focus:outline-none shadow-md';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  const sizeClasses = {
    small: 'px-4 py-2 text-sm min-w-[120px]',
    medium: 'px-5 py-3 text-base min-w-[160px]',
    large: 'px-6 py-4 text-lg min-w-[200px]', // ✅ más alto y letra grande, pero NO w-full
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      {...props}
    >
      {children}
    </button>
  );
};