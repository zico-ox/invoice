import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  textarea?: boolean;
}

export const Input: React.FC<InputProps> = ({ label, textarea, className = '', ...props }) => {
  const Component = textarea ? 'textarea' : 'input';
  return (
    <div className="flex flex-col">
      {label && <label className="mb-1 text-sm font-medium text-gray-600">{label}</label>}
      <Component
        className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${className}`}
        {...props as any}
      />
    </div>
  );
};