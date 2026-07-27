import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = ({label, error, className = "", ...props}:InputProps) => {
   return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-semibold text-black">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 border border-black rounded-full text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black bg-white ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};
