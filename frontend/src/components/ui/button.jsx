import React from 'react';
import { cn } from '@/lib/utils';

export function Button({ className, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors",
        className
      )}
      {...props}
    />
  );
}
