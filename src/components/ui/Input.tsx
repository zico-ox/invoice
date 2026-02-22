import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  textarea?: boolean;
  labelRight?: string;
}

export const Input: React.FC<InputProps> = ({ label, labelRight, textarea, className = '', ...props }) => {
  const Component = textarea ? 'textarea' : 'input';
  return (
    <div className="flex flex-col w-full">
      {(label || labelRight) && (
        <div className="flex justify-between items-end mb-1.5">
          {label && <label className="text-sm font-semibold text-slate-700">{label}</label>}
          {labelRight && <span className="text-xs font-medium text-slate-500">{labelRight}</span>}
        </div>
      )}
      <Component
        className={`w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-500 ${className}`}
        {...props as any}
      />
    </div>
  );
};