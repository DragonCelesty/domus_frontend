import React, { type ChangeEvent } from 'react';

interface RoundedInputProps {
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  error?: string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export const RoundedInput: React.FC<RoundedInputProps> = ({
  type,
  placeholder = '',
  value,
  onChange,
  label,
  error,
  size = 'large', // usar "large" por defecto para letra y padding grandes
  disabled = false,
}) => {
  const baseClasses =
    'rounded-3xl shadow-md focus:outline-none focus:ring-2 transition bg-white text-gray-800 font-medium';

  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-6 py-4 text-lg',
  };

  const errorClasses = error ? 'border border-red-500 focus:ring-red-500' : 'border border-gray-300 focus:ring-blue-500';
  const disabledClasses = disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : '';

  return (
    <div className="mb-6 flex justify-center">
      <div className="w-[340px]">
        {label && <label className="block mb-2 text-gray-700 font-semibold">{label}</label>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`${baseClasses} ${sizeClasses[size]} ${errorClasses} ${disabledClasses} w-full`}
        />
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
};