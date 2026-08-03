import React from "react";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const SearchBar = (props: SearchBarProps) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search..."
        {...props}
        className={`w-full px-4 py-2.5 pr-10 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:border-stone-800 ${props.className || ""}`}
      />
      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none text-sm">
        🔍
      </div>
    </div>
  );
};