'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-[12px] font-semibold text-ink/70 tracking-wide">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full rounded-lg border px-3 py-2.5 text-sm text-ink placeholder-gray-300',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all',
            'bg-white',
            error
              ? 'border-red-300 bg-red-50/30'
              : 'border-gray-200 hover:border-gray-300',
            className,
          )}
          {...props}
        />
        {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
        {hint && !error && <p className="text-[11px] text-gray-400">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
