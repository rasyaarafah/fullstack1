import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "Primary" | "Outline" | "Action";
}

export const Button = ({
  children,
  variant = "Primary",
  className = "",
  type = "button",
  onClick,
  ...props
}: ButtonProps) => {
  const baseStyle =
    "font-medium transition-all focus:outline-none flex items-center justify-center cursor-pointer select-none";

  const variants = {
    // Main black Button (e.g., "Sign In")
    Primary: "bg-black text-white px-6 py-2 rounded-full hover:bg-neutral-800 active:scale-95",
    // Outlined pill button
    Outline: "bg-white text-black border border-black px-6 py-2 rounded-full hover:bg-neutral-100 active:scale-95",
    // Small action button in table rows
    Action: "bg-white text-black border border-black text-sm px-3 py-1 hover:bg-neutral-100 active:scale-95",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};