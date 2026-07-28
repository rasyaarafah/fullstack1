import React from "react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    children: React.ReactNode;
    variant?: "ghost" | "danger" | "primary";
}

export const IconButton = ({
    children,
    variant = "ghost",
    className = "",
    ...props
}: IconButtonProps) => {
    const baseStyles = "p-2 rounded-lg transition-colors flex items-center justify-center cursor-pointer";

    const variants = {
        ghost: "text-gray-600 hover:bg-gray-100 active:bg-gray-200",
        danger: "text-red-600 hover:bg-red-50 active:bg-red-100",
        primary: "text-blue-600 hover:bg-blue-50 active:bg-blue-100",
    };

    return (
        <button 
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
        >
            {children}

        </button>
    );
};
 

